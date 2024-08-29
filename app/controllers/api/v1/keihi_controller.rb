class Api::V1::KeihiController < ApplicationController
  skip_before_action :authenticate_request

  # GET /api/v1/keihi/index
  # すべての申請を取得する
  def index
    spend_requests = SpendRequest.includes(:spend_request_item, :user).all
    spend_requests = spend_requests.order(created_at: :asc)

    spend_requests_with_usernames = spend_requests.map do |spend_request|
      spend_request.as_json(include: :spend_request_item).merge(
        user_name: spend_request.user.name
      )
    end

    render json: spend_requests_with_usernames, status: :ok
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
    spend_requests = SpendRequest.includes(:spend_request_item).where(user_id: params[:user_id]).order(created_at: :desc)

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
    spend_request_params = params.require(:spend_request).permit(
      :user_id, :status, :spend_to, :purpose,
      spend_request_item: [:id, :date_of_use, :amount, :keihi_class, :invoice_number, :contact_number, :memo, :image_save]
    )

    SpendRequest.transaction do
      # SpendRequest を更新
      @spend_request = SpendRequest.find(params[:id])
      @spend_request.update!(
        user_id: spend_request_params[:user_id],
        status: spend_request_params[:status],
        spend_to: spend_request_params[:spend_to],
        purpose: spend_request_params[:purpose]
      )

      # 関連する SpendRequestItems を更新
      spend_request_params[:spend_request_item].each do |item_params|
        item = SpendRequestItem.find(item_params[:id])
        item.update!(
          date_of_use: item_params[:date_of_use],
          amount: item_params[:amount],
          keihi_class: item_params[:keihi_class],
          invoice_number: item_params[:invoice_number],
          contact_number: item_params[:contact_number],
          memo: item_params[:memo],
          image_save: item_params[:image_save]
        )
      end
    end

    # 成功時のレスポンス
    render json: { message: 'Spend request updated successfully' }, status: :ok
  rescue ActiveRecord::RecordNotFound => e
    # レコードが見つからなかった場合のレスポンス
    render json: { error: 'Record not found' }, status: :not_found
  rescue ActiveRecord::RecordInvalid => e
    # バリデーションエラーが発生した場合のレスポンス
    render json: { error: e.message }, status: :unprocessable_entity
  end



  def change_status
    status = params[:status]
    keihi_id = params[:id]
    @keihi = SpendRequest.find_by(id: keihi_id)
    if @keihi
      if @keihi.update(status: status)
        render json: { message: 'Status updated successfully', status: @keihi.status }, status: :ok
      else
        render json: { error: 'Failed to update status', details: @keihi.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { error: 'Keihi not found' }, status: :not_found
    end
  rescue => e
    render json: { error: e.message }, status: :internal_server_error
  end


  private

  def spend_request_params
    params.require(:spend_request).permit(
      :user_id, :status, :spend_to, :purpose,
      spend_request_items_attributes: [
        :id, :date_of_use, :amount, :keihi_class,
        :invoice_number, :contact_number, :memo, :image_save
      ]
    )
  end
end
