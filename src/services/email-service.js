'use strict'

const config = require('../config');
const sgMail = require('@sendgrid/mail');

exports.send = (to, subject, html) => {
    sgMail.setApiKey(config.SENDGRID_API_KEY);
    sgMail.send({
        to: to,
        from: config.SENDGRID_MAILER,
        subject: subject,
        html: html,
    });
}