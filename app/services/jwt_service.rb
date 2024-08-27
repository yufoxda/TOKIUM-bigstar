class JwtService
  SECRET_KEY = ENV['JWT_SECRET']

  def self.encode(payload, exp = 3.hours.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'none')
  end

  def self.decode(token)
    decoded_token = JWT.decode(token, SECRET_KEY, false, algorithm: 'none') rescue nil
    return nil if decoded_token.nil?

    body = decoded_token&.first
    HashWithIndifferentAccess.new(body || {})
  rescue JWT::DecodeError, JWT::ExpiredSignature => e
    Rails.logger.error("JWT decode error: #{e.message}")
    nil
  end
end
