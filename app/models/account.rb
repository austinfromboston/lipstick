class Account < ActiveRecord::Base
  has_and_belongs_to_many :contacts
  has_many :contracts
  has_many :line_items
  has_many :invoices
  belongs_to :organization
end
