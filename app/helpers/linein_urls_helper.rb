module LineinUrlsHelper
  def new_person_linein_path( options = {} )
    Linein::CONFIG[:aquarius][:json_url] + '/people/new.json?badge=new_remote_form&badge_target=%23sidebar_inset&callback=RD.ui.show_badge'
  end
end
