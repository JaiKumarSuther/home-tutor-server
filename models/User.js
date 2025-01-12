const { model, Schema, mongoose } = require('mongoose');

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    accountType: {
        type: String,
        required: true,
        enum: ["Admin", "Student", "Tutor"]
   },

    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    
    image: {
        type: String
    }
})

module.exports = model('User', userSchema);