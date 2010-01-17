class AccountPerson < ActiveRecord::Base
  belongs_to :account
  belongs_to :person
end
