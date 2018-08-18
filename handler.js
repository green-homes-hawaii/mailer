// handler.js

"use strict";

const AWS = require("aws-sdk");
const SES = new AWS.SES();

function sendMail(formData, cb) {
  const { contact, from, subject, body } = formData;

  const emailParams = {
    Source: "mailgun@awitherow.com",
    ReplyToAddresses: [from],
    Destination: {
      ToAddresses: ["me@awitherow.com"] // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Contact: ${contact}\nEmail: ${from}\n\n ${body}`
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `[${contact}] - ${subject}`
      }
    }
  };

  SES.sendEmail(emailParams, cb);
}

module.exports.mail = (event, context, callback) => {
  const formData = JSON.parse(event.body);

  sendMail(formData, function(err, data) {
    const response = {
      statusCode: err ? 500 : 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "https://awitherow.com"
      },
      body: JSON.stringify({
        message: err ? err.message : data
      })
    };

    callback(null, response);
  });
};
