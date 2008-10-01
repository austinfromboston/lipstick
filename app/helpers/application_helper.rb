# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper
  def organization_options
    Organization.find(:all).sort { |a, b| a.name <=> b.name }.map { |o| [ o.name, o.id ] }
  end
end
