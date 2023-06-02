const router = require("express").Router();
const { usernameVarmi,checkPayload } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); 
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userModel = require("../users/users-model");

router.post("/register",checkPayload, async(req, res, next) => {

  try {
    let hashedPassword=bcryptjs.hashSync(req.body.password);
    let userRequestModel = {username:req.body.username,password:hashedPassword,email:req.body.email};
    const registeredUser = await userModel.ekle(userRequestModel);
    res.status(201).json(registeredUser);
  } catch (error) {
    next(error);
  }
});


router.post("/login",checkPayload, usernameVarmi, (req, res, next) => {

  try {
    let payload = {
      subject:req.currentUser.user_id,
      username:req.currentUser.username,
   
    }
    const token = jwt.sign(payload,JWT_SECRET,{expiresIn:"1d"});
    res.json({
      message:`${req.currentUser.username} geri geldi!`,
      token: token
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;