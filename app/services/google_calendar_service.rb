require 'google/apis/calendar_v3'
# require 'signet/oauth2/client'

class GoogleCalendarService
  def initialize(user, token)
    @user = user
    @service = ::Google::Apis::CalendarV3::CalendarService.new
    @service.client_options.application_name = 'bigstar'
    @service.authorization = google_credentials_for(user)
  end

  def fetch_events(time_min: (DateTime.now-30).iso8601, time_max: DateTime.now.iso8601, max_results: 10)
    calendar_id = 'primary'
    events = @service.list_events(calendar_id,
                                  max_results: max_results,
                                  single_events: true,
                                  order_by: 'startTime',
                                  time_min: time_min,
                                  time_max: time_max)
    # Rails.logger.info("events: #{events.inspect}")
    # Rails.logger.info(events.items)
    format_events(events.items)
  end

  private

  def google_credentials_for(user)
    user_auth = user.user_authentications.find_by(provider: 'google_oauth2')
    # Rails.logger.info("user_auth: #{user_auth.inspect}")
    token = user_auth.token
    refresh_token = user_auth.refresh_token
    expires_at = user_auth.expires_at

    client = Signet::OAuth2::Client.new(
      client_id: ENV["GOOGLE_CLIENT_ID"],
      client_secret: ENV["GOOGLE_CLIENT_SECRET"],
      token_credential_uri: 'https://accounts.google.com/o/oauth2/token',
      access_token: token,
      refresh_token: refresh_token,
      expires_at: expires_at
    )

    if client.expired?
      client.fetch_access_token!
      user_auth.update(token: client.access_token, expires_at: client.expires_at)
    end

    client
  end

  def format_events(events)
    events.map do |event|
      {
        id: event.id,
        summary: event.summary,
        location: event.location,
        description: event.description,
        start: event.start.date_time || event.start.date,
        end: event.end.date_time || event.end.date
      }
    end
  end
end
