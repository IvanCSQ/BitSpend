class AiService
  require 'json'
  include ActionController::Live # allows us to stream response based on server-sent events, i.e. can initialise SSE below

  # Initialise with user's prompt and the metadata of the webpage which allows streaming
  def initialize(prompt: "", response:)
    @prompt = prompt
    @response = response
  end

  class TextInput < AiService
    def call
      puts "This is the prompt: #{@prompt}"
      puts "This is the response: #{@response}"

      # See the schema method below under private methods. You can edit the schemas there.
      schema_to_use = schema('simple')

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
      # We join full_reply into a string to stream it
      sse.write({ message: full_reply.join })
      sse.close
    end

    # Now we update the current Conversation record with the LLM's response
    new_message = {
      role: 'model',
      parts: {
        text: full_reply.join
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

    # complex_prompt = 'I spent $27.50 at Jade Chicken today with friends today for lunch.'
    complex_schema = {
      type: 'object',
      properties: {
        expense: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            date: {
              type: 'string'
            },
            amount: {
              type: 'number'
            },
            category: {
              type: 'string',
              enum: categories
            },
            taggings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  # To be filled in with Taggable attributes; not sure how to access them
                }
              }
            }
          }
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