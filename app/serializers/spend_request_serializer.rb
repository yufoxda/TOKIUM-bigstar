class SpendRequestSerializer < ActiveModel::Serializer
  attributes :id, :status, :date_of_use, :amount, :spend_to, :user_id,
  :keihi_class, :purpose, :invoice_number, :contact_number, :memo, :image_save
end
