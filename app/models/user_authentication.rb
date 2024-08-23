# frozen_string_literal: true

# == Schema Information
#
# Table name: user_authentications
#
#  id         :bigint           not null, primary key
#  user_id    :uuid             not null
#  provider   :string
#  uid        :string
class UserAuthentication < ApplicationRecord
  belongs_to :user
end
