module LineinUrlsHelper
  def new_person_linein_path( options = {} )
    Linein::CONFIG[:aquarius][:json_url] + '/people/new'
  end
  def new_organization_person_linein_path( org, options = {} )
    Linein::CONFIG[:aquarius][:json_url] + "/organizations/#{ org.to_param }/people/new"
  end
end
