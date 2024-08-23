# frozen_string_literal: true
#
# SpendRequest model
#
# This model is used to store the spend request data.
#
# Attributes:
#   user_id: UUID
#   status: string
#   date_of_use: date
#   amount: integer
#   spend_to: text
#   keihi_class: string
#   purpose: text
#   invoice_number: integer
#   contact_number: integer
#   memo: text
#   image_save: text

class SpendRequest < ApplicationRecord
  belongs_to :user
end
