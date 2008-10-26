# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20081026192752) do

  create_table "account_people", :force => true do |t|
    t.integer "account_id"
    t.integer "person_id"
  end

  create_table "accounts", :force => true do |t|
    t.float   "current_balance"
    t.string  "organization_name"
    t.integer "organization_id"
  end

  create_table "invoices", :force => true do |t|
    t.datetime "sent_date"
    t.datetime "period_ending_date"
    t.text     "sent_to_email"
    t.integer  "account_id"
  end

  create_table "invoices_line_items", :id => false, :force => true do |t|
    t.integer "invoice_id"
    t.integer "line_item_id"
  end

  create_table "line_items", :force => true do |t|
    t.string   "name"
    t.text     "description"
    t.string   "billable_status"
    t.integer  "source_id"
    t.float    "initial_amount"
    t.float    "final_amount"
    t.datetime "activation_date"
    t.datetime "writeoff_date"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "category",        :limit => 40
    t.string   "story_header",    :limit => 100
    t.integer  "contract_id"
    t.integer  "account_id"
  end

end
