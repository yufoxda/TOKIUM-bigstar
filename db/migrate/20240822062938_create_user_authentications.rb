class CreateUserAuthentications < ActiveRecord::Migration[7.0]
  def change
    create_table :user_authentications do |t|
      t.uuid :user_id, null: false
      t.string :provider
      t.string :uid

      t.timestamps
    end
    add_foreign_key :user_authentications, :users, column: :user_id
    add_index :user_authentications, :user_id
  end
end
