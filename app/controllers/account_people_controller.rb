class AccountPeopleController < ResourcefulController
  make_resourceful do
    actions :all
    belongs_to :account
  end
end
