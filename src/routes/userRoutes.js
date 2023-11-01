const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/obtener-usuarios', async (req, res) => {
  try {
    const usuarios = await User.find({}, 'correo -_id')
    if (usuarios.length === 0) {
      return res.status(404).json({ estado: 'success', mensaje: 'No se encontraron usuarios registrados' })
    }
    return res.status(200).json({ estado: 'success', datos: usuarios })
  } catch (error) {
    return res.status(500).json({ estado: 'error', mensaje: 'Error al obtener la lista de usuarios' })
  }
})

router.post('/crear-usuario', async (req, res) => {
  try {
    const { correo, contraseña } = req.body
    if (!correo || !contraseña) {
      return res.status(400).json({ estado: 'error', mensaje: 'Formato de solicitud incorrecto. Debe enviar un objeto JSON con correo y contraseña' })
    }
    const existingUser = await User.findOne({ correo })
    if (existingUser) {
      return res.status(400).json({ estado: 'error', mensaje: 'El correo electrónico ya está registrado' })
    }
    const errores = []
    const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)*\.[A-Z]{2,6}$/i
    if (!emailRegex.test(correo)) {
      errores.push('El correo electrónico no es válido')
    }
    if (/\s/.test(contraseña)) {
      errores.push('La contraseña no puede contener espacios en blanco')
    }
    if (contraseña.length < 10) {
      errores.push('La contraseña debe tener al menos 10 caracteres')
    }
    if (!/\d/.test(contraseña)) {
      errores.push('La contraseña debe contener al menos un número')
    }
    if (!/[a-záéíóúüñ]/.test(contraseña)) {
      errores.push('La contraseña debe contener al menos una letra minúscula')
    }
    if (!/[A-ZÁÉÍÓÚÜÑ]/.test(contraseña)) {
      errores.push('La contraseña debe contener al menos una letra mayúscula')
    }
    // !@#$%^&*()_-+=[]{};:'",.<>/?\|~`
    if (!/[!@#\$%\^&*\(\)_\-\+=\[\]{};:'",.<>/?\\|~`]/.test(contraseña)) {
      errores.push('La contraseña debe contener al menos un carácter especial')
    }    
    if (errores.length > 0) {
      return res.status(400).json({ estado: 'error', errores })
    }
    const hashedPassword = await bcrypt.hash(contraseña, 10)
    const user = new User({ correo, contraseña: hashedPassword })
    await user.save()
    return res.status(201).json({ estado: 'success', mensaje: 'Usuario creado exitosamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ estado: 'error', mensaje: 'Error al crear el usuario' })
  }
})

module.exports = router