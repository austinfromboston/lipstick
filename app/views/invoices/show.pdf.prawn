header margin_box.top_left, :width => 500 do
  text_options.update(:size => 50, :align => :right)
  fill_color 'ee9900'
  text 'radical', :at => [ 130, 671 ], :style => :normal
  fill_color '000000'
  text 'DESIGNS', :style => :bold
  text '1370 Mission St, Floor 4, San Francisco, CA 94703  |  billing@radicaldesigns.org  |  415-738-0456', :size => 10, :style => :italic
end

contact = invoice.account.people_list.first
period_covered = "Period ending: #{invoice.period_ending_date.strftime("%B %d, %Y")}"

bounding_box [ margin_box.left + 50, 620 ], :width => 500 do
  text_options.update(:size => 10, :align => :left)

  pad_bottom(10) do
    #table [[ [contact.name, invoice.account.organization_name, contact.email, contact.phone].join("\n"), ( invoice.account.contracts.map(&:name) << period_covered ).join("\n") ]],
    #cell [ 0, 0 ],
    text "Attention", :style => :bold
    text [ contact.name, invoice.account.organization_name, contact.email, contact.phone].join("\n")
  end

  pad_bottom(30) do
    text_options.update :style => :bold
    cell [ 200, 60 ],
      :text => "Your contracts",
      :border_width => 0
    text_options.update :style => :normal
    cell [ 200, 0 ],
      :text => invoice.account.contracts.map(&:name).join("\n"),
      :border_width => 0
  end

  pad_bottom(10) do
	text 'Invoice', :size => 30, :style => :bold
  end

  text_options.update(:size => 9, :align => :left)
  table invoice.line_items.map { |t| [ t.story_header, t.description, '%0.2f' % t.final_amount ] }, 
      :headers => [ 'items', 'notes', 'due' ],
      :widths  => { 0 => 200, 1 => 200, 2 => 50 },
	  :font_size => 9,
      :vertical_padding => 2
  text_options.update :style => :bold, :size => 11
  table [[ "TOTAL", '%0.2f' % invoice.amount_due ]],
      :widths  => { 0 => 400, 1 => 50 }
end
  

