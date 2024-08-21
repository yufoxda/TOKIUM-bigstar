class CreateUserTable < ActiveRecord::Migration[7.0]
  def change
    create_table :users, id: :uuid do |t|
      t.string :name, null: false
      t.string :password_digest, null: false
      t.string :authority, null: false

      t.timestamps
    end
  end
end
