class ConversationsController < ApplicationController
  def index
    @user = current_user
    @conversation = Conversation.last
  end

  def destroy
    raise
    @conversation = Conversation.find(params[:id])
    Conversation.last&.destroy
  end
end
