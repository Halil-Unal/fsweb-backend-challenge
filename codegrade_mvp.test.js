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
  
  
  describe('[GET] /api/users', () => {
    it('[17] token göndermeden denenrse doğru mesaj', async () => {
      const res = await request(server).get('/api/users')
      expect(res.body.message).toMatch(/token gereklidir/i)
    }, 750)
    it('[18] geçersiz token girilirse doğru mesaj', async () => {
      const res = await request(server).get('/api/users').set('Authorization', 'foobar')
      expect(res.body.message).toMatch(/token gecersizdir/i)
    }, 750)
   
  })

})
