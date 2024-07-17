# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
puts "Cleaning database..."
Expense.destroy_all
Category.destroy_all
User.destroy_all

puts "Creating users..."
user1 = User.create!(email: "test1@bitspend.com", password: "password")
puts "User 1 created!"
user2 = User.create!(email: "test2@bitspend.com", password: "password")
puts "User 2 created!"

puts "Creating categories..."
u1cat1 = Category.create!(name: "Food & Drink", user: user1)
u1cat2 = Category.create!(name: "Transportation", user: user1)
u1cat3 = Category.create!(name: "Shopping", user: user1)
u1cat4 = Category.create!(name: "Housing", user: user1)
u1cat5 = Category.create!(name: "Others", user: user1)
puts "5 Categories created for User 1!"

puts "Proceeding to create categories for User 2..."
u2cat1 = Category.create!(name: "Food & Drink", user: user2)
u2cat2 = Category.create!(name: "Entertainment", user: user2)
u2cat3 = Category.create!(name: "Medical", user: user2)
u2cat4 = Category.create!(name: "Travel", user: user2)
u2cat5 = Category.create!(name: "Others", user: user2)
puts "5 Categories created for User 2!"

puts "Creating expenses..."
# Expense.create!(date: "2024-01-01", name: "Breakfast", amount: 5.00, category: u1cat1, tag_list: "morning, milk, bread")
Expense.create!(date: "2024-07-01", name: "Breakfast", amount: 5.00, category: u1cat1, tag_list: "morning, milk, bread")
Expense.create!(date: "2024-07-02", name: "Lunch", amount: 8.00, category: u1cat1, tag_list: "lunch, meat, vegetables")
Expense.create!(date: "2024-07-03", name: "Dinner", amount: 12.00, category: u1cat1, tag_list: "dinner, seafood, rice")
Expense.create!(date: "2024-07-04", name: "Bus ticket", amount: 2.50, category: u1cat2, tag_list: "transportation, public, bus")
Expense.create!(date: "2024-07-05", name: "Taxi ride", amount: 15.00, category: u1cat2, tag_list: "transportation, taxi, travel")
Expense.create!(date: "2024-07-06", name: "Groceries", amount: 40.00, category: u1cat3, tag_list: "shopping, food, groceries")
Expense.create!(date: "2024-07-07", name: "Movie ticket", amount: 10.00, category: u1cat3, tag_list: "shopping, entertainment, movie")
Expense.create!(date: "2024-07-08", name: "Rent", amount: 800.00, category: u1cat4, tag_list: "housing, rent, payment")
Expense.create!(date: "2024-07-09", name: "Utilities", amount: 100.00, category: u1cat4, tag_list: "housing, utilities, bills")
Expense.create!(date: "2024-07-10", name: "Haircut", amount: 20.00, category: u1cat5, tag_list: "others, personal care, haircut")
Expense.create!(date: "2024-07-11", name: "Phone bill", amount: 50.00, category: u1cat5, tag_list: "others, communication, phone")
Expense.create!(date: "2024-07-12", name: "Coffee", amount: 3.00, category: u1cat1, tag_list: "drink, caffeine, beverage")
Expense.create!(date: "2024-07-13", name: "Restaurant dinner", amount: 25.00, category: u1cat1, tag_list: "dinner, restaurant, outing")
Expense.create!(date: "2024-07-14", name: "Train ticket", amount: 10.00, category: u1cat2, tag_list: "transportation, train, travel")
Expense.create!(date: "2024-07-15", name: "Car maintenance", amount: 50.00, category: u1cat2, tag_list: "transportation, car, repair")
Expense.create!(date: "2024-07-16", name: "Clothing", amount: 30.00, category: u1cat3, tag_list: "shopping, clothes, apparel")
Expense.create!(date: "2024-07-17", name: "Book", amount: 15.00, category: u1cat3, tag_list: "shopping, education, book")
Expense.create!(date: "2024-07-18", name: "Internet bill", amount: 60.00, category: u1cat4, tag_list: "housing, internet, subscription")
Expense.create!(date: "2024-07-19", name: "Gym membership", amount: 40.00, category: u1cat5, tag_list: "others, health, fitness")
Expense.create!(date: "2024-07-20", name: "Streaming service", amount: 15.00, category: u1cat5, tag_list: "others, entertainment, subscription")
Expense.create!(date: "2024-07-21", name: "Lunch meeting", amount: 12.00, category: u1cat1, tag_list: "lunch, business, meeting")
Expense.create!(date: "2024-07-22", name: "Gas", amount: 20.00, category: u1cat2, tag_list: "transportation, car, fuel")
Expense.create!(date: "2024-07-23", name:  "Gift", amount: 25.00, category: u1cat3, tag_list: "shopping, gift, present")
Expense.create!(date: "2024-07-24", name: "Concert ticket", amount: 35.00, category: u1cat3, tag_list: "shopping, entertainment, concert")
Expense.create!(date: "2024-07-25", name: "Movie rental", amount: 5.00, category: u1cat3, tag_list: "shopping, entertainment, movie")
Expense.create!(date: "2024-07-26", name: "Home insurance", amount: 100.00, category: u1cat4, tag_list: "housing, insurance, home")
Expense.create!(date: "2024-07-27", name: "Doctor visit", amount: 50.00, category: u1cat5, tag_list: "others, health, medical")
Expense.create!(date: "2024-07-28", name: "Medicine", amount: 10.00, category: u1cat5, tag_list: "others, health, medication")
Expense.create!(date: "2024-07-29", name: "Haircut", amount: 20.00, category: u1cat5, tag_list: "others, personal care, haircut")
Expense.create!(date: "2024-07-30", name: "Lunch", amount: 8.00, category: u1cat1, tag_list: "lunch, takeout, food")
puts "30 Expenses created for User 1!"
puts "Proceeding to create expenses for User 2..."
Expense.create!(date: "2024-07-01", name: "Coffee", amount: 3.00, category: u2cat1, tag_list: "drink, caffeine, beverage")
Expense.create!(date: "2024-07-05", name: "Restaurant dinner", amount: 40.00, category: u2cat1, tag_list: "dinner, restaurant, outing")
Expense.create!(date: "2024-07-10", name: "Movie tickets", amount: 20.00, category: u2cat2, tag_list: "entertainment, movie, cinema")
Expense.create!(date: "2024-07-12", name: "Concert ticket", amount: 50.00, category: u2cat2, tag_list: "entertainment, concert, music")
Expense.create!(date: "2024-07-15", name: "Doctor visit", amount: 75.00, category: u2cat3, tag_list: "medical, health, appointment")
Expense.create!(date: "2024-07-17", name: "Prescription medication", amount: 25.00, category: u2cat3, tag_list: "medical, medication, prescription")
Expense.create!(date: "2024-07-08", name: "Weekend trip", amount: 200.00, category: u2cat4, tag_list: "travel, weekend, getaway")
Expense.create!(date: "2024-07-18", name: "Flight ticket", amount: 300.00, category: u2cat4, tag_list: "travel, flight, transportation")
Expense.create!(date: "2024-07-03", name: "Haircut", amount: 20.00, category: u2cat5, tag_list: "others, personal care, haircut")
Expense.create!(date: "2024-07-20", name: "Gift", amount: 15.00, category: u2cat5, tag_list: "others, gift, present")
Expense.create!(date: "2024-07-02", name: "Lunch", amount: 8.00, category: u2cat1, tag_list: "lunch, takeout, food")
Expense.create!(date: "2024-07-06", name: "Groceries", amount: 50.00, category: u2cat1, tag_list: "shopping, food, groceries")
Expense.create!(date: "2024-07-11", name: "Streaming service", amount: 15.00, category: u2cat2, tag_list: "entertainment, subscription, streaming")
Expense.create!(date: "2024-07-13", name: "Book", amount: 20.00, category: u2cat2, tag_list: "entertainment, education, book")
Expense.create!(date: "2024-07-16", name: "Dentist appointment", amount: 100.00, category: u2cat3, tag_list: "medical, dental, appointment")
Expense.create!(date: "2024-07-02", name: "Lunch", amount: 8.00, category: u2cat1, tag_list: "lunch, takeout, food")
Expense.create!(date: "2024-07-03", name: "Restaurant dinner", amount: 40.00, category: u2cat1, tag_list: "dinner, restaurant, outing")  # Invalid date (assuming typo)
Expense.create!(date: "2024-07-05", name: "Groceries", amount: 50.00, category: u2cat1, tag_list: "shopping, food, groceries")
Expense.create!(date: "2024-07-06", name: "Movie tickets", amount: 20.00, category: u2cat2, tag_list: "entertainment, movie, cinema")
Expense.create!(date: "2024-07-08", name: "Weekend trip", amount: 200.00, category: u2cat4, tag_list: "travel, weekend, getaway")
Expense.create!(date: "2024-07-10", name: "Streaming service", amount: 15.00, category: u2cat2, tag_list: "entertainment, subscription, streaming")
Expense.create!(date: "2024-07-11", name: "Book", amount: 20.00, category: u2cat2, tag_list: "entertainment, education, book")
Expense.create!(date: "2024-07-12", name: "Concert ticket", amount: 50.00, category: u2cat2, tag_list: "entertainment, concert, music")
Expense.create!(date: "2024-07-13", name: "Doctor visit", amount: 75.00, category: u2cat3, tag_list: "medical, health, appointment")
Expense.create!(date: "2024-07-15", name: "Prescription medication", amount: 25.00, category: u2cat3, tag_list: "medical, medication, prescription")
Expense.create!(date: "2024-07-16", name: "Dentist appointment", amount: 100.00, category: u2cat3, tag_list: "medical, dental, appointment")
Expense.create!(date: "2024-07-17", name: "Haircut", amount: 20.00, category: u2cat5, tag_list: "others, personal care, haircut")
Expense.create!(date: "2024-07-18", name: "Flight ticket", amount: 300.00, category: u2cat4, tag_list: "travel, flight, transportation")
puts "20 Expenses created for User 2!"

puts "Seeds created successfully!"
