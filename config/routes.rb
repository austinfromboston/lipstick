ActionController::Routing::Routes.draw do |map|
  map.resources :accounts, :has_many => [ :account_people, :invoices ]
  map.resources :account_people
  map.resources :line_items
  map.resources :invoices
  map.resources :contracts do |contract|
    contract.resources :line_items 
  end

  #map.with_options( {} ) do |linein|
  map.namespace :linein, :name_prefix => nil  do |linein|
    linein.resources :contracts
    linein.resources :people
    linein.resources :organizations, :has_many => :people
    linein.resources :projects
  end
end
