require 'rake/testtask'
require 'rake/rdoctask'
require 'tasks/rails'
require File.expand_path(File.dirname(__FILE__) + "/../../config/environment")
namespace :linein do
  desc "transfer new data to linein" 
  task :transfer do
    @conn = RadicalDesigns::LineinConnection.new 
    @conn.transfer
  end
end
