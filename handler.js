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
      ToAddresses: ["greenhomeshawaii@gmail.com"], // SES RECEIVING EMAIL
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: `Contact: ${contact}\nEmail: ${from}\n\n ${body}`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Website Inquiry: [${contact}] - ${subject}`,
      },
    },
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
        "Access-Control-Allow-Origin": "https://greenhomeshi.com",
      },
      body: JSON.stringify({
        message: err ? err.message : data,
      }),
    };

    callback(null, response);
  });
};
