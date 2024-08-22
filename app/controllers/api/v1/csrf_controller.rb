class Api::V1::CsrfController < ApplicationController
  skip_before_action :authenticate_request, only: [:index]

  def token
    render json: { csrf_auth_token: form_authenticity_token }
  end
end
