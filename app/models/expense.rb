class Expense < ApplicationRecord
  belongs_to :category

  acts_as_taggable_on :tags
end
