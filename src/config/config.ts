import "dotenv/config"

class Config {
  static port = process.env.BASE_PORT;
  static databasePort = Number(process.env.DATABASE_PORT);
  static databaseHost = String(process.env.DATABASE_HOST);
  static redisHost = String(process.env.REDIS_HOST);
  static redisPort = Number(process.env.REDIS_PORT);
  static redisPassword = String(process.env.REDIS_PASSWORD);
  static smsURL = String(process.env.NAVER_SMS_URL);
  static smsServiceID = String(process.env.NAVER_SMS_SERVICE_ID);
  static smsAccess = String(process.env.NAVER_ACCESS);
  static smsSecret = String(process.env.NAVER_SECRET);
  static smsCallingNumber = String(process.env.NAVER_CALLING_NUMBER);
  static jwtACCESS = String()
}

export default Config;