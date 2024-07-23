class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 20]
      user.full_name = auth.info.name
      user.avatar_url = auth.info.image
    end
  end

  has_many :categories
  has_many :expenses, through: :categories

  def total_monthly_expense(month)
    total = 0

    expenses.each do |expense|
      total += expense.amount if expense.date.strftime('%B%Y') == month
    end

    total
  end

  def category_monthly_expense(month)
    total_per_category = {}

    expenses.each do |expense|
      if expense.date.strftime('%B%Y') == month
        total_per_category[expense.category.name] ? total_per_category[expense.category.name] += expense.amount : total_per_category[expense.category.name] = expense.amount
      end
    end

    total_per_category
  end

  def months_with_expenses
    expenses_month_year = expenses.map do |expense|
      expense.date.strftime('%B %Y')
    end

    expenses_month_year.uniq
  end
end
