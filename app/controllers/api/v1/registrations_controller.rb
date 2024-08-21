module Api
  module V1
    class RegistrationsController < ApplicationController
      # skip_before_action :verify_authenticity_token
      # POST /api/v1/signup
      def signup
        @user = User.new(registrations_params)

        if @user.save
          login!
          render json: { status: :created, user: @user }

        else
          render json: { status: 500, errors: @user.errors.full_messages }
        end
      end

      private
      def registrations_params
        params.require(:user).permit(:email, :password, :password_confirmation)
      end
    end
  end
end