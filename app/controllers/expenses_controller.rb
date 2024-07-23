class ExpensesController < ApplicationController
  def analysis
    params[:date] = Date.today.strftime('%B%Y') if params[:date].nil?
  end
end
