const mongoose = require('mongoose');
const validator = require('validator');


const itemSchema = new mongoose.Schema({
    brand: {
        type: String,
        required:true
    },
    cost: {
        type: Number,
        required:true
    },
    discount:{
        type:Boolean,  
        required:true
    },
    discountType:{
        type: String,
        required:true
    },
    fullName:{
        type: String,
        required:true
    },
    gender:{
        type: String,
        required:true
    },
    numberOfVotes:{
        type: Number,
        required:true
    },
    rating:{
        type: Number,
        required:true
    },
    availability: Object,
    imagePaths: Array,
    
})

const Item = mongoose.model('shop-item', itemSchema);

module.exports = Item;