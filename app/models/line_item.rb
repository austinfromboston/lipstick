class LineItem < ActiveRecord::Base
  belongs_to :contract
  has_and_belongs_to_many :invoices
end
