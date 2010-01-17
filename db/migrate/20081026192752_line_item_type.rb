class LineItemType < ActiveRecord::Migration
  def self.up
    add_column "line_items", "category", :string, :limit => 40
    add_column "line_items", "story_header", :string, :limit => 100
    add_column "line_items", "contract_id", :integer
    add_column "line_items", "account_id", :integer
  end

  def self.down
    remove_column "line_items", "account_id"
    remove_column "line_items", "contract_id"
    remove_column "line_items", "story_header"
    remove_column "line_items", "category"
  end
end
