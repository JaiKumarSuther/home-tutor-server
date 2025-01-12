const { model, Schema, mongoose } = require('mongoose');

const profileSchema = new Schema({
    gender: {
        type: String,
    },

    dataOfBirth: {
        type: String
    },

    about: {
        type: String
    },

    contactNumber: {
        type: String
    },
    
    subjects: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject'
        }
    ],
})

module.exports = model('Profile', profileSchema);