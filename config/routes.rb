Rails.application.routes.draw do
# google認証にアクセス
get '/auth/:provider/callback', to: 'sessions#create'
get '/favicon.ico', to: proc{ [204, {}, []] }

# ユーザー登録のルート(API)
namespace :api do
  namespace :v1 do
      # カレントユーザーの呼び出し
    post 'users/current', to: 'users#current'
    patch 'users/change_role/:id', to: 'users#change_role'
    get 'csrf_token', to: 'csrf#token'
    get 'keihi/show/:id', to: 'keihi#show'
    post 'keihi/create', to: 'keihi#create'
    get 'keihi/index', to: 'keihi#index'
    get 'keihi/get_by_user', to: 'keihi#get_by_user'
    delete 'keihi/delete_request/:id', to: 'keihi#delete_request'
    delete 'keihi/delete_item/:id', to: 'keihi#delete_item'
    put 'keihi/update/:id' , to: 'keihi#update'
    patch 'keihi/change_status', to: 'keihi#change_status'
    get 'calendar/events/', to: 'google_calendars#events'
  end
end
end
