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
    image = params[:image]
    if image.nil?
      render json: { error: "No image provided" }, status: :bad_request
      return
    end

    session[:image_path] = image.path
    render json: { message: "Image uploaded successfully" }
  end

  def stream_response
    response.headers['Content-Type'] = "text/event-stream"
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Last-Modified'] = Time.now.httpdate

    image = session[:image_path]

    begin
      # Process the image (assuming AiService::UploadImage processes the image and returns a response)
      AiService::UploadImage.new(image: image, response: response).call
      render json: { message: "Image uploaded successfully", result: result }
    rescue StandardError => e
      render json: { error: e.message }, status: :internal_server_error
    end
  end
end
