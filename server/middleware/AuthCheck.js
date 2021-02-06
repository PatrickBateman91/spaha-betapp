const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const auth = async (req, res, next) => {
if(req.headers.type === "add email to newsletter"){
    return next();
} else{
    try{
        const token = req.headers.authentication;
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
        if(!user){
            throw new Error('No user found with that email!');
        }
        req.token = token;
        req.user = user;
        next();
    } catch(err){
        res.status(401).send("You have not been authorized to access this page!");
    }
}
}

module.exports = auth;