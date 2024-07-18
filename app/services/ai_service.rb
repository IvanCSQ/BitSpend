class AiService
  require 'json'

  def initialize(prompt, response)
    @prompt = prompt
    @response = response
  end

  def call
    puts "This is the prompt: #{@prompt[:prompt]}"

    complex_prompt = 'I spent $27.50 at Jade Chicken today. This includes a $7.50 chicken tenders and $20 half chicken. Generate a json that describes this expense including the establishment, date, amount, category and items bought.'
    complex_schema = {
      type: 'object',
      properties: {
        expense: {
          type: 'object',
          properties: {
            establishment: {
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
              enum: ['Food', 'Transportation', 'Entertainment', 'Groceries', 'Apparel']
            },
            items_bought: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string'
                  },
                  amount: {
                    type: 'number'
                  }
                }
              }
            }
          }
        }
      }
    }

    simple_prompt = 'I spent $10.50 at Cold Storage on vegetables and fruits today. Generate a json that describes this expense.'
    simple_schema = {
      type: 'object',
      properties: {
        expense: {
          type: 'object',
          properties: {
            establishment: {
              type: 'string'
            },
            amount: {
              type: 'number'
            },
            category: {
              type: 'string',
              enum: ['Food', 'Transportation', 'Entertainment', 'Groceries', 'Apparel']
            },
          },
          required: ['establishment', 'amount', 'category']
        }
      }
    }

    messages = { contents: { role: 'user', parts: { text: @prompt[:prompt] } } }
    get_response(@response, messages)

    # result = client.stream_generate_content(
    #   { contents: { role: 'user', parts: { text: @prompt[:prompt] } } }
    # )
    # puts result
    # return result

    # client.stream_generate_content(
    #   { contents: { role: 'user', parts: { text: @prompt[:prompt] } } }
    # ) do |event, parsed, raw|
    #   return event
    # end

    # result = client.generate_content({
    #   contents: {
    #     role: 'user',
    #     parts: {
    #       text: @prompt + " Generate a json that describes this expense."
    #     }
    #   },
    #   generation_config: {
    #     response_mime_type: 'application/json',
    #     response_schema: simple_schema
    #   }
    # })
    # puts result
    # text = result['candidates'][0]['content']['parts'][0]['text']
    # parsed_text = JSON.parse(text)
    # puts parsed_text
    # return parsed_text
  end

  private

  def get_response(response, messages)
    sse = SSE.new(response.stream, event: "message")
    metadata = ""
    full_reply = []
    begin
      client.stream_generate_content(messages, stream: ->(chunk, response) {
      unless chunk == nil
        full_reply << chunk
      else
        metadata = response
      end
    })
    ensure
      sse.write({ message: full_reply.join })
      sse.close
    end
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

end
