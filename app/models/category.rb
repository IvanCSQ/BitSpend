class Category < ApplicationRecord
  belongs_to :user
  has_many :expenses

  def monthly_expense(month)
    total = 0

    expenses.each do |expense|
      total += expense.amount if expense.date.strftime('%B%Y') == month
    end

    total
  end
end
