const express = require('express');
const jwt = require('jsonwebtoken');
const otherRouter = new express.Router();
const User = require('../models/UserModel');
const ContactForm = require('../models/ContactFormModel');
const ObjectID = require('mongodb').ObjectID;

otherRouter.post('/contact-us', async (req, res) => {
    if(req.body.auth){
        const token = req.headers.authentication;
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(decoded._id.toString() === process.env.ADMIN_ID.toString()){
            res.status(400).send("User actions are not allowed on admin profile!")
        } else{
            User.findOne({_id: decoded._id, 'tokens.token': token})
            .populate('contactForms')
            .exec()
            .then(async userResponse => {
                const contactData = new Object();
                contactData.subject = req.body.subject,
                contactData.user = userResponse._id;
                contactData.answerRead = true;
                contactData.lastAnswer = "user";
                contactData.openedByAdmin = false;
                contactData.resolved = false;
                contactData.type = "auth"
              
                const newMessage = {
                    timestamp: new Date(),
                    text: req.body.text,
                    type: "user"
                }
               
                contactData.userQuestions = [];
                contactData.userQuestions.push(newMessage);
                contactData.adminAnswers = [];
    
               const contactForm = new ContactForm(contactData);
           
                try{
                    userResponse.contactForms.push(contactForm._id);
                    await contactForm.save();
                    await userResponse.save();
                    res.send(contactForm);
                } catch(err){
                    res.status(400).send(err);
                }
            }).catch(err => {
                console.log(err);
                res.status(400).send("You are not authorized to send contact form!")
            })
        }

    } else{
        let id = new ObjectID(process.env.ADMIN_ID);
        const adminUser = User.findById(id);
        adminUser.then(async adminResponse => {

        const contactData = new Object();
        contactData.subject = req.body.subject,
        contactData.user = adminResponse._id;
        contactData.answerRead = true;
        contactData.lastAnswer = "user";
        contactData.openedByAdmin = false;
        contactData.resolved = false;
        contactData.type = "guest";
        contactData.email = req.body.email;
      
        const newMessage = {
            timestamp: new Date(),
            text: req.body.text,
            type: "user"
        }
       
        contactData.userQuestions = [];
        contactData.userQuestions.push(newMessage);
        contactData.adminAnswers = [];

       const contactForm = new ContactForm(contactData);

           adminResponse.contactForms.push(contactForm)
          await contactForm.save();
          await adminResponse.save();
          res.send("Contact form saved")
       }).catch(err => {
           console.log("error 2", err)
        res.status(400).send('Could not get admin data!')
       })
    }
})

module.exports = otherRouter;