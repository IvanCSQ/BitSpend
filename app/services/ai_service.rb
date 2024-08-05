class AiService
  require 'json'
  require 'date'
  include ActionController::Live # allows us to stream response based on server-sent events, i.e. can initialise SSE below

  # Initialise with user's prompt and the metadata of the webpage which allows streaming
  def initialize(prompt: "", response:)
    @prompt = prompt
    @response = response
  end

  class TextInput < AiService
    def call

      # See the schema method below under private methods. You can edit the schemas there.
      schema_to_use = schema('complex')

      # Prompts must always be formatted as follows
      new_message = {
        role: 'user',
        parts: {
          text: @prompt
        }
      }

      # Check if there has been any conversation history
      if Conversation.last.present?
        # If yes, update the Conversation record with the user's prompt
        conversation = Conversation.last
        updated_messages = conversation.messages << new_message
        conversation.update(messages: updated_messages)
      else
        # If no, initialise a new Conversation record with the user's prompt
        Conversation.create!(messages: [new_message])
        conversation = Conversation.last
      end

      # Config instructions to force the AI to only return json responses based on the schema we specify
      config = {
        response_mime_type: 'application/json',
        response_schema: schema_to_use
      }

      # Calls the method to call the LLM for streaming response
      get_response(@response, conversation, config, schema_to_use)
    end
  end

  private

  def get_response(response, conversation, config, schema)
    sse = SSE.new(response.stream, event: "message")
    metadata = ""
    full_reply = []

    puts "This is the full prompt: #{conversation.messages}"

    begin
      # This streaming method returns a series of events which are added to the full_reply array
      client.stream_generate_content({
        contents: conversation.messages, generation_config: config
        }) do |event, parsed, raw|
          unless event == nil
            full_reply << event['candidates'][0]['content']['parts'][0]['text']
          else
            metadata = response
          end
        end

      ensure
        # Add today's date manually
        reply_json = JSON.parse(full_reply.join)
        reply_json['expense']['date'] = Date.today.strftime
        reply_to_save = reply_json.to_json
        # We join full_reply into a string to stream it
        expense = reply_json['expense']
        reply_to_print = "#{expense['category']}:\n\n$#{format('%.2f', expense['amount'])} for #{expense['name']} on #{expense['date']}\n\nTags: #{expense['tag_list'].join(', ')}.\n\nPlease let me know if I got this right. Otherwise, hit 'Save Expense' to save this to your records."
        sse.write({ message: reply_to_print })
        sse.close
      end

      puts "This is the raw response: #{full_reply}"
    # Now we update the current Conversation record with the LLM's actual response
    new_message = {
      role: 'model',
      parts: {
        text: reply_to_save
      }
    }
    conversation = Conversation.last
    updated_messages = conversation.messages << new_message
    conversation.update(messages: updated_messages)
  end

  def client
    @_client ||= Gemini.new(
      credentials: {
        service: 'vertex-ai-api',
        file_path: 'google-credentials.json',
        region: 'asia-southeast1'
      },
      options: { model: 'gemini-1.5-pro', server_sent_events: true }
    )
  end

  def schema(option)
    # Note that I am hardcoding first user to take categories from, since not all users have categories
    categories = User.first.categories.pluck(:name)
    # user_expenses = Expense.joins(:category).includes(:tags).where(categories: { user: User.first })
    # user_tags = user_expenses.flat_map { |expense| expense.tags.pluck('name') }.uniq
    # today = Date.today.strftime

    # complex_prompt = 'I spent $27.50 at Jade Chicken today with friends today for lunch.'
    complex_schema = {
      type: 'object',
      properties: {
        expense: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: "The name of the establishment where the expense was incurred (e.g., 'MacDonalds', 'Cold Storage') or a description of the expense (e.g. 'Lunch', 'Snacks')."
            },
        # Gemini does not seem to understand the concept of date
            # date: {
            #   type: 'string',
            #   format: 'date',
            #   description: "The date when the expense occurred in YYYY-MM-DD format.",
            #   default: today #'2024-07-28'
            # },
            amount: {
              type: 'number',
              description: "The monetary amount of the expense."
            },
            category: {
              type: 'string',
              enum: categories,
              description: "The category of the expense. Must be one of the predefined values."
            },
            tag_list: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: "A list of tags or keywords associated with the expense which should be inferred from the context. For example, from an input stating 'had dinner with family for $120 at Haidilao', the tag_list would be ['family', 'dinner']."
            }
          },
          required: ['name', 'amount', 'category', 'tag_list'],
          description: "An object representing an individual expense entry."
        }
      }
    }

    # simple_prompt = 'I spent $10.50 at Cold Storage on vegetables and fruits today.'
    simple_schema = {
      type: 'object',
      properties: {
        expense: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            amount: {
              type: 'number'
            },
            category: {
              type: 'string',
              enum: categories
            },
          },
          required: ['name', 'amount', 'category']
        }
      }
    }
    return simple_schema if option == 'simple'
    return complex_schema if option == 'complex'
  end
end
