module LineinUrlsHelper

  def linein_url( route_name, *args ) 
    send( route_name, *args ).sub(/^\/linein/, linein_host )
  end

  def linein_host
    Linein::CONFIG[:aquarius][:json_url]
  end
end
