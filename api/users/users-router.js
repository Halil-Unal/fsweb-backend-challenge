const router = require("express").Router();
const Users = require("./users-model.js");
const { sinirli } = require("../auth/auth-middleware.js");

/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kimlik kontrolü yapılmış kullanıcılar
  erişebilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    }
  ]
 */
router.get("/", sinirli, (req, res, next) => { // hazır
  Users.bul()
    .then(users => {
      res.json(users);
    })
    .catch(next);
});

/**
  [GET] /api/users/:user_id

  Bu uçnokta SINIRLIDIR: sadece kimlik denetimi yapılmış ve rolü 'admin' olan kullanıcılar
  erişebilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    }
  ]
 */
router.get("/:user_id", sinirli, (req, res, next) => { // hazır
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
