const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

router.get('/obtener-usuarios', async (req, res) => {
  try {
    const usuarios = await User.find({}, 'correo -_id')
    if (usuarios.length === 0) {
      return res.status(404).json({ status: 'success', message: 'No se encontraron usuarios registrados' })
    }
    return res.status(200).json({ status: 'success', data: usuarios })
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Error al obtener la lista de usuario' })
  }
})

router.post('/crear-usuario', async (req, res) => {
  try {
    const { correo, contraseña } = req.body
    if (!correo || !contraseña) {
      return res.status(400).json({ error: 'Formato de solicitud incorrecto. Debe enviar un objeto JSON con correo y contraseña' })
    }
    const existingUser = await User.findOne({ correo })
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' })
    }
    const errors = []
    const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@[A-Z0-9-]+(\.[A-Z0-9-]+)*\.[A-Z]{2,6}$/i
    if (!emailRegex.test(correo)) {
      errors.push('El correo electrónico no es válido.')
    }
    if (/\s/.test(contraseña)) {
      errors.push('La contraseña no puede contener espacios en blanco.')
    }    
    if (contraseña.length < 10) {
      errors.push('La contraseña debe tener al menos 10 caracteres.')
    }
    if (!/\d/.test(contraseña)) {
      errors.push('La contraseña debe contener al menos un número.')
    }
    if (!/[a-záéíóúüñ]/i.test(contraseña)) {
      errors.push('La contraseña debe contener al menos una letra minúscula.')
    }
    if (!/[A-ZÁÉÍÓÚÜÑ]/.test(contraseña)) {
      errors.push('La contraseña debe contener al menos una letra mayúscula.')
    }
    // !@#$%^&*()_-+=[]{};:'",.<>/?\|~`
    if (!/[!@#\$%\^&*\(\)_\-\+=\[\]{};:'",.<>/?\\|~`]/.test(contraseña)) {
      errors.push('La contraseña debe contener al menos un carácter especial.')
    }    
    if (errors.length > 0) {
      return res.status(400).json({ errors })
    }
    const hashedPassword = await bcrypt.hash(contraseña, 10)
    const user = new User({ correo, contraseña: hashedPassword })
    await user.save()
    return res.status(201).json({ status: 'success', message: 'Usuario creado exitosamente' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ status: 'error', message: 'Error al crear el usuario' })
  }
})

module.exports = router