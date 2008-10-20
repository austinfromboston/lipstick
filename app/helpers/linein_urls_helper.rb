module LineinUrlsHelper
  def people_linein_path( options = {} )
    Linein::CONFIG[:aquarius][:json_url] + '/people'
  end
  def new_person_linein_path( options = {} )
    Linein::CONFIG[:aquarius][:json_url] + '/people/new'
  end
  def edit_person_linein_path( contact )
    Linein::CONFIG[:aquarius][:json_url] + "/people/#{contact.person_id}/edit"
  end
  def new_organization_linein_path( options = {} )
    Linein::CONFIG[:aquarius][:json_url] + '/organizations/new'
  end
  def new_organization_person_linein_path( org, options = {} )
    Linein::CONFIG[:aquarius][:json_url] + "/organizations/#{ org.to_param }/people/new"
  end

  def linein_host
    Linein::CONFIG[:aquarius][:json_url]
  end
end
