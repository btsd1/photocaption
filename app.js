import express from 'express';
import passport from 'passport';
import config from './config.js'

const app = express();
console.log(config.PORT)
const PORT = config.PORT
app.get('/', (req, res, next) => {
    res.json({message: 'first endpoint'})
})

app.listen(PORT, ()=> {
    console.log(`Server listening on port ${PORT}`)
}) 