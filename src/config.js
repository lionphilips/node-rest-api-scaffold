global.PROJECT_NAME = 'REST API';
global.PROJECT_VERSION = '0.0.1';
global.SALT_KEY = ''; //important

module.exports = {
    MODE: 'development', // production or development
    CONNECTION_STRING: '', //mongodb connection string (required)
    SENDGRID_API_KEY: '', //sendgrid api key (optional)
    SENDGRID_MAILER: '' // who is sending the emails (optional)
};