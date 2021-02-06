const mongoose = require('mongoose');
const validator = require('validator');

const adminAnswersSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    timestamp:{
        type: Date,
        required:true
    },
    type:{
        type:String,
        required:true
    }
})

const userQuestionsSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true
    },
    timestamp:{
        type: Date,
        required:true
    },
    type:{
        type:String,
        required:true
    }
})

const contactFormSchema = new mongoose.Schema({
    answerRead:{
        type:Boolean,
        required:true
    },
    email:{
        type:String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    lastAnswer:{
        type:String,
        required:true
    },
    openedByAdmin:{
        type: Boolean, 
        required:true
    },
    resolved:{
        type: Boolean,
        required:true
    },
    subject:{
        type: String,
        required:true
    },
    user:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    type: {
        type:String,
        required:true
    },
    adminAnswers:[adminAnswersSchema],
    userQuestions:[userQuestionsSchema]
})

const ContactForm = mongoose.model('ContactForm', contactFormSchema);

module.exports = ContactForm;