const express = require('express');
const ObjectID = require('mongodb').ObjectID;
const userRouter = new express.Router();
const auth = require('../middleware/AuthCheck');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');
const Item = require('../models/ItemModel');
const bcryptjs = require('bcryptjs');
const AdminData = require('../models/AdminDataModel');
const ContactForm = require('../models/ContactFormModel');
const nodemailer = require('nodemailer');
const blockAdmin = require('../middleware/blockAdmin');
const helpers = require('../helperFunctions/helpers');

//GET USER

userRouter.get('/', async (req, res) => {
  if(req.headers.authentication !== "guest"){
    const token = req.headers.authentication;
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    User.findOne({_id: decoded._id, 'tokens.token': token})
    .populate('contactForms').exec()
    .then(userResponse => {
      const shopItems = Item.find().sort({_id:-1});
      shopItems.then(itemResponse => {
        const adminDataPromise = AdminData.find({});
        adminDataPromise.then(dataResponse => {
          const popularItems = helpers.getPopularItems(dataResponse[0].stats[dataResponse[0].stats.length - 1].months);
          const discounts = dataResponse[0].discounts;
          const brands = dataResponse[0].brands;
      res.send({
        brands,
        discounts,
        popularItems,
        user: userResponse,
        items: itemResponse
      })

        })
      }).catch(err => {
        res.status(500).send("Could not send items!")
      })
    })

  } 
  
  else{
    const shopItems = Item.find().sort({_id:-1});
    shopItems.then(itemResponse => {
      const adminDataPromise = AdminData.find({});
      adminDataPromise.then(dataResponse => {
        const popularItems = helpers.getPopularItems(dataResponse[0].stats[dataResponse[0].stats.length - 1].months);
        const discounts = dataResponse[0].discounts;
        const brands = dataResponse[0].brands;
      res.send({
        brands,
        discounts,
        popularItems,
        user: "guest",
        items: itemResponse
      })
    }) 
    })
  }
})

userRouter.post('/', async (req, res) => {
  if (req.headers.type === "add email to newsletter") {
    const adminDataPromise = AdminData.find({});
    adminDataPromise.then(async dataResponse => {
      const adminData = dataResponse[0];
      if (adminData.emails.indexOf(req.body.email) === -1) {
        dataResponse[0].emails.push(req.body.email);
        await dataResponse[0].save();
        res.send('Email added to newsletter list!!')
      } else {
        res.status(400).send('This email is already subscribed to our newsletter!')
      }
    }).catch(err => {
      console.log(err);
      res.status(400).send("Could not access admin data!");
    })
  }
})

userRouter.post('/shop/:id', auth, blockAdmin, async(req, res) => {
  if(req.headers.type === "add item to cart"){
    let noPushTrigger = false;
    req.user.userCart.forEach(cart => {
      if(cart.name === req.body.item.name){
        if(cart.size === req.body.item.size){
          cart.amount += req.body.item.amount;
          noPushTrigger = true;
        }
      }
    })

    if(noPushTrigger){
      req.user.markModified('userCart');
    } else{
      const newCartItem = {
        amount: req.body.item.amount,
        name: req.body.item.name,
        size: req.body.item.size
      }
      req.user.userCart.push(newCartItem);
    }

    try{
      await req.user.save();
      res.send(req.user.userCart);
    } catch(err) {
      console.log(err)
      res.status(500).send("Could not add item to cart!")
    }
  } else if(req.headers.type === "new favourite"){
    let newFavourites = [...req.user.userFavourites];
    if(req.body.item.actionType === "add"){
      if(newFavourites.indexOf(req.body.item.id) === -1){
          newFavourites.push(req.body.item.id);
      }
    } else{
      if(newFavourites.indexOf(req.body.item.id) !== -1){
        newFavourites = newFavourites.filter(id => id !== req.body.item.id);
      }
    }
    req.user.userFavourites= newFavourites;
    req.user.markModified('userFavourites');
    try{
      await req.user.save();
      res.send(req.user.userFavourites)
    } catch(err){
      res.status(500).send("Could not add new favourite!")
    }
  } else if(req.headers.type === "new rating"){
    let trigger = false;
    let idx = null;
    let searchId = new ObjectID(req.body.item.name);
    const itemPromise = Item.findById(searchId);
    itemPromise.then(async itemResponse => {
      for(let i = 0; i < req.user.userRatings.length; i++){
        if(req.user.userRatings[i].name === req.body.item.name){
          if(req.user.userRatings[i].rating === req.body.item.rating){
            idx = i;
          } else{
            req.user.userRatings[i].rating = req.body.item.rating;
            itemResponse.rating = (((itemResponse.rating * itemResponse.numberOfVotes) + (req.body.item.rating - itemResponse.rating)) / (itemResponse.numberOfVotes)).toFixed(2);
            itemResponse.numberOfVotes++;
          }
         
          trigger = true;
          break;
        }
      }
  
      if(idx || idx === 0){
        const copyRatings = [...req.user.userRatings];
        copyRatings.splice(idx, 1);
        req.user.userRatings = copyRatings;
        itemResponse.rating = (((itemResponse.rating * itemResponse.numberOfVotes) - req.body.item.rating) / (itemResponse.numberOfVotes - 1)).toFixed(2);
        itemResponse.numberOfVotes--;
      }
  
      if(!trigger){
        req.user.userRatings.push(req.body.item);
        itemResponse.rating = (((itemResponse.rating * itemResponse.numberOfVotes) + req.body.item.rating) / (itemResponse.numberOfVotes + 1)).toFixed(2);
        itemResponse.numberOfVotes++;
      }
  
      req.user.markModified('userRatings');
      itemResponse.markModified('numberOfVotes');
      itemResponse.markModified('rating');
      try{
        await itemResponse.save();
        await req.user.save();
        res.send({
          itemRating: itemResponse.rating,
          numberOfVotes: itemResponse.numberOfVotes,
          userRatings: req.user.userRatings
        });
      } catch(err){
        res.status(500).send("Could not update rating!")
      }
    }).catch(err => {
      res.status(400).send("Item to rate could not be found!")
    })
  }
})

userRouter.post('/sign-up', async (req, res) => {
    req.body.userFavourites = [];
    req.body.userCart = [];
    req.body.userRatings = [];
    req.body.userPreviousPurchases = [];
    req.body.contactForms = [];
    
  try{
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();

    if(req.body.newsletter){
      const adminPromise = AdminData.find({});
      adminPromise.then(async adminResponse => {
        if(adminResponse[0].emails.indexOf(req.body.email) === -1){
            adminResponse[0].emails.push(req.body.email);
            await adminResponse[0].save();
        }
      }).catch(err => {
        console.log(err);
      })
    }

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
      to: req.body.email,
      subject: "Thank you for registering on Token shop",
      html:`<p>Dear ${req.body.firstName} </span>  </p><br>
      <div>We certainly hope you will enjoy your experience on our token shop!</div><br>
      <div>Feel free to write to us!</div><br>
      <br>
      <p style='font-weight:bold;'> Cheers from us</p>
      <br>
      <div>Spaha</div>
      `
  }

  transporter.sendMail(mailOptions);
    res.send({user, token})
  } catch(err){
      console.log(err);
    res.status(400).send(err)
  }
})

userRouter.post('/sign-in', async (req, res) => {
  try{
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();

    res.send({user, token})
  } catch(err){
    res.status(404).send("Email/Password combination is not correct!");
  }
})

userRouter.post('/log-out', auth, async (req, res) => {
  try{
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
    await req.user.save();
    res.send('User logged out!');
  } catch(err){
    res.send("Error occured during sign out!");
  }
})

userRouter.post('/profile:id', auth, blockAdmin,  async(req, res) => {
  if(req.headers.type === "delete item from cart"){
    const newUserCart = req.user.userCart.filter(item => {
      return item._id.toString() !== req.body.item;
    })
    req.user.userCart = newUserCart;
    req.user.markModified('userCart');
    await req.user.save();
    res.send(newUserCart);
  } else if(req.headers.type === "move to favourites"){
    let newFavourite = "";
    let newCart = [];
    for(let i = 0; i < req.user.userCart.length; i++){
      if(req.user.userCart[i]._id.toString() !== req.body.item.cartId.toString()){
        newCart.push(req.user.userCart[i]);
      } else{
        newFavourite = req.body.item.itemId;
      }
    }

    if(req.user.userFavourites.indexOf(newFavourite) === -1){
      req.user.userFavourites.push(newFavourite);
    }
    req.user.userCart = newCart;
    req.user.markModified('userCart');
    await req.user.save();
    res.send({
      newFavourites: req.user.userFavourites,
      newCart: req.user.userCart
    })
  } else if(req.headers.type === "edit cart"){
    for(let i = 0; i < req.user.userCart.length; i++){
      if(req.user.userCart[i]._id.toString() === req.body.item.cartId.toString()){
        req.user.userCart[i] = req.body.item;
        break;
      }
    }
    req.user.markModified('userCart');
    await req.user.save();
    res.send(req.user.userCart);
  } else if(req.headers.type === "change account details"){
    const passCheck = await bcryptjs.compare(req.body.details.oldPassword, req.user.password);
    if(!passCheck){
        res.status(400).send("Password is not correct");
    } else{
      if(req.body.details.firstName !== "" && req.body.details.firstName !== req.user.firstName){
        req.user.firstName = req.body.details.firstName;
      }

      if(req.body.details.lastName !== "" && req.body.details.lastName !== req.user.lastName){
        req.user.lastName = req.body.details.lastName;
      }

      if(req.body.details.email !== "" && req.body.details.email !== req.user.email){
        req.user.email = req.body.details.email;
      }

      if(req.body.details.newPassword !== ""){
        req.user.password = req.body.details.newPassword;
      }

      if(req.body.details.userAddress !== "" && req.body.details.userAddress !== req.user.userAddress){
        req.user.userAddress = req.body.details.userAddress
      }

      try{
        await req.user.save()
      res.send(req.user);
      } catch(err) {
        res.status(500).send(err);
      }
    }
  } else if(req.headers.type === "mark as read"){
    const id = new ObjectID(req.body.data._id)
    const contactFormPromise = ContactForm.findById(id);
    contactFormPromise.then(async contactResponse => {
      contactResponse.answerRead = true;
      await contactResponse.save();
      res.send(contactResponse);
    }).catch(err => {
      res.status(400).send("Could not mark as read!")
    })
  } else if(req.headers.type === "new user answer"){
    if(req.body.data.text !== ""){
      const id = new ObjectID(req.body.data._id);
      const contactFormPromise = ContactForm.findById(id);
      contactFormPromise.then(async contactResponse => {
        if(!contactResponse.resolved){
          const newUserMessage = {
            timestamp: new Date(),
            type: "user",
            text: req.body.data.text
          }
        contactResponse.userQuestions.push(newUserMessage);
        contactResponse.answerRead = true;
        contactResponse.openedByAdmin = false;
        contactResponse.lastAnswer = "user";
        await contactResponse.save();
        res.send(contactResponse);
        }
      }).catch(err => {
        res.status(400).send("Could not answer to the user at the moment!")
      })
    } else{
      res.status(400).send("Message cannot be blank!")
    }

  } else if(req.headers.type === "delete purchase"){
      const filteredPurchases = req.user.userPreviousPurchases.filter(purchase => purchase._id.toString() !== req.body.id.toString())
      req.user.userPreviousPurchases = filteredPurchases;
      req.user.markModified('userPreviousPurchases');
      await req.user.save();
      res.send(req.user.userPreviousPurchases);
    }
})

userRouter.post('/checkout/finalize-purchase', auth, blockAdmin, async (req, res) => {
  if (req.headers.type === "credit card") {
    let errorObject = [];
    let errorTrigger = false;

    let cardNumberToString = req.body.formData.cardNumber.toString();
    if (cardNumberToString.length !== 16) {
      errorObject.push("Please enter valid card number")
      errorTrigger= true;
    }
    if (req.body.formData.cardName.length < 2) {
      errorObject.push("Please enter valid card name")
      errorTrigger= true;
    } 

    if (typeof req.body.formData.expiryMonth !== "number" || req.body.formData.expiryMonth > 12 || req.body.formData.expiryMonth < 1) {
      errorObject.push("Please enter valid expiry month!")
      errorTrigger= true;
    }
    if (typeof req.body.formData.expiryYear !== "number" || req.body.formData.expiryYear < 20 || req.body.formData.expiryYear > 99) {
      errorObject.push("Please enter valid expiry year!")
      errorTrigger= true;
    }
    if (typeof req.body.formData.cvcCvv !== "number" || req.body.formData.cvcCvv > 999) {
      errorObject.push("Please enter valid CVC/CVV!")
      errorTrigger= true;
    }
    if (req.body.formData.billingAddress.length < 2) {
      errorObject.push("Please enter a valid address!")
      errorTrigger= true;
    }

    if (req.body.formData.cardCity.length < 2) {
      errorObject.push("Please enter valid city!")
      errorTrigger= true;
    }
    if (req.body.formData.cardCountry.length < 2) {
      errorObject.push("Please enter valid county!")
      errorTrigger= true;
    }
    if (req.body.formData.cardPostalCode.length < 2) {
      errorObject.push("Please enter valid postal code!")
      errorTrigger= true;
    }

    if(errorTrigger){
      return res.status(400).send(errorObject)
    }


      req.user.userCart.forEach((cartItem, cartIndex) => {
        const id = new ObjectID(cartItem.name);
        const itemPromise = Item.findById(id);
        itemPromise.then(itemResponse => {
          if(itemResponse.availability[cartItem.size] < cartItem.amount){
           errorTrigger = true;
           errorObject.push({
             errorMessage: `Unfortunately, available amount for the size ${cartItem.size} of ${itemResponse.fullName} is ${itemResponse.availability[cartItem.size]} `
           })
          }
  
          if(cartIndex === req.user.userCart.length - 1){
            if(errorTrigger){
              res.status(400).send(errorObject)
            } else{
              const adminDataPromise = AdminData.find({});
              adminDataPromise.then(adminDataResponse => {
              const discounts = adminDataResponse[0].discounts;
              const currentDate = new Date();

                req.user.userCart.forEach(async (cartItemCallback, callbackIndex) => {
                  const id = new ObjectID(cartItemCallback.name);
                
                  Item.findById(id).then(async cartItemResponse => {
                    cartItemResponse.availability[cartItemCallback.size] -= cartItemCallback.amount;
                    cartItemResponse.markModified(`availability`)
                    await cartItemResponse.save();
                    let discountAmount = 0;
  
                    if(cartItemResponse.discount){
                      for(let i = 0; i < discounts.length; i++){
                        if(discounts[i].name === cartItemResponse.discountType){
                          discountAmount = discounts[i].amount;
                          break;
                        }
                      }
                    }
                    const newObject = {
                      amount: cartItemCallback.amount,
                      discount:cartItemResponse.discount,
                      discountAmount,
                      name: cartItemCallback.name,
                      size: cartItemCallback.size
                    }
                    req.user.userPreviousPurchases.push(newObject);
                    let itemFoundTrigger = false;
                    for(let i = 0; i < adminDataResponse[0].stats.length; i++){
                      if(adminDataResponse[0].stats[i].year ===  currentDate.getFullYear()){
                       let monthNumber = currentDate.getMonth();
                        let newBrandTrigger = false;
                       for(let j = 0; j < adminDataResponse[0].stats[i].months[monthNumber].brands.length; j++){
                        if(adminDataResponse[0].stats[i].months[monthNumber].brands[j].type === cartItemResponse.brand){
                          let newItemTrigger = false;
                          newBrandTrigger = true;
                          for(let k = 0; k < adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems.length; k++){
                            if(adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems[k]._id.toString() === cartItemResponse._id.toString()){
                            let finalPrice = cartItemResponse.cost;
                            newItemTrigger = true;
                             if(cartItemResponse.discount){
                              finalPrice = cartItemResponse.cost - (cartItemResponse.cost * discountAmount / 100);
                             }
                             finalPrice *= cartItemCallback.amount;
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems[k].sold += cartItemCallback.amount;
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems[k].earned += finalPrice
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].itemsSold += cartItemCallback.amount;
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].moneyEarned += finalPrice;
                             adminDataResponse[0].stats[i].months[monthNumber].totalEarned += finalPrice;
                             adminDataResponse[0].stats[i].months[monthNumber].totalItemsSold += cartItemCallback.amount
                             itemFoundTrigger = true;
                             break;
                            }

                            //Ako je novi item unutar postojećeg brenda;
                            if(k === adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems.length -1){
                              if(!newItemTrigger){

                                const newItemObject = {
                                  name :  cartItemResponse.fullName,
                                  gender : cartItemResponse.gender,
                                  _id:  cartItemResponse._id,
                                  sold : cartItemCallback.amount,
                                  earned: finalPrice
                                }

                                adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems.push(newItemObject);
                              }
                            }
                          }
                        }
                      if(j === adminDataResponse[0].stats[i].months[monthNumber].brands.length - 1){
                        if(!newBrandTrigger){
                          const newIndividualItemsObject = [];
                          let finalPrice = cartItemResponse.cost;
                           if(cartItemResponse.discount){
                            finalPrice = cartItemResponse.cost - (cartItemResponse.cost * discountAmount / 100);
                           }
                           finalPrice *= cartItemCallback.amount;
                          newIndividualItemsObject.push({
                            name :  cartItemResponse.fullName,
                            gender : cartItemResponse.gender,
                            _id:  cartItemResponse._id,
                            sold : cartItemCallback.amount,
                            earned: finalPrice
                          })

                          const newBrandObject = {
                            type: cartItemResponse.brand,
                            itemsSold : cartItemCallback.amount,
                            moneyEarned : finalPrice,
                            individualItems: newIndividualItemsObject
                          }
                          adminDataResponse[0].stats[i].months[monthNumber].brands.push(newBrandObject)
                      
                          } 
                      }
                        if(itemFoundTrigger){
                          break;
                        }
                       }
                      }
                      if(itemFoundTrigger){
                        break;
                      }
                    }
                    
                    if(callbackIndex === req.user.userCart.length - 1){
                      req.user.userCart = [];
                      req.user.markModified('userCart');
                      req.user.markModified('userPreviousPurchases');
                      adminDataResponse[0].markModified('stats');
                      await adminDataResponse[0].save();
                      await req.user.save();
                      res.send(req.user.userPreviousPurchases)
                    }
                  }).catch(err => {
                    console.log(err);
                    res.status(500).send(err)
                  })
                })
              })
  
            }
          }
        }).catch(err => {
          res.status(400).send("Cannot find that item in our database!")
        })
      })
    
  } else if (req.headers.type === "paypal") {
      req.user.userCart.forEach((cartItem, cartIndex) => {
        let errorTrigger = false;
        let errorObject = [];
        const id = new ObjectID(cartItem.name);
        const itemPromise = Item.findById(id);
        itemPromise.then(itemResponse => {
          if(itemResponse.availability[cartItem.size] < cartItem.amount){
           errorTrigger = true;
           errorObject.push({
             errorMessage: `Unfortunately, available amount for the size ${cartItem.size} of ${itemResponse.fullName} is ${itemResponse.availability[cartItem.size]} `
           })
          }
  
          if(cartIndex === req.user.userCart.length - 1){
            if(errorTrigger){
              res.status(400).send(errorObject)
            } else{
              const adminDataPromise = AdminData.find({});
              adminDataPromise.then(adminDataResponse => {
              const discounts = adminDataResponse[0].discounts;
              const currentDate = new Date();

                req.user.userCart.forEach(async (cartItemCallback, callbackIndex) => {
                  const id = new ObjectID(cartItemCallback.name);
                
                  Item.findById(id).then(async cartItemResponse => {
                    cartItemResponse.availability[cartItemCallback.size] -= cartItemCallback.amount;
                    cartItemResponse.markModified(`availability`)
                    await cartItemResponse.save();
                    let discountAmount = 0;
  
                    if(cartItemResponse.discount){
                      for(let i = 0; i < discounts.length; i++){
                        if(discounts[i].name === cartItemResponse.discountType){
                          discountAmount = discounts[i].amount;
                          break;
                        }
                      }
                    }
                    const newObject = {
                      amount: cartItemCallback.amount,
                      discount:cartItemResponse.discount,
                      discountAmount,
                      name: cartItemCallback.name,
                      size: cartItemCallback.size
                    }
                    req.user.userPreviousPurchases.push(newObject);
                    let itemFoundTrigger = false;
                    for(let i = 0; i < adminDataResponse[0].stats.length; i++){
                      if(adminDataResponse[0].stats[i].year ===  currentDate.getFullYear()){
                       let monthNumber = currentDate.getMonth();
                        let newBrandTrigger = false;
                       for(let j = 0; j < adminDataResponse[0].stats[i].months[monthNumber].brands.length; j++){
                        if(adminDataResponse[0].stats[i].months[monthNumber].brands[j].type === cartItemResponse.brand){
                          let newItemTrigger = false;
                          newBrandTrigger = true;
                          for(let k = 0; k < adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems.length; k++){
                            if(adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems[k]._id.toString() === cartItemResponse._id.toString()){
                            let finalPrice = cartItemResponse.cost;
                            newItemTrigger = true;
                             if(cartItemResponse.discount){
                              finalPrice = cartItemResponse.cost - (cartItemResponse.cost * discountAmount / 100);
                             }
                             finalPrice *= cartItemCallback.amount;
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems[k].sold += cartItemCallback.amount;
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems[k].earned += finalPrice
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].itemsSold += cartItemCallback.amount;
                             adminDataResponse[0].stats[i].months[monthNumber].brands[j].moneyEarned += finalPrice;
                             adminDataResponse[0].stats[i].months[monthNumber].totalEarned += finalPrice;
                             adminDataResponse[0].stats[i].months[monthNumber].totalItemsSold += cartItemCallback.amount
                             itemFoundTrigger = true;
                             break;
                            }

                            //Ako je novi item unutar postojećeg brenda;
                            if(k === adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems.length -1){
                              if(!newItemTrigger){

                                const newItemObject = {
                                  name :  cartItemResponse.fullName,
                                  gender : cartItemResponse.gender,
                                  _id:  cartItemResponse._id,
                                  sold : cartItemCallback.amount,
                                  earned: finalPrice
                                }

                                adminDataResponse[0].stats[i].months[monthNumber].brands[j].individualItems.push(newItemObject);
                              }
                            }
                          }
                        }
                      if(j === adminDataResponse[0].stats[i].months[monthNumber].brands.length - 1){
                        if(!newBrandTrigger){
                          const newIndividualItemsObject = [];
                          let finalPrice = cartItemResponse.cost;
                           if(cartItemResponse.discount){
                            finalPrice = cartItemResponse.cost - (cartItemResponse.cost * discountAmount / 100);
                           }
                           finalPrice *= cartItemCallback.amount;
                          newIndividualItemsObject.push({
                            name :  cartItemResponse.fullName,
                            gender : cartItemResponse.gender,
                            _id:  cartItemResponse._id,
                            sold : cartItemCallback.amount,
                            earned: finalPrice
                          })

                          const newBrandObject = {
                            type: cartItemResponse.brand,
                            itemsSold : cartItemCallback.amount,
                            moneyEarned : finalPrice,
                            individualItems: newIndividualItemsObject
                          }
                          adminDataResponse[0].stats[i].months[monthNumber].brands.push(newBrandObject)
                      
                          } 
                      }
                        if(itemFoundTrigger){
                          break;
                        }
                       }
                      }
                      if(itemFoundTrigger){
                        break;
                      }
                    }
                    
                    if(callbackIndex === req.user.userCart.length - 1){
                      req.user.userCart = [];
                      req.user.markModified('userCart');
                      req.user.markModified('userPreviousPurchases');
                      adminDataResponse[0].markModified('stats');
                      await adminDataResponse[0].save();
                      await req.user.save();
                      res.send(req.user.userPreviousPurchases)
                    }
                  }).catch(err => {
                    console.log(err);
                    res.status(500).send(err)
                  })
                })
              })
  
            }
          }
        }).catch(err => {
          console.log(err);
          res.status(400).send("Cannot find that item in our database!")
        })
      })
    
  } 
})

module.exports = userRouter;