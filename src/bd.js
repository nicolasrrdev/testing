const mongoose = require('mongoose')

const conectarBD = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/usuariosBD')
    console.log('Conexión a la base de datos exitosa')
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error)
  }
}

module.exports = conectarBD