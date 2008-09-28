class Contact < ActiveResource::Base
  self.site = Stasi::CONFIG[:url]
  self.password = Stasi::CONFIG[:key]
  self.user = Stasi::CONFIG[:default_user]
end
