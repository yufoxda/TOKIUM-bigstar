class SessionsController < ApplicationController
  skip_before_action :authenticate_request, only: [:create]

  def create
    frontend_url = "http://localhost:8080"
    user_info = request.env['omniauth.auth']
    google_user_id = user_info['uid']
    provider = user_info['provider']
    token = generate_token_with_google_user_id(google_user_id, provider)

    user_authentication = UserAuthentication.find_by(uid: google_user_id, provider: provider)

    if user_authentication
      Rails.logger.info("アプリユーザー登録されている")
      redirect_to "#{frontend_url}/contents?token=#{token}", allow_other_host: true
    else
      Rails.logger.info("まだアプリユーザー登録されていない")
      # ユーザーを作成(カラムはアプリの内容によって変更する)
      user = User.create(name: "新規ユーザー", achievement: 0, current_avatar_url: "/default/default_player.png")
      UserAuthentication.create(user_id: user.id, uid: google_user_id, provider: provider)
      redirect_to "#{frontend_url}/?token=#{token}", allow_other_host: true
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
