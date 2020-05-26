import passport from "passport/lib";
import {User} from "../db/init";
import {Strategy as LocalStrategy} from "passport-local/lib";
import path from "path";
import {createUser} from "../db/util";
import session from "express-session";
import crypto from "crypto"

export let auth = (app) => {

    app.use(session({
        secret: 'vidyapathaisalwaysrunning',
        resave: true,
        saveUninitialized: true
    })); // session secret
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({where: {username: username}}).then(user => {
                if (!user) {
                    return done(null, false, {message: 'Incorrect username.'});
                }
                if (encryptPassword(password, user.salt()) !== user.password()) {
                    return done(null, false, {message: 'Incorrect password.'});
                }
                done(null, user);
            });
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({where: {id: id}}).then(user => done(null, user));
    });

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (info) {
                res.json({message: {type: "danger", text: info.message}});
                return;
            }
            req.login(user, (err) => {
                res.json({message: {type: "success", text: "Successfully Logged In"}});
            })
        })(req, res, next);
    });

    // app.post('/login',
    //     passport.authenticate('local', function (err, user, info) {
    //         failureRedirect: '/auth', successRedirect
    //     :
    //         "/checkers", failureFlash
    //     :
    //         true
    //     }),
    //     (req, res) => {
    //     }
    // );

    app.post('/register', async (req, res) => {
        if (!(req.body.username && req.body.password)) {
            res.json({message: {type: 'error', text: 'missing credentials'}});
            return;
        }
        try {
            let createdUser = await createUser(req.body.username, req.body.password);
            res.json({message: {type: 'success', text: 'user was created'}});
        } catch (err) {
            res.json({message: {type: 'danger', text: 'user with such username already exists'}});
        }
    });
};

// export const isAuthenticated = (req, res, next) => {
//     if (req.isAuthenticated()) {
//         next()
//     } else {
//         res.status(401);
//     }
// };

export const generateSalt = () => {
    return crypto.randomBytes(16).toString('base64')
};

export const encryptPassword = (plainText, salt) => {
    return crypto
        .createHash('RSA-SHA256')
        .update(plainText)
        .update(salt)
        .digest('hex')
};



