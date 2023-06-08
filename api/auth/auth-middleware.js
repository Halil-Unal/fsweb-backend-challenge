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
    let isExist = await userModel.goreBul(req.body.username, req.body.email);
    if (isExist && isExist.length > 0) {
      let currentUser = isExist[0];
    
      let isPasswordMatch = bcryptjs.compareSync(
        req.body.password,
        currentUser.password
      );
      if (!isPasswordMatch || req.body.email !== currentUser.email || req.body.username!==currentUser.username) {
        res.status(401).json({
          message: "Geçersiz kriter",
        });
      } else {
        req.currentUser = currentUser;
        next();
      }
    } else {
      res.status(401).json({
        message: "Geçersiz kriter",
      });
    }
  } catch (error) {
    next(error);
  }
};




const checkPayload = (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    if (!username || !password || !email) {
      res.status(400).json({ message: "Eksik alan var" });
      return; // Hata durumunda işlemi sonlandır
    }
    if (username.trim().length < 3 || password.trim().length < 3) {
      res.status(400).json({ message: "Kullanıcı adı ve şifre 3 karakterden az olamaz" });
      return; // Hata durumunda işlemi sonlandır
    }
    
    next();
  } catch (error) {
    next(error);
  }
}


module.exports = {
  sinirli,
  usernameVarmi,

  checkPayload
}