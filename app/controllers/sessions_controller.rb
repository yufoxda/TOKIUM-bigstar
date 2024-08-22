class SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create]
  # protect_from_forgeryはAPIモードでは必要ないことが多い
  # protect_from_forgery

  def create
    frontend_url = 'http://localhost:8080'
    user_info = request.env['omniauth.auth']

    google_user_id = user_info['uid']
    provider = user_info['provider']
    Rails.logger.info("google_user_id: #{google_user_id}")
    token = generate_token_with_google_user_id(google_user_id, provider)
    Rails.logger.info("token: #{token}")

    user_authentication = UserAuthentication.find_by(uid: google_user_id, provider: provider)

    if user_authentication
      redirect_to "#{frontend_url}/contents?token=#{token}", allow_other_host: true
    else
      # ユーザーを作成(カラムはアプリの内容によって変更する)
      user = User.create(name: user_info['name'], email: user_info['email'], role: 'user')
      UserAuthentication.create(user_id: user.id, uid: google_user_id, provider: provider)
      redirect_to "#{frontend_url}/contents?token=#{token}", allow_other_host: true
    end
  end

  private

  def generate_token_with_google_user_id(google_user_id, provider)
    exp = Time.now.to_i + 24 * 3600
    payload = { google_user_id: google_user_id, provider: provider, exp: exp }
    hmac_secret = ENV['JWT_SECRET_KEY']
    JWT.encode(payload, hmac_secret, 'HS256')
  end
end
