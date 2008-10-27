class Account < ActiveRecord::Base
  has_many :account_people
  has_many :people
  has_many :contracts
  has_many :line_items
  has_many :invoices
  belongs_to :organization

  def people_list
    person_ids = account_people.map(&:person_id)
    return [] if person_ids.empty?
    Person.find :all, :params => { :ids => person_ids }
  end

  def contracts
    Contract.find :all, :params => { :query => { :account_id => id }}
  end

end

