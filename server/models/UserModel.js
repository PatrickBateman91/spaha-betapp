const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const cartSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    }
})

const purchasesSchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    size:{
        type:Number,
        required:true
    },
    discount:{
        type: Boolean,
        required:true
    },
    discountAmount:{
        type:Number,
        required:true
    }
})

const ratingsSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true,
        validate(value){
            if(value < 0.5 || value > 5){
                throw new Error("Rating must be between 0 and 5!")
            }
        }
    }
})

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        validate(value){
            if(value.length < 1){
                throw new Error('Name has to have at least 1 letter')
            }
        }
    },
    lastName: {
        type:String,
        required:true,
        validate(value){
            if(value.length < 1){
                throw new Error('Name has to have at least 1 letter')
            }
        }
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid!')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length < 6){
                throw new Error('Password must have at least 6 letters')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    resetPasswordLink: {
        type: String
    },
    userAddress:{
        type:String,
        required:true
    },
    admin:false, 
    userFavourites: [{type : String}],
    userCart:[cartSchema],
    userRatings:[ratingsSchema],
    userPreviousPurchases:[purchasesSchema],
    contactForms:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ContactForm"
    }]
})

userSchema.methods.generateAuthToken = async function (){
    const token = jwt.sign({_id:this._id.toString()}, process.env.JWT_SECRET);
    
    this.tokens = this.tokens.concat({token});
    await this.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email}).populate('contactForms').exec();
    if(!user){
        throw new Error('User not found!')
    }

    const passCheck = await bcryptjs.compare(password, user.password);
    if(!passCheck){
        throw new Error('Wrong password')
    }
    return user;
}

userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8);
    }
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = User;