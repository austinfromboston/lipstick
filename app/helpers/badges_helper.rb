module BadgesHelper
  def badge_to_json( badge_name, target_name = nil )
    base =  !target_name.blank? ? { :target => target_name } : {} 
    view_folder = controller_name.underscore
    base.merge( { :content => render_to_string( :partial => "#{view_folder}/badges/#{badge_name}.html.haml" )  }).to_json
  end
end
