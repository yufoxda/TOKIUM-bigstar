class JwtService
  SECRET_KEY = ENV['JWT_SECRET']

  def self.encode(payload, exp = 24.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    decoded_token = JWT.decode(token, SECRET_KEY, true, algorithm: 'HS256') rescue nil
    return nil if decoded_token.nil?

    body = decoded_token&.first
    HashWithIndifferentAccess.new(body || {})
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    Rails.logger.error("JWT decode error: #{e.message}")
    nil
  end
end
