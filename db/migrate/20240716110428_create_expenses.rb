class CreateExpenses < ActiveRecord::Migration[7.1]
  def change
    create_table :expenses do |t|
      t.date :date
      t.float :amount
      t.string :name
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
