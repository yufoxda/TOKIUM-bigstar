class Api::V1::CsrfController < ApplicationController
  skip_before_action :authenticate_request

  def token
    csrf_auth_token = SecureRandom.base64(32)
    render json: { csrf_auth_token: csrf_auth_token }
  end
end
