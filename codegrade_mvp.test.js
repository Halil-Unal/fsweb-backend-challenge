const request = require('supertest')
const server = require('./api/server')
const db = require('./data/db-config')
const bcrypt = require('bcryptjs')
const jwtDecode = require('jwt-decode')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})
beforeEach(async () => {
  await db.seed.run()
})
afterAll(async () => {
  await db.destroy()
})

it('[0] sağlık', () => {
  expect(true).not.toBe(false)
})

describe('server.js', () => {
  describe('[POST] /api/auth/login', () => {
    it('[1] geçerli kriterlerde doğru mesajı döndürüyor', async () => {
      const res = await request(server).post('/api/auth/login').send({ username: 'ali',email:"ali@gmail.com", password: '1234' })
      expect(res.body.message).toMatch(/ali geri/i)
    }, 750)
    it('[2] kriterler geçersizse doğru mesaj ve durum kodu', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'alis', password: '1234',email:"ali@gmail.com" })
      expect(res.body.message).toMatch(/ersiz kriter/i)
      expect(res.status).toBe(401)
      res = await request(server).post('/api/auth/login').send({ username: 'ali', password: '12345',email:"ali@gmail.com" })
      expect(res.body.message).toMatch(/ersiz kriter/i)
      expect(res.status).toBe(401)
    }, 750)})


    describe('server.js', () => {
      describe('[POST] /api/auth/register', () => {
        it('[3] eksik alan gönderilirse', async () => {
          const res = await request(server)
            .post('/api/auth/register')
            .send({ password: '1234', email: "veli@gmail.com" });
    
          expect(res.body.message).toMatch(/eksik alan var/i);
          expect(res.status).toBe(400);
        });
    
        it('[4] username veya password gerekli uzunlukta girilmezse', async () => {
          const res1 = await request(server)
            .post('/api/auth/register')
            .send({ username: 'a', password: '1234', email: "veli@gmail.com" });
    
          expect(res1.body.message).toMatch(/3 karakter/i);
          expect(res1.status).toBe(400);
    
          const res2 = await request(server)
            .post('/api/auth/register')
            .send({ username: 'aslı', password: '12', email: "veli@gmail.com" });
    
          expect(res2.body.message).toMatch(/3 karakter/i);
          expect(res2.status).toBe(400);
        });
      });
    });
    
    
  


  describe('[GET] /api/users', () => {
    it('[5] token göndermeden denenrse doğru mesaj', async () => {
      const res = await request(server).get('/api/users')
      expect(res.body.message).toMatch(/token gereklidir/i)
    }, 750)
    it('[6] geçersiz token girilirse doğru mesaj', async () => {
      const res = await request(server).get('/api/users').set('Authorization', 'foobar')
      expect(res.body.message).toMatch(/token gecersizdir/i)
    }, 750)
    it('[7] token geçerliyse doğru kullanıcı listesi', async () => {
      let res = await request(server).post('/api/auth/login').send({ username: 'ali', password: '1234',email:"ali@gmail.com" })
      res = await request(server).get('/api/users').set('Authorization', res.body.token)
      expect(res.body).toMatchObject([{ "comment_text": "hava çok güzel", "user_id": 1, "username": "ali" }, {"comment_text": "hatalarından ders çıkar", "user_id": 2, "username": "zeynep" }])
    }, 750)
  })

})

