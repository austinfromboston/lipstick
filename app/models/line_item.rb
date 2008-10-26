class LineItem < ActiveRecord::Base
  belongs_to :contract
  belongs_to :account
  has_and_belongs_to_many :invoices
  before_save :update_account_id

  named_scope :outstanding, :conditions => [ 'billable_status in (?)', [ 'billable','sent','hold' ]]
  named_scope :invoiceable, :include => :invoices, :conditions => [ 'billable_status in (?) or ( billable_status in(?) and invoices.id is ?)', [ 'billable', 'sent'], ['courtesy', 'writeoff'], nil ]

  BILLABLE_STATES = %w/ billable hold sent paid courtesy writeoff /
  def name
    [ story_header, 'item', description, category ].select {|i|!i.blank?}.compact.join(' - ')[0,50]
  end

  private

  def update_account_id
    self.account_id = contract.account_id
  end

end
