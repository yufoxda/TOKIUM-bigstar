# frozen_string_literal: true
#
# SpendRequest model
#
# This model is used to store the spend request data.
#
# Attributes:
#   user_id: UUID
#   status: string
#   spend_to: text

class SpendRequest < ApplicationRecord
  belongs_to :user
  has_many :spend_request_item
end
