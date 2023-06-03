const { JWT_SECRET } = require("../secrets"); 
const userModel = require("../users/users-model");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

const sinirli = (req, res, next) => {
  try {
    let authHeader = req.headers["authorization"];
    if (!authHeader) {
      res.status(401).json({ message: "Token gereklidir" });
    } else {
      jwt.verify(authHeader, JWT_SECRET, (err, decodedToken) => {
        if (err) {
          res.status(401).json({ message: "Token gecersizdir" });
        } else {
          req.username = decodedToken.username; // Kullanıcı adını burada alıyoruz
         
          next();
        }
      });
    }
  } catch (error) {
    next(error);
  }
};



const usernameVarmi = async (req, res, next) => {

 try {
  let isExist = await userModel.goreBul(req.body.username);
  if(isExist && isExist.length>0){
    let currentUser = isExist[0];
    let isPasswordMatch = bcryptjs.compareSync(req.body.password,currentUser.password);
    if(!isPasswordMatch){
      res.status(401).json({
        message: "Geçersiz kriter"
      })
    }else{
      req.currentUser  = currentUser;
      next();
    }
  }else{
    res.status(401).json({
      message: "Geçersiz kriter"
    })
  }
 } catch (error) {
  next(error);
 }
}




const checkPayload = (req,res,next)=>{
  try {
    let {username,password,email} = req.body;
    if(!username || !password|| !email){
      res.status(400).json({messsage:"Eksik alan var"});
    }if(username.length<3 || password.length<3){
      res.status(400).json({messsage:"Kullanıcı adı ve şifre 3 karakterden az olamaz"});
    }
    
    
    else{
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sinirli,
  usernameVarmi,

  checkPayload
}