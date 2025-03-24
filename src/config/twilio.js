require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (phoneNumber, message) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber
        });
        console.log(`OTP sent to ${phoneNumber}`);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};

module.exports = sendSMS;
