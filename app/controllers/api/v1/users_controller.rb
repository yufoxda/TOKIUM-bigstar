class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_request, only: [:index, :show]

  # それぞれアプリ要件に従って設定
  def index; end
  def show; end
  def update; end
  def destroy; end

  # カレントユーザーを返す
  def current
    if @current_user
      render json: { user: @current_user }
    else
      render json: { error: '認証情報を取得できません' }, status: :unauthorized
    end
  end

  # カレントユーザのroleを変更
  def change_role
    # Rails.logger.debug("Entering change_role method")
    @current_user = User.find_by(id: params[:id])
    # Rails.logger.debug("User found: #{@current_user.inspect}")
    
    if @current_user
      if @current_user.role == 'auth'
        @current_user.update(role: 'user')
      else
        @current_user.update(role: 'auth')
      end
      # Rails.logger.debug("User role updated to: #{@current_user.role}")
      render json: { message: 'Role updated successfully', role: @current_user.role }, status: :ok
    else
      # Rails.logger.debug("User not found")
      render json: { error: 'User not found' }, status: :not_found
    end
  end
end  
