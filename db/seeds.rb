# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

puts "Creating user..."
tom = User.new(uid: "Tom", password: "123456", email: "tom@gmail.com")
tom.save!
puts "Finished!"

puts "Creating categories..."
fnb = Category.new(name: "Food & Beverage", user: tom)
fnb.save!

shopping = Category.new(name: "Shopping", user: tom)
shopping.save!

grocery = Category.new(name: "Grocery", user: tom)
grocery.save!

entertainment = Category.new(name: "Entertainment", user: tom)
entertainment.save!

transport = Category.new(name: "Transport", user: tom)
transport.save!
puts "Finished!"

puts "Creating expenses..."
ntuc = Expense.new(date: Date.new(2024, 7, 15), name: "NTUC", amount: 24.50, category: grocery)
ntuc.save!

starbucks = Expense.new(date: Date.new(2024, 7, 17), name: "Starbucks", amount: 7, category: fnb)
starbucks.save!

jellycat = Expense.new(date: Date.new(2024, 7, 5), name: "Jellycat", amount: 99, category: shopping)
jellycat.save!

movie = Expense.new(date: Date.new(2024, 7, 17), name: "Shaw", amount: 17, category: entertainment)
movie.save!

grab = Expense.new(date: Date.new(2024, 7, 12), name: "Grab", amount: 23.70, category: transport)
grab.save!
puts "Finished!"
