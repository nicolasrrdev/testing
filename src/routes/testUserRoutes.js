const mongoose = require('mongoose')
const User = require('../models/user')
const { expect } = require('chai')
const request = require('supertest')
const express = require('express')
const app = express()
app.use(express.json())

const userRoutes = require('./userRoutes')
app.use('/', userRoutes)

before(async function () {
  this.timeout(10000)
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/usuariosBD')
  } catch (error) {
    throw error
  }
})
after(async function () {
  this.timeout(10000)
  try {
    await mongoose.connection.close()
  } catch (error) {
    throw error
  }
})

console.log('\nTesting para la ruta /crear-usuario')

describe('1. Test de Correo ya registrado', function () {
  this.timeout(20000)
  const correoTest1 = 'correo1@ejemplo.com'
  const contraseñaTest1 = '1234567ñÑ*'
  let testFailed1 = false
  it('Debería devolver un error 400 con el mensaje: "El correo electrónico ya está registrado"', async function () {
    let response
    try {
      response = await request(app)
        .post('/crear-usuario')
        .send({ correo: correoTest1, contraseña: contraseñaTest1 })
      expect(response.body.estado).to.be.a('string')
      expect(response.body).to.have.property('estado')
      expect(response.status).to.equal(400)
      expect(response.body).to.deep.equal({ estado: 'error', mensaje: 'El correo electrónico ya está registrado' })
      console.log('Correo enviado: ', correoTest1)
      console.log('Contraseña enviada: ', contraseñaTest1)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
    } catch (error) {
      testFailed1 = true
      console.log('Correo enviado: ', correoTest1)
      console.log('Contraseña enviada: ', contraseñaTest1)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
      throw error
    }
  })
  after(async function () {
    if (testFailed1) {
      try {
        await User.deleteMany({ correo: correoTest1 })
      } catch (error) {
        throw error
      }
    }
  })
})

describe('2. Test de Longitud de contraseña incorrecta', function () {
  this.timeout(20000)
  const correoTest2 = 'correo2@ejemplo.com'
  const contraseñaTest2 = '123456ñÑ*'
  let testFailed2 = false
  it('Debería devolver un Status 400 y en el Body en errores: "La contraseña debe tener al menos 10 caracteres"', async function () {
    let response
    try {
      response = await request(app)
        .post('/crear-usuario')
        .send({ correo: correoTest2, contraseña: contraseñaTest2 })
      expect(response.status).to.equal(400)
      expect(response.body.estado).to.equal('error')
      expect(response.body.errores).to.include('La contraseña debe tener al menos 10 caracteres')
      console.log('Correo enviado: ', correoTest2)
      console.log('Contraseña enviada: ', contraseñaTest2)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
    } catch (error) {
      testFailed2 = true
      console.log('Correo enviado: ', correoTest2)
      console.log('Contraseña enviada: ', contraseñaTest2)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
      throw error
    }
  })
  after(async function () {
    if (testFailed2) {
      try {
        await User.deleteMany({ correo: correoTest2 })
      } catch (error) {
        throw error
      }
    }
  })
})

describe('3. Test de La contraseña no tiene por lo menos un número', function () {
  this.timeout(20000)
  const correoTest3 = 'correo3@ejemplo.com'
  const contraseñaTest3 = 'abcdefgñÑ*'
  let testFailed3 = false
  it('Debería devolver un Status 400 y en el Body en errores: "La contraseña debe contener al menos un número"', async function () {
    let response
    try {
      response = await request(app)
        .post('/crear-usuario')
        .send({ correo: correoTest3, contraseña: contraseñaTest3 })
      expect(response.status).to.equal(400)
      expect(response.body.estado).to.equal('error')
      expect(response.body.errores).to.include('La contraseña debe contener al menos un número')
      console.log('Correo enviado: ', correoTest3)
      console.log('Contraseña enviada: ', contraseñaTest3)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
    } catch (error) {
      testFailed3 = true
      console.log('Correo enviado: ', correoTest3)
      console.log('Contraseña enviada: ', contraseñaTest3)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
      throw error
    }
  })
  after(async function () {
    if (testFailed3) {
      try {
        await User.deleteMany({ correo: correoTest3 })
      } catch (error) {
        throw error
      }
    }
  })
})

describe('4. Test de La contraseña no tiene por lo menos una minúscula', function () {
  this.timeout(20000)
  const correoTest4 = 'correo4@ejemplo.com'
  const contraseñaTest4 = '12345678Ñ*'
  let testFailed4 = false
  it('Debería devolver un Status 400 y en el Body en errores: "La contraseña debe contener al menos una letra minúscula"', async function () {
    let response
    try {
      response = await request(app)
        .post('/crear-usuario')
        .send({ correo: correoTest4, contraseña: contraseñaTest4 })
      expect(response.status).to.equal(400)
      expect(response.body.estado).to.equal('error')
      expect(response.body.errores).to.include('La contraseña debe contener al menos una letra minúscula')
      console.log('Correo enviado: ', correoTest4)
      console.log('Contraseña enviada: ', contraseñaTest4)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
    } catch (error) {
      testFailed4 = true
      console.log('Correo enviado: ', correoTest4)
      console.log('Contraseña enviada: ', contraseñaTest4)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
      throw error
    }
  })
  after(async function () {
    if (testFailed4) {
      try {
        await User.deleteMany({ correo: correoTest4 })
      } catch (error) {
        throw error
      }
    }
  })
})

describe('5. Test de La contraseña no tiene por lo menos una mayúscula', function () {
  this.timeout(20000)
  const correoTest5 = 'correo5@ejemplo.com'
  const contraseñaTest5 = '12345678ñ*'
  let testFailed5 = false
  it('Debería devolver un Status 400 y en el Body en errores: "La contraseña debe contener al menos una letra mayúscula"', async function () {
    let response
    try {
      response = await request(app)
        .post('/crear-usuario')
        .send({ correo: correoTest5, contraseña: contraseñaTest5 })
      expect(response.status).to.equal(400)
      expect(response.body.estado).to.equal('error')
      expect(response.body.errores).to.include('La contraseña debe contener al menos una letra mayúscula')
      console.log('Correo enviado: ', correoTest5)
      console.log('Contraseña enviada: ', contraseñaTest5)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
    } catch (error) {
      testFailed5 = true
      console.log('Correo enviado: ', correoTest5)
      console.log('Contraseña enviada: ', contraseñaTest5)
      console.log('Response Status:', response.status)
      console.log('Response Body:')
      console.log(response.body)
      throw error
    }
  })
  after(async function () {
    if (testFailed5) {
      try {
        await User.deleteMany({ correo: correoTest5 })
      } catch (error) {
        throw error
      }
    }
  })
})