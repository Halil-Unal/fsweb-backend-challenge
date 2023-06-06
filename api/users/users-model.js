const db = require('../../data/db-config.js');

function bul() {
  
  return db("users as u")
         .leftJoin("comments as c","c.user_id","u.user_id")
         .select("u.user_id","u.username","c.comment_text");
}

function goreBul(username, email) {
  return db("users as u")
    .leftJoin("comments as c", "c.user_id", "u.user_id")
    .select("u.*", "c.comment_text")
    .where(function () {
      this.where("u.username", username).orWhere("u.email", email);
    });
}


function idyeGoreBul(user_id) {

    return db("users as u")
    .leftJoin("comments as c","c.user_id","u.user_id")
    .select("u.user_id","u.username","c.comment_text")
    .where("u.user_id",user_id).first();
}

  async function ekle({ username, password, email }) {
    try {
      let created_user_id;
  
      await db.transaction(async (trx) => {
        const [user_id] = await trx("users").insert({
          username,
          password,
          email,
        });
  
        created_user_id = user_id;
      });
  
      return await idyeGoreBul(created_user_id);
    } catch (error) {
      throw error;
    }
  }
  
  async function add(username, comment) {
    if (!comment) {
      throw new Error('Yorum boş olamaz');
    }
  
    const user = await db('users').where('username', username).first();
  
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }
  
    const [comment_id] = await db('comments').insert({
      comment_text: comment,
      user_id: user.user_id
    });
  
    return {
   
      username: user.username,
      comment_text: comment
    };
  }
  
  

  
  
  

module.exports = {
  ekle,
  bul,
  goreBul,
  idyeGoreBul,add
};