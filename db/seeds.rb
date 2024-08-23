# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)
# 10人のユーザーをランダムに作成
users = 10.times.map do |i|
    User.create!(
      id: SecureRandom.uuid, 
      email: "user#{i + 1}@example.com",
      name: "User #{i + 1}", 
      profile: "This is the profile for User #{i + 1}.",
      role: ['admin', 'employee', 'manager'].sample
    )
  end
  
  # Spend Requestsのテストデータをランダムなユーザーに関連付けて作成
  20.times do |i|
    SpendRequest.create!(
      id: SecureRandom.uuid,
      user_id: users.sample.id,
      status: ['approved', 'pending', 'rejected'].sample,
      date_of_use: Date.today - i.days,
      amount: rand(1000..50000),
      spend_to: "Vendor #{i + 1}",
      keihi_class: ['交通費', '宿泊費', '接待費'].sample,
      purpose: "Purpose of spend #{i + 1}",
      invoice_number: rand(100000..999999),
      contact_number: rand(10000..99999),
      memo: "Memo for spend #{i + 1}",
      image_save: "path/to/image#{i + 1}.jpg"
    )
  end