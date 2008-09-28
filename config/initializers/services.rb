module Stasi; end
Stasi::CONFIG = YAML.load_file('config/remote_apis.yml')[:stasi]
