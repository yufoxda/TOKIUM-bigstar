class ChangeInvoiceToString < ActiveRecord::Migration[7.0]
  def change
    change_column :spend_request_items, :invoice_number, :string
  end
end