class InvoicesController < ResourcefulController
  make_resourceful do
    actions :all
    belongs_to :account
    before :new do 
      @account = @invoice.account
      if @account
        if @invoice.period_ending_date
          @invoice.line_items = @account.line_items.posted_before @invoice.period_ending_date.end_of_day
        else
          @invoice.line_items = @account.line_items.billable
        end
      end
    end
    response_for :show do |format|
      format.html {}
      format.js { render_json_badge_output( :current_object ) }
      format.xml  { render :xml  => current_object }
      format.pdf  do
        self.class.layout nil
        prawnto :filename => "#{@invoice.account.organization_name.downcase.gsub(/[\s-]/,'_').gsub(/[^-A-z0-9]/,'')}_invoice_#{Time.now.strftime('%Y_%m_%d')}.pdf", :dsl => [ :invoice ]
      end

    end
  end
end
