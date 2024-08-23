# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id               :uuid             not null, primary key
#  email            :string
#  name             :string
#  profile          :text
#  role             :text
class User < ApplicationRecord
  has_many :spend_requests
  has_many :user_authentications
end
