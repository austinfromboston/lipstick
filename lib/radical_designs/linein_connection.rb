module RadicalDesigns
  class LineinConnection
    def transfer
      puts "starting orgs"
      Organization.find(:all).each do |org|
        next if Account.find_by_organization_id(org.id)
        acct = Account.create :organization_id => org.id, :organization_name => org.name
        puts org.name

        #projects
        Project.find(:all, :params => { :query => { :organization_id => org.id }} ).each do |proj|
          #contracts
          Contract.find(:all, :params => { :query => { :project_id => proj.id }} ).each do |contract|
            contract.account_id = acct.id
            contract.save
          end
        end
      end
    end
=begin      
      puts "starting projects"
      Project.all.each do |project|
        next if project.linein_project_id
        puts project.display_name
        lp = Linein::Project.create project.linein_attributes
        project.linein_project_id = lp.id
        project.save

        #org
        unless project.organization.blank?
          unless org = Linein::Organization.find( :first, :params => { :query => { :name => project.organization }} )
            org = Linein::Organization.create :name => project.organization
          end
          project.linein_organization_id = org.id
          lp.organization_id = org.id
          lp.save
          project.save

        end

        #affiliations
        if project.linein_organization_id
          project.contacts.each do |contact|
            next unless contact.linein_person_id
            unless aff = Linein::Affiliation.find( :first, :params => { :query => { :person_id => contact.linein_person_id, :organization_id => project.linein_organization_id } } )
              Linein::Affiliation.create :person_id => contact.linein_person_id, :organization_id => project.linein_organization_id 
            end
          end
        end

        #contracts
        project.contracts.each do |contract|
          next if contract.linein_contract_id
          lcon = Linein::Contract.create contract.linein_attributes
          contract.linein_contract_id = lcon.id
          contract.save
        end
      end
=end
  end
end

