class SpendRequestsController < ApplicationController
    def create
      # Strong Parametersを使用してJSONのデータを取得
      spend_request_params = params.require(:spend_request).permit(
        :user_id, :status, :spend_to,
        spend_request_item: [:date_of_use, :amount, :spend_to, :keihi_class, :purpose, :invoice_number, :contact_number, :memo, :image_save]
      )
  
      # トランザクションを使用して一括保存
      SpendRequest.transaction do
        # SpendRequestを作成
        spend_request = SpendRequest.create!(
          user_id: spend_request_params[:user_id],
          status: spend_request_params[:status],
          spend_to: spend_request_params[:spend_to]
        )
  
        # 関連するSpendRequestItemsを作成
        spend_request_params[:spend_request_item].each do |item|
          spend_request.spend_request_items.create!(
            date_of_use: item[:date_of_use],
            amount: item[:amount],
            spend_to: item[:spend_to],
            keihi_class: item[:keihi_class],
            purpose: item[:purpose],
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
  end
  

#   curl -X POST http://localhost:3000/spend_requests \
#   -H "Content-Type: application/json" \
#   -d '{
#     "spend_request": {
#       "user_id": "your_user_id_here",
#       "status": "approved",
#       "spend_to": "Office Supplies",
#       "spend_request_item": [
#         {
#           "date_of_use": "2024-08-25",
#           "amount": 5000,
#           "spend_to": "Stationery",
#           "keihi_class": "Office",
#           "purpose": "Purchase of pens",
#           "invoice_number": 12345,
#           "contact_number": 67890,
#           "memo": "Urgent purchase",
#           "image_save": "image_url_here"
#         },
#         {
#           "date_of_use": "2024-08-26",
#           "amount": 3000,
#           "spend_to": "Notebooks",
#           "keihi_class": "Office",
#           "purpose": "Purchase of notebooks",
#           "invoice_number": 54321,
#           "contact_number": 98765,
#           "memo": "For project planning",
#           "image_save": "another_image_url_here"
#         }
#       ]
#     }
#   }'
  