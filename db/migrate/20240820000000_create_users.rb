class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    # id to uuid
    create_table :users, id: :uuid do |t|
      t.string :email
      t.string :name
      t.text :profile
      t.text :role

      t.timestamps
    end
  end
end
