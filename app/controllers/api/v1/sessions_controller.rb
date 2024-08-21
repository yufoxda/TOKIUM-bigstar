class CustomSessionsController < DeviseTokenAuth::SessionsController
  private

  def render_create_success
    render json: {
      data: @resource.as_json(methods: :authority),
      message: 'ログインに成功しました。'
    }
  end
end