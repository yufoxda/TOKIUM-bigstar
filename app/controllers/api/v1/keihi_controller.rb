class Api::V1::KeihiController < ApplicationController
  skip_before_action :authenticate_request

  # GET /api/v1/keihi/index
  # すべての申請を取得する
  def index
    spend_requests = SpendRequest.includes(:spend_request_item).all
    render json: spend_requests.as_json(include: :spend_request_item), status: :ok
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end

  # GET /api/v1/keihi/show/:id
  # 特定の申請を取得する
  def show
    # 指定されたIDに対応する spend_request を取得
    spend_request = SpendRequest.includes(:spend_request_item).find(params[:id])
    # JSON形式で spend_request とその関連アイテムを返す
    render json: spend_request.as_json(include: :spend_request_item), status: :ok
  rescue ActiveRecord::RecordNotFound
    # レコードが見つからなかった場合の処理
    render json: { error: "Spend request not found" }, status: :not_found
  rescue => e
    # その他のエラーが発生した場合の処理
    render json: { error: e.message }, status: :internal_server_error
  end

  # GET /api/v1/keihi/get_by_user
  # あるユーザーのすべての申請を取得する
  def get_by_user
    # 指定されたuser_idに対応するすべてのspend_requestsを取得
    spend_requests = SpendRequest.includes(:spend_request_item).where(user_id: params[:user_id])

    if spend_requests.exists?
      # JSON形式でspend_requestsとその関連アイテムを返す
      render json: spend_requests.as_json(include: :spend_request_item), status: :ok
    else
      # レコードが見つからなかった場合の処理
      render json: { error: "No spend requests found for the specified user" }, status: :not_found
    end
    rescue => e
      # その他のエラーが発生した場合の処理
      render json: { error: e.message }, status: :internal_server_error
  end

  # POST /api/v1/keihi/create
  # 申請を作成する
  def create
    # Strong Parametersを使用してJSONのデータを取得
    spend_request_params = params.require(:spend_request).permit(
      :user_id, :status, :spend_to, :purpose,
      spend_request_item: [:date_of_use, :amount, :keihi_class, :invoice_number, :contact_number, :memo, :image_save]
    )
    # トランザクションを使用して一括保存
    SpendRequest.transaction do
      # SpendRequestを作成
      spend_request = SpendRequest.create!(
        user_id: spend_request_params[:user_id],
        status: spend_request_params[:status],
        spend_to: spend_request_params[:spend_to],
        purpose: spend_request_params[:purpose]
      )
      # 関連するSpendRequestItemsを作成
      spend_request_params[:spend_request_item].each do |item|
        Rails.logger.info("items:")
        Rails.logger.info(item)
        spend_request.spend_request_item.create!(
          date_of_use: item[:date_of_use],
          amount: item[:amount],
          keihi_class: item[:keihi_class],
          invoice_number: item[:invoice_number],
          contact_number: item[:contact_number],
          memo: item[:memo],
          image_save: item[:image_save]
        )
      end
    end
    # 成功時のレスポンス
    render json: { message: 'Spend request created successfully' }, status: :created
  rescue ActiveRecord::RecordInvalid => e
    # 失敗時のレスポンス
    render json: { error: e.message }, status: :unprocessable_entity
  end

  # DELETE /api/v1/keihi/delete_request/:id
  # 申請を削除する
  def delete_request
    # 指定されたIDに対応する spend_request を取得
    spend_request = SpendRequest.find(params[:id])
    # レコードを削除
    spend_request.destroy
    # 削除成功のレスポンスを返す
    render json: { message: "Spend request deleted successfully" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    # レコードが見つからなかった場合の処理
    render json: { error: "Spend request not found" }, status: :not_found
  rescue => e
    # その他のエラーが発生した場合の処理
    render json: { error: e.message }, status: :internal_server_error
  end

  # DELETE /api/v1/keihi/delete_item/:id
  # 申請のitemを削除する
  def delete_item
    # 指定されたIDに対応する spend_request_item を取得
    spend_request_item = SpendRequestItem.find(params[:id])
    # レコードを削除
    spend_request_item.destroy
    # 削除成功のレスポンスを返す
    render json: { message: "Spend request item deleted successfully" }, status: :ok
  rescue ActiveRecord::RecordNotFound
    # レコードが見つからなかった場合の処理
    render json: { error: "Spend request item not found" }, status: :not_found
  rescue => e
    # その他のエラーが発生した場合の処理
    render json: { error: e.message }, status: :internal_server_error
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
    params.require(:spend_request).permit(:user_id, :status, :date_of_use, :amount,:keihi_class,  :invoice_number, :contact_number, :memo, :image_save)
  end
end
