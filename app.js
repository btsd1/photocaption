import express from 'express';
import session from 'express-session'
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local'
import config from './config.js'
import Captions from './models/Caption.js';
import Users from './models/User.js'
import { transaction } from './sequelize.js';
import Pics from './models/Pic.js';
import bcrypt from 'bcrypt';
import NodeCache from 'node-cache';
import SequelizeStore from 'connect-session-sequelize';
import { sequelize } from './sequelize.js'; // Assuming you have a Sequelize instance exported from your models

const SequelizeSessionStore = SequelizeStore(session.Store);


const cache = new NodeCache({
    stdTTL: 100,
    checkperiod: 120
})
const maxPicsCached = 10

const app = express();
const PORT = config.PORT
console.log('env is ', process.env.NODE_ENV)
app.use(express.json())
app.use(session({
    store: new SequelizeSessionStore({
        db: sequelize,
        tableName: 'Sessions' // Customize the table name if needed
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        httpOnly: true,
        sameSite: 'Lax'
    }

}))

sequelize.sync().then(() => {
    console.log('Database & tables created!');
});

if (process.NODE_ENV == 'production'){
    console.log('Trusting Render proxy')
    app.set('trust proxy', 1); // Trust the first proxy
}
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
    //     {
    //     usernameField: 'email', // Adjust if you're using a different field. default is PP expects you to send req.body.username
    //     passwordField: 'password'
    //   }, 
    async (username, password, done) => {
        try {
            const user = await Users.findOne({
                where: {
                    email: username
                }
            })
            const pwMatch = await bcrypt.compare(password, user.password)
            if (user && pwMatch) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: 'Invalid credentials'
                })
            }
        } catch (error) {
            throw error
        }
    }))

passport.serializeUser((user, done) => {
    return done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    const user = await Users.findOne({
        where: {
            id: id
        }
    })
    return done(null, user)
})

app.post('/register', async (req, res, next) => {
    try {
        if (req.body.username && req.body.password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
            await transaction(async (t) => {
                const user = await Users.create({
                    email: req.body.username,
                    password: hashedPassword
                }, { transaction: t });

                console.log('User created:', user); // Log the created user
                return user;
            });

            res.status(201).send(`User with email ${req.body.username} created`);
        } else {
            const error = new Error('Missing registration details');
            error.status = 400;
            return next(error);
        }
    } catch (error) {
        console.error('Registration error:', error); // Log the error
        return next(error);
    }
})

//tk do something else with these redirect routes
app.get('/success', (req, res, next) => {
    res.send('Logged in. Subsequent requests will be authenticated and authorized as appropriate.')
})
app.get('/failure', (req, res, next) => {
    console.log(req.body)
    res.send('You failed to login.')
})

app.post("/login", passport.authenticate('local', {
    successReturnToOrRedirect: '/success',
    failureRedirect: '/failure',
    failureMessage: true
})
);

app.post('/logout', async (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout();
        res.redirect('/')
    } else {
        const error = new Error('User was not logged in')
        error.status = 400
        return next(error)
    }
})

app.get('/', (req, res, next) => {
    res.json({ message: 'Nothing here. Try other endpoints' })
})

app.get('/pics/:id', async (req, res, next) => {
    if (req.isAuthenticated()) {
        let recentPics = cache.get('recentPics') || []
        let pic = recentPics.find((p) => {
            return p.id == Number(req.params.id)
        })
        if (pic){
            console.log('serving from cache')
            res.status(200).json(pic)
            return;
        }
        try {
            console.log('serving from db')
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
            recentPics.push(pic)
            if (recentPics.length > maxPicsCached) {
                recentPics.shift(); // Remove the oldest picture if cache size exceeds limit
            }
            cache.set('recentPics', recentPics)
            console.log('Picture added to cache')
            res.status(200).json(pic)
        } catch (error) {
            return next(error)
        }
    }
    else {
        const error = new Error('User was not logged in')
        error.status = 400
        return next(error)
    }
})
app.get('/pics', async (req, res, next) => {
    if (req.isAuthenticated()) {
        try {
            const result = await transaction(async (t) => {
                const pics = await Pics.findAll({
                    transaction: t
                })
                return pics;
            })
            console.log('Pics found')
            res.status(200).json({ pics: result })
        } catch (error) {
            console.log('Transaction failed ', error)
            return next(error)
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }


})
app.post('/caption', async (req, res, next) => {
    if (req.isAuthenticated()) {
        console.log(req.body)
        if (req.body.pic_id && req.body.caption) {
            try {
                const result = await transaction(async (t) => {
                    const caption = await Captions.create({
                        pic_id: req.body.pic_id,
                        caption: req.body.caption,
                        user_id: req.user.id
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
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }

})

app.use((err, req, res, next) => {
    const status = err.status || 500
    res.status(status).send(err.message)
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
}) 