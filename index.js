const express = require('express');

const db = require('./data/db')

const routes = require('./routes/posts')

const server = express();
const cors = require('cors')

server.use(express.json())
server.use(cors())
server.use('/api/posts', routes)

server.listen(5000, () => {
    console.log('server is running on port 5000')
})