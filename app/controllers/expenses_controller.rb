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
end
