class Api::V1::KeihiController < ApplicationController
  skip_before_action :authenticate_request

  # GET /api/v1/keihi/index
  # すべての申請を取得する
  def index
    @spend_requests = SpendRequest.all
    render json: @spend_requests
  end

  # GET /api/v1/keihi/:id
  # 特定の申請を取得する
  def show
    @spend_request = SpendRequest.find(params[:id])
    render json: @spend_request
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Record not found' }, status: :not_found
  end

  # POST /api/v1/keihi/get_by_user
  # あるユーザーのすべての申請を取得する
  def get_by_user
    @spend_requests = SpendRequest.where(user_id: params[:user_id])
    render json: @spend_requests
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Record not found' }, status: :not_found
  end

  # POST /api/v1/keihi/create
  # 申請を作成する
  def create
    @spend_request = SpendRequest.new(spend_request_params)
    if @spend_request.save
      render json: @spend_request, status: :created
    else
      render json: { errors: @spend_request.errors.full_messages }, status: :unprocessable_entity
    end
  rescue StandardError => e
    render json: { error: e.message }, status: :internal_server_error
  end

  # DELETE /api/v1/keihi/delete/:id
  # 申請を削除する
  def delete
    @spend_request = SpendRequest.find(params[:id])
    @spend_request.destroy
    render json: { message: 'Record deleted' }, status: :ok
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Record not found' }, status: :not_found
  end

  # PUT /api/v1/keihi/update/:id
  # 申請を更新する
  def update
    @spend_request = SpendRequest.find(params[:id])
    if @spend_request.update(spend_request_params)
      render json: @spend_request, status: :ok
    else
      render json: { errors: @spend_request.errors.full_messages }, status: :unprocessable_entity
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: 'Record not found' }, status: :not_found
  end

  private

  def spend_request_params
    params.require(:spend_request).permit(:user_id, :status, :date_of_use, :amount, :spend_to, :keihi_class, :purpose, :invoice_number, :contact_number, :memo, :image_save)
  end
end
