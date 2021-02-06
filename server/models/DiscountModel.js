const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    name:{
        type: String,
        required:true
    }
})

const Discount = mongoose.model('Discount', discountSchema);

module.exports = Discount;