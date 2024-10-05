import express from 'express';
import passport from 'passport';
import config from './config.js'
import bodyParser from 'body-parser'
import Captions from './models/Caption.js';
import { transaction } from './sequelize.js';
import Pics from './models/Pic.js';

const app = express();
console.log(config.PORT)
const PORT = config.PORT

app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.json({ message: 'first endpoint' })
})

app.get('/pics/:id', async (req, res, next) => {
    try {
        const pic = await transaction(async (t) => {
            const picFound = await Pics.findOne({
                where: {
                    id: req.params.id
                },
                transaction: t
            })
            console.log('picfound', picFound.dataValues)
            return picFound.dataValues
        })
        const resultingCaptions = await transaction(async (t) => {
            const captions = await Captions.findAll({
                where: {
                    pic_id: req.params.id
                },
                transaction: t
            })
            return captions
        })
        pic.captions = resultingCaptions
        res.status(200).json(pic)
    } catch (error) {
        return next(error)
    }
})
app.get('/pics', async (req, res, next) => {
    try {
        const result = await transaction(async (t) => {
            const pics = await Pics.findAll({
                transaction: t
            })
            return pics;
        })
        console.log('pics found')
        res.status(200).json({pics: result })
    } catch (error) {
        console.log('Transaction failed ', error)
        return next(error)
    }
})
app.post('/caption', async (req, res, next) => {
    console.log(req.body)
    if (req.body.pic_id && req.body.caption) {
        try {
            const result = await transaction(async (t) => {
                const caption = await Captions.create({
                    pic_id: req.body.pic_id,
                    caption: req.body.caption
                })
                return caption;
            })
            console.log('Transaction committed', result)
            res.status(200).json({ message: `caption added to pic ${req.body.pic_id}` })

        } catch (error) {
            console.log('Transaction failed ', error)
        }
        //add to db
    } else {
        const error = new Error('Missing required caption fields')
        error.status = 400
        return next(error)
    }
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    res.status(status).send(err.message)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
}) 