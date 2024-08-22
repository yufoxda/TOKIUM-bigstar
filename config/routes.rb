Rails.application.routes.draw do
# google認証にアクセス
get '/auth/:provider/callback', to: 'sessions#create'
get '/favicon.ico', to: proc{ [204, {}, []] }

# ユーザー登録のルート(API)
namespace :api do
  namespace :v1 do
      # カレントユーザーの呼び出し
    post 'users/current', to: 'users#current'
    get 'csrf_token', to: 'csrf#token'
  end
end
end
