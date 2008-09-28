class Accounts < ActiveRecord::Migration
  def self.up
    create_table "accounts" do |t|
      t.float "current_balance"
      t.string "organization_name"
      t.integer "organization_id"
    end

    create_table "account_contacts" do |t|
      t.integer "account_id", "contact_id"
    end

    create_table "line_items" do |t|
      t.string "name"
      t.text "description"
      t.string "billable_status", :size => 30
      t.integer "source_id"
      t.float "initial_amount", "final_amount"
      t.datetime "activation_date"
      t.datetime "writeoff_date"
      t.timestamps
    end

    create_table "invoices" do |t|
      t.datetime "sent_date", "period_ending_date"
      t.text "sent_to_email"
      t.integer "account_id"
    end
  
    create_table "invoices_line_items", :id => false do |t|
      t.integer "invoice_id", "line_item_id"
    end
  end

  def self.down
    drop_table "invoices_line_items"
  
    drop_table "invoices"

    drop_table "line_items"

    drop_table "account_contacts"

    drop_table "accounts"
  end
end
