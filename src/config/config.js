require('dotenv').config({ path: require('find-config')('.env') })
const Joi = require('joi');

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'cron', 'test').required(),
    PORT: Joi.number().default(3000),
    ALLOW_SUPER_ADMIN_CHANGES: Joi.boolean().default(false),

    MONGODB_URL: Joi.string().required().description('Mongo DB url'),

    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),

    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),

    AWS_ACCESS_KEY_ID: Joi.string().description('AWS access key id'),
    AWS_SECRET_ACCESS_KEY: Joi.string().description('AWS secret access key'),
    AWS_BUCKET_NAME: Joi.string().description('AWS bucket name'),
    AWS_REGION: Joi.string().description('AWS region'),

    SENDGRID_API_KEY: Joi.string().description('Sendgrid api key'),
    SENDGRID_FROM_EMAIL: Joi.string().description('Sendgrid from email'),
    SENDGRID_FROM_NAME: Joi.string().description('Sendgrid from name'),

    SCHEDULE_PROCESS_VIDEO_SHOW: Joi.string().description('video creation cron schedule'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  allow_superAdmin_changes: envVars.ALLOW_SUPER_ADMIN_CHANGES,

  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },

  email: {
    sendGridAPIKey: envVars.SENDGRID_API_KEY,
    sendGridFrom: envVars.SENDGRID_FROM_EMAIL,
    sendGridFromName: envVars.SENDGRID_FROM_NAME,
  },

  aws: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
    bucketName: envVars.AWS_BUCKET_NAME,
    region: envVars.AWS_REGION,
  },
  schedule: {
    processRawData: envVars.SCHEDULE_PROCESS_RAW_DATA,
    processVideoShow: envVars.SCHEDULE_PROCESS_VIDEO_SHOW,
  }
};
