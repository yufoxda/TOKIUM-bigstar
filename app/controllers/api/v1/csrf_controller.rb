class Api::V1::CsrfController < ApplicationController
  skip_before_action :authenticate_request

  # csrf認証用のトークンを発行する
  # post /api/v1/csrf/token
  def token
    csrf_auth_token = SecureRandom.base64(32)
    render json: { csrf_auth_token: csrf_auth_token }
  end
end
