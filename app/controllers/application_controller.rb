class ApplicationController < ActionController::API
  before_action :authenticate_request
  rescue_from ActionController::RoutingError, with: :not_found

  def not_found
    if request.path == '/favicon.ico'
      head :not_content
    else
      super
    end
  end

  protected

  def authenticate_request
    header = request.headers['Authorization']
    header = header.split(' ').last if header
    begin
      @decoded = JwtService.decode(header)
      if @decoded["provider"] == "guest"
        @current_user = User.find(@decoded["user_id"])
      else
        user_auth = UserAuthentication.find_by(uid: @decoded["google_user_id"], provider: @decoded["provider"])
        @current_user = user_auth.user if user_auth
      end
      Rails.logger.info(@current_user)
      unless @current_user
        raise ActiveRecord::RecordNotFound, 'User not found'
      end
    rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
      Rails.logger.error "認証エラー: #{e.message}"
      render json: { errors: e.message }, status: :unauthorized
    end
  end
end
