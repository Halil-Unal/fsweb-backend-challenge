const router = require("express").Router();
const Users = require("./users-model.js");
const { sinirli } = require("../auth/auth-middleware.js");


router.get("/", sinirli, (req, res, next) => { 
  Users.bul()
    .then(users => {
      res.json(users);
    })
    .catch(next);
});


router.get("/:user_id", sinirli, (req, res, next) => { 
  Users.idyeGoreBul(req.params.user_id)
    .then(user => {
      res.json(user);
    })
    .catch(next);
});

router.post("/", sinirli, (req, res, next) => {
  const { comment_text } = req.body;
  const username = req.username;

  Users.add(username, comment_text)
    .then((insertedComment) => {
      if (insertedComment) {
        res.json({ success: true, comment_text: insertedComment });
      } else {
        res.json({ success: false, message: 'Yorum eklenemedi' });
      }
    })
    .catch(next);
});

module.exports = router;
