const db = require('../../data/db-config.js');

function bul() {
  /**
    2 tabloyu birleştirmeniz lazım (join)
    Tüm kullanıcılar DİZİSİNİ çözümlemeli

    [
      {
        "user_id": 1,
        "username": "bob",
        "role_name": "admin"
      },
      {
        "user_id": 2,
        "username": "sue",
        "role_name": "instructor"
      }
    ]
   */
  return db("users as u")
         .leftJoin("comments as c","c.user_id","u.user_id")
         .select("u.user_id","u.username","c.comment_text");
}
//goreBul({username:"veysel"});
//goreBul({user_id:1})
function goreBul(filtre) {
  /**
    2 tabloyu birleştirmeniz gerekiyor
    Filtreyle eşleşen kullanıcıları içeren DİZİYİ çözümlemeli

    [
      {
        "user_id": 1,
        "username": "bob",
        "password": "$2a$10$dFwWjD8hi8K2I9/Y65MWi.WU0qn9eAVaiBoRSShTvuJVGw8XpsCiq",
        "role_name": "admin",
      }
    ]
   */
    return db("users as u")
    .leftJoin("comments as c","c.user_id","u.user_id")
    .select("u.*","c.comment_text")
    .where("u.username",filtre);
}

function idyeGoreBul(user_id) {
  /**
    2 tabloyu birleştirmeniz gerekiyor
    Verilen id li kullanıcıyı çözümlemeli

    {
      "user_id": 2,
      "username": "sue",
      "role_name": "instructor"
    }
   */
    return db("users as u")
    .leftJoin("comments as c","c.user_id","u.user_id")
    .select("u.user_id","u.username","c.comment_text")
    .where("u.user_id",user_id).first();
}

/**
  Kullanıcı oluşturmak için tek bir insert varsa (users tablosuna) eğer verilen role_name db'de mevcutsa
  ya da 2 insert varsa (önce roles ve sonra users tablosuna)
  role_name dbde kayıtlı değilse.

  Kullanıcı oluşturmak gibi bir işlem birden fazla tabloya veri ekliyorsa,
  tüm operasyonların başarılı veya başarısız olmasını isteriz. Eğer yeni role eklenemezse
  kullanıcı eklemesinin de başarısız olması gerekir.

  Bu gibi durumlarda şu işlemleri kullanırız: işlemin içindeki herhangi birisi başarısız olursa,
  tüm veritabanı içindeki değişiklikler geri alınır

  {
    "user_id": 7,
    "username": "anna",
    "role_name": "team lead"
  }
 */
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