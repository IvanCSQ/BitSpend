class ExpensesController < ApplicationController

  def create
    @expense = Expense.new(expense_params)
    if @expense.save
      render json: @expense, status: :created
      Conversation.delete_all
    else
      render json: { errors: @expense.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private
  def expense_params
    expense_string = Conversation.last.messages[-1]['parts']['text']
    expense_json = JSON.parse(expense_string).symbolize_keys!
    expense_json[:expense].symbolize_keys!
    expense = expense_json[:expense]
    expense[:tag_list] = expense[:tag_list].join(", ")

    # Again hardcoding to first user. Should change to current user when all users have categories
    expense[:category] = User.first.categories.find_by(name: expense[:category])

    # TO be removed! Changing the 'establishment' key to 'name' temporarily
    expense = expense.transform_keys! do |key|
      key == :establishment ? :name : key
    end

    return expense
  end
end
