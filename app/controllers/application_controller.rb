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
    if header.present?
      token = header.split(' ').last
      @token = token
      # Rails.logger.info "Received token: #{token}"

      begin
        decoded = JwtService.decode(token)
        # Rails.logger.info "Decoded JWT: #{decoded.inspect}"

        user_auth = UserAuthentication.find_by(uid: decoded["google_user_id"], provider: decoded["provider"])
        @current_user = user_auth.user if user_auth

        # Rails.logger.info "User authentication record: #{user_auth.inspect}"
        # Rails.logger.info "Current user: #{@current_user.inspect}"

        unless @current_user
          raise ActiveRecord::RecordNotFound, 'User not found'
        end
      rescue ActiveRecord::RecordNotFound, JWT::DecodeError => e
        Rails.logger.error "Authentication error: #{e.message}"
        render json: { errors: e.message }, status: :unauthorized
      end
    else
      Rails.logger.error "Authorization header missing"
      render json: { errors: 'Authorization header missing' }, status: :unauthorized
    end
  end
end