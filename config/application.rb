require_relative "boot"
require "dotenv"
require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.0

    config.assets.enabled = false

    # set rakes
    config.autoload_paths += %W(#{config.root}/lib)

    # set services
    config.autoload_paths += %W(#{config.root}/app/services)

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore, key: '_cookie_name'

    if Rails.env.development?
      Dotenv.load(".env.local")

    elsif Rails.env.test?
      Dotenv.load(".env.test")

    else
      Dotenv.load(".env.production")
    end

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    # config.api_only = true
  end
end
