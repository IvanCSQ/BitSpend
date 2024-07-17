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
tom = User.new(uid: "Tom", password: "123456")
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
