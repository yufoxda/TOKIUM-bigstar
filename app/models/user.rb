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
end
