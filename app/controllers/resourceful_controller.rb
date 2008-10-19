class ResourcefulController < ApplicationController
  include BadgesHelper
  make_resourceful do
    response_for :show do |format|
      format.html {}
      format.js { render_json_badge_output( :current_object ) }
      format.xml  { render :xml  => current_object }
    end

    response_for :new do |format|
      format.html {}
      format.js { render_json_badge_output( :current_object ) }
      format.xml  { render :xml  => current_object }
    end
    response_for :edit do |format|
      format.html {}
      format.js { render_json_badge_output( :current_object ) }
      format.xml  { render :xml  => current_object }
    end
    response_for :index do |format|
      format.html {}
      format.js { render_json_badge_output( :current_objects ) }
      format.xml  { render :xml  => current_objects }
    end
    response_for :create do |format|
      format.html { redirect_to current_object }
      format.js { render  :json => current_object, :status => :created, :location => current_object }
      format.xml  { render  :xml  => current_object, :status => :created, :location => current_object }
    end
    response_for :create_failed do |format|
      format.html { render :action => :new }
      format.js { render :json   => current_object.errors, :status => :unprocessable_entity }
      format.xml  { render :xml    => current_object.errors, :status => :unprocessable_entity }
    end

    response_for :update do |format|
      format.html { redirect_to current_object }
      format.js { render :json  => current_object, :status => :ok }
      format.xml  { head :ok }
    end

    response_for :update_failed do |format|
      format.html { render :action => :edit }
      format.js { render :json =>  current_object.errors, :status => :unprocessable_entity }
      format.xml  { render :xml  =>  current_object.errors, :status => :unprocessable_entity }
    end
  
    response_for :destroy do |format|
      format.html { redirect_to projects_path }
      format.js { render :json => {}, :status => :ok }
      format.xml  { head :ok }
    end
  end

  def current_objects
    if params[:query]
      current_model.find :all, :conditions => params[:query]
    else
      super
    end
  end

  def render_json_badge_output( source )
    if params[:badge]
      json_output = badge_to_json params[:badge], params[:badge_target]
    else
      json_output = send( source ).to_json
    end
    unless params[:callback]
      render :json => json_output 
    else
      render :text => "(#{params[:callback]})(#{json_output});" 
    end
  end
end

