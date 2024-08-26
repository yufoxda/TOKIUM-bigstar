class CreateSpendRequests < ActiveRecord::Migration[7.0]
  def change
    create_table :spend_requests, id: :uuid do |t|
      t.uuid :user_id, null: false # user id
      t.string :status, null:false # accept status
      t.date :date_of_use, null: false # date of use
      t.integer :amount, null: false # spend  money
      t.text :spend_to, null: false # 支払先
      t.string :keihi_class, null: false # 経費科目
      t.text :purpose, null:false
      t.integer :invoice_number # 適格請求書番号
      t.integer :contact_number # 連絡請求番号
      t.text :memo # memo
      t.text :image_save # file path of recipt image

      t.timestamps
    end

    add_foreign_key :spend_requests, :users, column: :user_id
    add_index :spend_requests, :user_id
  end
end
