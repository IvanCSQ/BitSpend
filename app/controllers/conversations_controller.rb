class ConversationsController < ApplicationController
  def index
    @user = current_user
    @conversation = Conversation.last
  end

  def clearconvo
    begin
      # Attempt to delete all conversations
      Conversation.delete_all

      # Check if any records were deleted
      if Conversation.count == 0
        # Return a success response if records were deleted
        render json: { message: 'Conversation history cleared successfully' }, status: :ok
      else
        # Return an error response if no records were deleted
        render json: { errors: ['Failed to clear conversation history'] }, status: :unprocessable_entity
      end
    rescue StandardError => e
      # Handle any unexpected errors
      render json: { errors: [e.message] }, status: :internal_server_error
    end
  end
end
