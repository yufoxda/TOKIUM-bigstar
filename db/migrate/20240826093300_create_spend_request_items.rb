class CreateSpendRequestItems < ActiveRecord::Migration[7.0]
    def change
      create_table :spend_request_items, id: :uuid do |t|
        t.date :date_of_use, null: false # date of use
        t.integer :amount, null: false # spend  money
        t.text :spend_to, null: false # 支払先
        t.string :keihi_class, null: false # 経費科目
        t.text :purpose, null: false # purpose
        t.integer :invoice_number # 適格請求書番号
        t.integer :contact_number # 連絡請求番号
        t.text :memo # memo
        t.text :image_save # file path of recipt image
        t.uuid :spend_request_id, null:false #spendrequestへのID
  
        t.timestamps
      end
  
      add_foreign_key :spend_request_items, :spend_requests, column: :spend_request_id
      add_index :spend_request_items, :spend_request_id
    end
  end
  