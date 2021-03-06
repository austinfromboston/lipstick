class LineItem < ActiveRecord::Base
  belongs_to :contract
  belongs_to :account
  has_and_belongs_to_many :invoices
  before_save :update_account_id, :mark_as_activated

  named_scope :billable, :include => :invoices, :conditions => [ 'billable_status = ?', 'billable' ]
  named_scope :held, :include => :invoices, :conditions => [ 'billable_status = ?', 'hold' ]
  named_scope :posted_before, lambda { |ending_date|
    { :conditions => [ 'activation_date < ?', ending_date ] }
  }

  #BILLABLE_STATES = %w/ billable hold sent paid courtesy writeoff /
  BILLABLE_STATES = %w/ billable hold sent /
  CATEGORIES = %w/ charge payment adjustment writeoff /
  def name
    [ story_header, 'item', description, category ].select {|i|!i.blank?}.compact.join(' - ')[0,50]
  end

  def active?
    %w/ billable sent /.include? billable_status
  end

  private

  def update_account_id
    return true unless self.contract_id_changed?
    self.account_id ||= contract.account_id
  end

  def mark_as_activated
    self.activation_date = Time.now.beginning_of_day if activation_date.blank? && active?
    true
  end

end
