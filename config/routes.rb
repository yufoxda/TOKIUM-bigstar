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
    get 'keihi/show', to: 'keihi#show'
    post 'keihi/create', to: 'keihi#create'
    get 'keihi/index', to: 'keihi#index'
    get 'keihi/get_by_user', to: 'keihi#get_by_user'
    delete 'keihi/delete/:id', to: 'keihi#delete'
    put 'keihi/update/:id' , to: 'keihi#update'
  end
end
end
