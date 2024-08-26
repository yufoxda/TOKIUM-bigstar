class DeleteSpendRequests < ActiveRecord::Migration[7.0]
    def change
      # カラムの削除
      remove_column :spend_requests, :date_of_use, :date
      remove_column :spend_requests, :amount, :integer
      remove_column :spend_requests, :keihi_class, :string
      remove_column :spend_requests, :purpose, :text
      remove_column :spend_requests, :invoice_number, :integer
      remove_column :spend_requests, :contact_number, :integer
      remove_column :spend_requests, :memo, :text
      remove_column :spend_requests, :image_save, :text
    end
  end
  