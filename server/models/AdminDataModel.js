const mongoose = require('mongoose');
const validator = require('validator');

const discountSchema = new mongoose.Schema({
    amount: Number,
    name: String
})


const AdminDataSchema = new mongoose.Schema({
    emails : [{
        type : String,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        } 
    }],
    stats:[],
    discounts:[discountSchema],
    brands:Array
})

const AdminData = mongoose.model('AdminData', AdminDataSchema);

module.exports = AdminData;
