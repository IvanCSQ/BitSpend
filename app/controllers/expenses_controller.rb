class ExpensesController < ApplicationController
  def index
    # user = current_user
    user_cat = []
    user_exp = []
    current_user.categories.each do |category|
      user_cat << category
    end
    @cats = user_cat.flatten

    current_user.expenses.each do |expense|
      user_exp << expense
    end
    @expenses = user_exp.flatten
    filter_exp = []
    filter_exp << user_exp.uniq { |expense| expense.name }
    @fil_exp = filter_exp.flatten
  end

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

    # Again hardcoding to first user. Should change to current user when all users have categories
    category = User.first.categories.find_by(name: expense_json[:expense][:category])
    expense_json[:expense][:category] = category

    return expense_json[:expense]
  end
end
