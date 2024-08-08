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

    temp_image_path = Rails.root.join('tmp', image.original_filename)
    File.open(temp_image_path, 'wb') do |file|
      file.write(image.read)
    end

    session[:temp_image_path] = temp_image_path.to_s
    session[:image_content_type] = image.content_type
    render json: { message: "Image uploaded successfully" }
  end

  def stream_response
    response.headers['Content-Type'] = "text/event-stream"
    response.headers['Cache-Control'] = 'no-cache'
    response.headers['Last-Modified'] = Time.now.httpdate


    image = session[:temp_image_path]
    image_content_type = session[:image_content_type]

    begin
      # Process the image (assuming AiService::UploadImage processes the image and returns a response)
      AiService::UploadImage.new(image: image, image_content_type: image_content_type, response: response).call
      render json: { message: "Image uploaded successfully" }
    rescue StandardError => e
      logger.error("Error processing image: #{e.message}")
      render json: { error: e.message }, status: :internal_server_error
    ensure
      # Clean up the temporary file
      File.delete(image) if File.exist?(image)
    end
  end
end
