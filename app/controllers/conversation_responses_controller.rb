class ConversationResponsesController < ApplicationController
  include ActionController::Live # allows us to stream response based on server-sent events

  def index
    response.headers['Content-Type'] = "text/event-stream"
    response.headers['Last-Modified'] = Time.now.httpdate
    prompt = params[:prompt]

    # Change this service whenever another is needed
    begin
      AiService::TextInput.new(prompt: prompt, response: response).call
    rescue StandardError => e
      puts "An error occurred: #{e.message}"
    end

  end

  def upload
    response.headers['Content-Type'] = "text/event-stream"
    image = params[:image]

    begin
      # Process the image (assuming AiService::UploadImage processes the image and returns a response)
      result = AiService::UploadImage.new(image: image, response: response).call
      render json: { message: "Image uploaded successfully", result: result }
    rescue StandardError => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end
end
