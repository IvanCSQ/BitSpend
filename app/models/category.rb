class Category < ApplicationRecord
  belongs_to :user
  has_many :expenses

  def expenses_amount
    total = 0

    expenses.each do |expense|
      total += expense.amount
    end

    total
  end
end
