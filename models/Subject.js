const { model, Schema } = require('mongoose');

const subjectSchema = new Schema({
    subjectName: {
        type: String,
        enum: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English'],
        required: true,
    },

    grade: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                const gradeOptions = {
                    Physics: ['9th Grade', '10th Grade', '11th Grade', '12th Grade'],
                    Chemistry: ['9th Grade', '10th Grade', '11th Grade', '12th Grade'],
                    Mathematics: ['6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'],
                    Biology:  ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'],
                    English: ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade']
                };
                
                // Check if grade is valid for the selected subject
                return gradeOptions[this.subject]?.includes(value);
            },
            message: props => `Invalid grade "${props.value}" for subject "${props.instance.subject}".`
        }
    },

    expertizeLevel: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },

    Tutor: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
});

module.exports = model('Subject', subjectSchema);
