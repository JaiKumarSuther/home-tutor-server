const { model, Schema } = require('mongoose');
const { mailSender } = require('../utils/mailSender');

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60 * 1000
    }
})

sendVerificationEmail = async (email, otp) => {
    try {
        const mailResponse = await mailSender(email, 'Verification Email from HomeTutor', otp);

    } catch(error) {
        console.log('error occured while sending mails: ', error);
        throw error;
    }
}

OTPSchema.pre('save', async(next) => {
    await sendVerificationEmail(this.email, this.otp);
    next();
})

module.exports = model('OTP', OTPSchema);