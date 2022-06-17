const express = require('express')
const connectDB = require('./conf/mongodb')

const app = express()

// Config
require('dotenv').config()

// Connect DB
connectDB().catch(console.error)

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.end('Welcome')
})

app.listen(PORT, (req, res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
