class LineItemsController < ResourcefulController
  make_resourceful do
    actions :all
    before :new do
      current_object.contract_id = params[:contract_id] if params[:contract_id]
    end
  end
  def current_objects
    if params[:contract_id]
      current_model.all :conditions => {:contract_id => params[:contract_id] }.merge( ( params[:query] || {} ) )
    else
      super
    end
  end

end
