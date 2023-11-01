const express = require('express')
const app = express()
const PORT = 3000

app.use(express.json())
const conectarBD = require('./bd')
conectarBD()

const userRoutes = require('./routes/userRoutes')
app.use('/api', userRoutes)

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`)
})