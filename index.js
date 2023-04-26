const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.get('/demo', function (req, res) {
    res.send('Hello World Demo')
})

app.listen(3000)

module.exports = app;
