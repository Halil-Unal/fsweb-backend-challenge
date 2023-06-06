const router = require("express").Router();
const { usernameVarmi,checkPayload } = require('./auth-middleware');
const { JWT_SECRET } = require("../secrets"); 
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const userModel = require("../users/users-model");
jwtCache =[];
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
      email:req.currentUser.email
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
router.get('/logout', (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET); // Verify the token

      // Token is valid, perform logout action
      res.clearCookie('token'); // Clear the token cookie

      res.json({
        message: "Gene bekleriz!...",
        clearToken: true // Add a flag to indicate clearing the token on the client-side
      });
    } catch (error) {
      next({ status: 400, message: "Token is not valid!..." });
    }
  } else {
    next({ status: 400, message: "Token is not provided!..." });
  }
});


module.exports = router;