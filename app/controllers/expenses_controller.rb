class ExpensesController < ApplicationController
  def analysis
    @total = current_user.total_expenses_amount
  end
end
