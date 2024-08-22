Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'], {
    scope: 'email, profile',
    prompt: 'select_account',
    access_type: 'offline',
    setup: (
      lambda do |env|
        env['omniauth.strategy'].options['token_params'] = {
            :redirect_uri => "http://localhost:3000/auth/google/callback"
        }
      end)
  }
  OmniAuth.config.silence_get_warning = true
  OmniAuth.config.request_validation_phase = nil
  OmniAuth.config.allowed_request_methods = [:post, :get]
end
