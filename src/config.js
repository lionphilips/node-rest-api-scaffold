global.PROJECT_NAME = 'REST API';
global.PROJECT_VERSION = '0.0.1';
global.SALT_KEY = '';
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>. Seja bem-vindo a ' + global.PROJECT_NAME;

module.exports = {
    MODE: 'development', // production or development
    CONNECTION_STRING: '', //mongodb connection string
    SENDGRID_API_KEY: '', //sendgrid api key
    SENDGRID_MAILER: '' // who is sending the emails
};