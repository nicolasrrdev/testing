const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  correo: {
    type: String,
    unique: true,
    required: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('User', userSchema)