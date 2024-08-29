class ChangeTelToString < ActiveRecord::Migration[7.0]
  def change
    change_column :spend_request_items, :contact_number, :string
  end
end