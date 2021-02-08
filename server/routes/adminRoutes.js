const express = require('express');
const adminRouter = new express.Router();
const ObjectID = require('mongodb').ObjectID;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const adminCheck = require('../middleware/AdminCheck');
const Item = require('../models/ItemModel');
const ContactForm = require('../models/ContactFormModel');
const AdminData = require('../models/AdminDataModel');
const nodemailer = require('nodemailer');

const DIR = './public';
const maxSize = 3097152;
const itemPictureStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${DIR}/images/temp/`);
    },
    filename: function (req, file, cb) {
        cb(null, `tempFile-${req.body.imageNumber}-${new Date().getTime()}${path.extname(file.originalname)}`)
    }
})
const upload = multer({
    storage: itemPictureStorage,
    onError: (err, next) => {
        res.send(err);
        next(err);
    },
    fileFilter: (req, file, cb) => {

        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg image formats are allowed!'))
        }
    },
    limits: { fileSize: maxSize }
});


adminRouter.post('/admin-dashboard', adminCheck, upload.single('file'), async (req, res) => {
    if (req.headers.type === "image-upload") {
        res.send({
            path: req.file.path
        });
    } else if (req.headers.type === "add-new-item") {
        if (!req.body.item.discount) {
            req.body.item.discountType = "no";
        }
        const item = new Item(req.body.item);
        const imagePaths = [];

        const adminDataPromise = AdminData.find({});
        adminDataPromise.then(async adminDataResponse => {
            if(adminDataResponse[0].brands.indexOf(item.brand) === -1){
                adminDataResponse[0].brands.push(item.brand);
                await adminDataResponse[0].save();
            } 

            for (let i = 0; i < req.body.exts.length; i++) {
                let slicedPath = req.body.exts[i].split('.');
                let extension = slicedPath[1];
                const fsPromise = await fs.rename(req.body.exts[i], `public/images/shop-items/${item._id}-${i + 1}.${extension}`, (err) => {
                    if (err) {
                        return res.status(500).send("Could not upload images at the moment!");
                    }
                })
                imagePaths.push(`public/images/shop-items/${item._id}-${i + 1}.${extension}`)
            }
            item.imagePaths = imagePaths;
    
           await item.save();
            res.send(item)

        }).catch(err => {
            res.status(500).send("Could not get admin data!")
        })
    } else if (req.headers.type === "edit item") {
        const id = new ObjectID(req.body.item._id)
        const itemPromise = Item.findById(id)
        itemPromise.then(async itemResponse => {
            console.log(req.body.item);

            if(itemResponse.fullName !== req.body.item.fullName){
                const adminDataPromise = AdminData.find({});
                adminDataPromise.then(async adminDataResponse => {
                    console.log(adminDataResponse);
                    const itemFound = false;
                        for(let i = 0; i < adminDataResponse[0].stats.length; i++){
                            for(let j = 0; j < adminDataResponse[0].stats[i].months.length; j++){
                                for(let k = 0; k < adminDataResponse[0].stats[i].months[j].brands.length; k++){
                                    if(adminDataResponse[0].stats[i].months[j].brands[k].type === itemResponse.brand){
                                        for(let n = 0; n < adminDataResponse[0].stats[i].months[j].brands[k].individualItems.length; n++){
                                            if(adminDataResponse[0].stats[i].months[j].brands[k].individualItems[n]._id.toString() === itemResponse._id.toString()){
                                                adminDataResponse[0].stats[i].months[j].brands[k].individualItems[n].name = req.body.item.fullName;
                                            }
                                        }
                                    }
                                }
                            }
                        }
              
                    //Konačni save
                    adminDataResponse[0].markModified('stats');
                    await adminDataResponse[0].save();
                }).catch(err => {
                    res.status(500).send("Could not change item!")
                })
            }

            itemResponse.availability = req.body.item.availability;
            itemResponse.markModified('availability');
            itemResponse.fullName = req.body.item.fullName;
            itemResponse.cost = req.body.item.cost;
            itemResponse.discount = req.body.item.discount;
            if (req.body.item.discount) {
                itemResponse.discountType = req.body.item.discountType;
            } else{
                itemResponse.discountType = "no"
            }
            itemResponse.rating = req.body.item.rating;
            itemResponse.numberOfVotes = req.body.item.numberOfVotes;

            const imagePaths = [...itemResponse.imagePaths];

       

           await req.body.exts[0].forEach(async (ext, i) => {
                    if (ext.indexOf("temp") !== -1) {
                        let slicedPath = ext.split('.');
                        let extension = slicedPath[1];
                        const fsUnlinkPromise =  await fs.unlink(imagePaths[i], async (err) => {
                            if (err) throw err;
                            const fsRenamePromise =  await fs.rename(ext, `public/images/shop-items/${req.body.item._id}-${i + 1}.${extension}`, (err) => {
                                if (err) {
                                    return res.status(500).send("Could not upload images at the moment!");
                                }
                            })
                        });
                        imagePaths[i] = `public/images/shop-items/${req.body.item._id}-${i + 1}.${extension}`;
                    }
                })
            
            itemResponse.imagePaths = imagePaths;
            itemResponse.markModified('imagePaths');
            await itemResponse.save();
            res.send(itemResponse);

        }).catch(err => {
            console.log("Ja sam error 101 linija:")
            console.log(err);
            res.status(400).send("Could not find item to edit!")
        })


    } else if (req.headers.type === "remove-temp-files") {
        fs.readdir('public/images/temp', (err, files) => {
            if (err) {
                res.status(400).send("Could not find temp files!")
            } else {
                for (let file of files) {
                    fs.unlink(path.join("public/images/temp", file), err => {
                        if (err) {
                            res.status(500).send("Could not delete temp files!")
                        }
                    })
                }
            }
        })
    } else if (req.headers.type === "mark as read") {
        const id = new ObjectID(req.body.message);
        const contactFormPromise = ContactForm.findById(id).populate("user", "email");
        contactFormPromise.then(async contactsResponse => {
            contactsResponse.openedByAdmin = true;
            await contactsResponse.save();
            res.send(contactsResponse);
        }).catch(err => {
            res.status(400).send("Could not mark as read!")
        })
    } else if (req.headers.type === "new admin response") {
        if (req.body.message.text !== "") {
            const id = new ObjectID(req.body.message._id);
            const contactFormPromise = ContactForm.findById(id).populate('user', "email");
            contactFormPromise.then(async contactResponse => {
                if(contactResponse.type === "auth"){
                    const newAdminMessage = {
                        timestamp: new Date(),
                        type: "admin",
                        text: req.body.message.text
                    }
                    contactResponse.adminAnswers.push(newAdminMessage);
                    contactResponse.answerRead = false;
                    contactResponse.openedByAdmin = true;
                    contactResponse.lastAnswer = "admin";
                    await contactResponse.save();
                    res.send(contactResponse);
                } else if(contactResponse.type === "guest"){
                    const transporter = nodemailer.createTransport({
                        service: "hotmail",
                        host: "smtp.office365.com",
                        port: 587,
                        auth:{
                            user: process.env.EMAIL,
                            pass: process.env.EMAIL_PASSWORD
                        }
                    });
                  
                    const mailOptions = {
                        from: process.env.EMAIL,
                        to: contactResponse.email,
                        subject: `Re: ${contactResponse.subject}`,
                        html:`<p>Hello, </span>  </p><br>
                        <div>Thank you for writing to us, we really appreciate your feedback! We are responding to you inquiry made on our token shop website:</div>
                        <blockquote style='padding:20px; background-color:#DDE4E2; border-radius:7px;'>
                        ${contactResponse.userQuestions[0].text}
                        </blockquote>
                        <br>
                        <div>${req.body.message.text}</div><br>
                        <br>
                        <p style='font-weight:bold;'> Cheers from us</p>
                        <div>Spaha</div>
                        `
                    }
                    transporter.sendMail(mailOptions);
                    const newAdminMessage = {
                        timestamp: new Date(),
                        type: "admin",
                        text: req.body.message.text
                    }
                    contactResponse.adminAnswers.push(newAdminMessage);
                    contactResponse.answerRead = true;
                    contactResponse.openedByAdmin = true;
                    contactResponse.lastAnswer = "admin";
                    contactResponse.resolved = true;
                    await contactResponse.save();
                    res.send(contactResponse);
                }

            }).catch(err => {
                res.status(400).send("Could not answer to the user at the moment!")
            })
        } else {
            res.status(400).send("Message cannot be blank!")
        }
    } else if (req.headers.type === "mark as resolved") {
        const id = new ObjectID(req.body.id);
        const contactFormPromise = ContactForm.findById(id).populate('user', "email");
        contactFormPromise.then(async contactResponse => {
            contactResponse.resolved = true;
            await contactResponse.save();
            res.send(contactResponse);
        }).catch(err => {
            res.status(400).send("Could not mark as resolved at the moment!")
        })
    } else if (req.headers.type === "new discount") {
        const adminDataPromise = AdminData.find({});
        adminDataPromise.then(async dataResponse => {
            let duplicateTrigger = false;
            for (let i = 0; i < dataResponse[0].discounts.length; i++) {
                if (dataResponse[0].discounts[i].name === req.body.discountObject.name) {
                    duplicateTrigger = true;
                    break;
                }
            }

            if (!duplicateTrigger) {
                dataResponse[0].discounts.push(req.body.discountObject);
                await dataResponse[0].save();
                res.send(dataResponse[0].discounts[dataResponse[0].discounts.length - 1]);
            } else {
                res.status(400).send(`There is already discount named ${req.body.discountObject.name}`)
            }
        })
    } else if (req.headers.type === "delete discount") {
        const adminDataPromise = AdminData.find({});
        adminDataPromise.then(async dataResponse => {
            const newDiscounts = dataResponse[0].discounts.filter(discount => discount.name !== req.body.name);
            dataResponse[0].discounts = newDiscounts;
            dataResponse[0].markModified('discounts');
            await dataResponse[0].save();
            res.send('Discount deleted!')
        }).catch(err => {
            res.status(400).send("Could not get admin data!")
        })
    } else if (req.headers.type === "change discounts") {
        const adminDataPromise = AdminData.find({});
        adminDataPromise.then(async dataResponse => {
            let errorTrigger = false;
            for (let i = 0; i < req.body.discounts.length; i++) {
                if (req.body.discounts[i].amount < 1) {
                    errorTrigger = true;
                    break;
                }
            }
            if (!errorTrigger) {

                dataResponse[0].discounts = req.body.discounts;
                dataResponse[0].markModified('discounts');
                await dataResponse[0].save();
                res.send(dataResponse[0].discounts);
            } else {
                res.status(400).send("Discount amount can't be less than 1")
            }


        }).catch(err => {
            res.status(400).send(err)
        })
    } else if (req.headers.type === "upload chart data") {
        let adminData = AdminData.find({});
        adminData.then(async dataResponse => {
            dataResponse[0].stats = req.body.data;
            dataResponse[0].markModified('stats');
            await dataResponse[0].save();
        })
    } else if(req.headers.type === "send newsletter"){
        const adminDataPromise = AdminData.find({});
        adminDataPromise.then(adminResponse => {
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                host: "smtp.office365.com",
                port: 587,
                auth:{
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
            const emails = adminResponse[0].emails;
            emails.forEach((email, index) => {
                const mailOptions = {
                    from: process.env.EMAIL,
                    to: email,
                    subject: `${req.body.subject}`,
                    html:
                    `<p>Hello, </span>  </p><br>
                    <div>${req.body.emailBody}</div>
                    <p style='font-weight:bold;'>Cheers from us</p>
                    <div>Spaha</div>
                    `
                }
                transporter.sendMail(mailOptions);
                if(index === emails.length - 1){
                    res.send("Email sent successfully!")
                }
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send("Could not get admin data!")
        })
    }
})

adminRouter.get('/admin-dashboard', adminCheck, async (req, res) => {

    if (req.headers.type === "get feedback") {
        const allFormsPromise = ContactForm.find({}).populate('user', "email");
        allFormsPromise.then(contactsResponse => {
            res.send(contactsResponse);
        }).catch(err => {
            res.status(400).send("Could not get admin feedback data!")
        })
    } else if (req.headers.type === "get admin data") {
        const getAdminDataPromise = AdminData.find({});
        getAdminDataPromise.then(dataResponse => {
            res.send(dataResponse[0]);
        }).catch(err => {
            res.status(400).send(err);
        })
    }

})


module.exports = adminRouter;