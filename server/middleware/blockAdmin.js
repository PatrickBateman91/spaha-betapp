const blockAdmin = async (req, res, next) => {

    if(req.headers.type === "add email to newsletter"){
        return next();
    } else if (req.user._id.toString() !== process.env.ADMIN_ID.toString()){
        next()
    } else{
        res.status(400).send("User actions are not allowed on admin profile!")
    }
}

module.exports = blockAdmin;