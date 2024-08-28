# app/controllers/api/v1/google_calendars_controller.rb
class Api::V1::GoogleCalendarsController < ApplicationController
  before_action :authenticate_request

  def events
    # Rails.logger.info("Fetching Google Calendar events for user #{@current_user.id}")
    service = ::GoogleCalendarService.new(@current_user, @token) 

    begin
      events = service.fetch_events
      render json: events, status: :ok
    rescue StandardError => e
      Rails.logger.error("Failed to fetch Google Calendar events: #{e.message}")
      render json: { error: 'Failed to fetch Google Calendar events' }, status: :unprocessable_entity
    end
  end
end
