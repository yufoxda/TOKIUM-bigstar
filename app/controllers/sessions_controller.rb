class SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create]
  
  def create
    frontend_url = 'http://localhost:8080'
    user_info = request.env['omniauth.auth']

    google_user_id = user_info['uid']
    provider = user_info['provider']
    access_token = user_info['credentials']['token']
    refresh_token = user_info['credentials']['refresh_token']
    expires_at = Time.at(user_info['credentials']['expires_at'])

    Rails.logger.info("google_user_id: #{google_user_id}")
    # token = generate_token_with_google_user_id(google_user_id, provider)
    token = JwtService.encode({ google_user_id: google_user_id, provider: provider })
    Rails.logger.info("token: #{token}")

    user_authentication = UserAuthentication.find_by(uid: google_user_id, provider: provider)

    if user_authentication
      # Update existing authentication with new tokens
      user_authentication.update(
        token: access_token,
        refresh_token: refresh_token,
        expires_at: expires_at
      )
      user = user_authentication.user
    else
      # Create new user and user authentication
      user = User.create(
        name: user_info['info']['name'], 
        email: user_info['info']['email'], 
        profile: user_info['info']['image'],
        role: 'user'
      )
      UserAuthentication.create(
        user_id: user.id, 
        uid: google_user_id, 
        provider: provider,
        token: access_token,
        refresh_token: refresh_token,
        expires_at: expires_at
      )
    end

    redirect_to "#{frontend_url}/contents?token=#{token}", allow_other_host: true
  end
  # private

  # def generate_token_with_google_user_id(google_user_id, provider)
  #   exp = Time.now.to_i + 15*60
  #   payload = { google_user_id: google_user_id, provider: provider, exp: exp }
  #   hmac_secret = ENV['JWT_SECRET_KEY']
  #   JWT.encode(payload, hmac_secret, 'HS256')
  # end
end
