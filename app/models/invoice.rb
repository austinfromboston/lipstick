class Invoice < ActiveRecord::Base
  belongs_to :account
  has_and_belongs_to_many :line_items
  def amount_due
    line_items.sum(:final_amount)
  end
end
