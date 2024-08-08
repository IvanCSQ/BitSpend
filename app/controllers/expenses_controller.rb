class ExpensesController < ApplicationController
  def index
    params[:date] = Date.today.strftime('%B%Y') if params[:date].nil?
    @cats = current_user.categories
    @tags = current_user.expenses.where('extract(month from date) = ? AND extract(year from date) = ?', Date.today.month, Date.today.year).flat_map(&:tag_list).uniq
    # @expenses = current_user.expenses.to_json
    # filter current_user expenses by date
    @expenses = current_user.expenses.where('extract(month from date) = ? AND extract(year from date) = ?', Date.today.month, Date.today.year).to_json

  end

  # def index
  #   if params[:date].nil?
  #     @date = Date.today
  #   else
  #     month, year = params[:date].split('-').map(&:to_i)
  #     @date = Date.new(year, month)
  #   end

  #   params[:date] ||= @date.strftime('%B%Y')

  #   @cats = current_user.categories
  #   @expenses = current_user.expenses
  #                         .where('extract(month from date) = ? AND extract(year from date) = ?', @date.month, @date.year)
  #   @tags = @expenses.flat_map(&:tag_list).uniq

  #   respond_to do |format|
  #     format.html # regular request
  #     format.json { render json: { expenses: @expenses.to_json, tags: @tags } } # AJAX request
  #   end
  # end



  def create
    @expense = Expense.new(expense_params)
    if @expense.save
      render json: @expense, status: :created
      Conversation.delete_all
    else
      render json: { errors: @expense.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def analysis
    params[:date] = Date.today.strftime('%B %Y') if params[:date].nil?
  end

  private

  def expense_params
    expense_string = Conversation.last.messages[-1]['parts']['text']
    expense_hash = JSON.parse(expense_string).symbolize_keys!
    expense_hash[:expense].symbolize_keys!
    expense = expense_hash[:expense]
    expense[:tag_list] = expense[:tag_list].join(", ")

    # Again hardcoding to first user. Should change to current user when all users have categories
    expense[:category] = User.first.categories.find_by(name: expense[:category])

    # TO be removed! Changing the 'establishment' key to 'name' temporarily
    # expense = expense.transform_keys! do |key|
    #   key == :establishment ? :name : key
    # end

    return expense
  end
end
