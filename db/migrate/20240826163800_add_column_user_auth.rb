class AddColumnUserAuth < ActiveRecord::Migration[7.0]
  def change
    add_column :user_authentications, :token, :string
    add_column :user_authentications, :refresh_token, :string
    add_column :user_authentications, :expires_at, :datetime
  end
end