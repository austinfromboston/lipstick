ActionController::Routing::Routes.draw do |map|
  map.resources :accounts, :has_many => :account_people
  map.resources :account_people
end
