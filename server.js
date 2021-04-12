const env = require('./server/config/env');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const RateLimit = require('express-rate-limit');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const sql = require('mssql');
const helmet = require('helmet');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

const config = require('./server/config/config');
const api = require('./server/routes/api.routes');
const errorHandler = require('./server/error-handler');
const Helper = require('./server/helper');
const helper = new Helper();

const app = express();

// limit apis to 1000 requests per minute per ip
const apiLimiter = new RateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1000
});

// limit file system access requests to 10000 requests per minute per ip
const fileSystemLimiter = new RateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10000
});

//*****************************************************
// Passport (passport and passport-local)
//*****************************************************
passport.use(new LocalStrategy(
    { usernameField: 'username' },
    (username, password, done) => {
        const params = [
            { name: 'StatementType', type: sql.Int, value: 1 },
            { name: 'Username', type: sql.NVarChar, value: username }
        ];

        helper.exec('sp_Users', params, (err, user) => {
            done(null, helper.processResults(user.recordset[0]));
        });
    }
));

passport.serializeUser((user, done) => {
    done(null, { UserId: user.UserId, RoleId: user.RoleId });
});

passport.deserializeUser((user, done) => {
    const params = [
        { name: 'StatementType', type: sql.Int, value: 1 },
        { name: 'UserId', type: sql.NVarChar, value: user.UserId }
    ];

    helper.exec('sp_Users', params, (err, user) => {
        let u = null;

        if(user) {
            u = helper.processResults(user.recordset[0]);
        }
        
        done(err, u);
    });
});

//*****************************************************
//Parsers (body-parser)
//*****************************************************
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "connect-src": ["'self'", "*"],
            "default-src": ["'self'"],
            "font-src": ["'self'", "data:", "https://stackpath.bootstrapcdn.com"],
            "img-src": ["'self'", "data:"],
            "frame-src": ["'self'"],
            "frame-ancestors": ["'self'"],
            "script-src": ["'self'", "https://code.jquery.com", "https://cdnjs.cloudflare.com", "https://stackpath.bootstrapcdn.com"],
            "style-src": ["'self'", "https://stackpath.bootstrapcdn.com", "'unsafe-inline'"],
            "worker-src": ["'self'", "blob:"]
        }
    },
    frameguard: {
        action: "deny"
    }
}));

//*****************************************************
//Session (session)
//*****************************************************
const sessionTimeout = 86400; // 1800 seconds = 30 minutes, 5400seconds = 90 minutes, 86400 seconds = 24 hours

app.use(session({
    name: 'sessionId',
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false, // require HTTPS connection in prod
        sameSite: true, // blocks CORS requests on cookies
        maxAge: sessionTimeout * 1000
    },
    store: new FileStore({
        ttl: sessionTimeout
    }),
    secret: config.appSecret,
    resave: true,
    rolling: true,
    saveUninitialized: true
}));

app.use(csrf(), (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken(), {
        path: '/',
        secure: false, // require HTTPS connection in prod
        sameSite: true // block CORS requests
    });
    next();
});

//*****************************************************
// Static files
//*****************************************************
app.use(express.static(path.join(__dirname, 'dist/prevent22')));

//*****************************************************
// Setup passport sessions
//*****************************************************
app.use(passport.initialize());
app.use(passport.session());

//*****************************************************
// API Endpoints
//*****************************************************
app.use('/api', apiLimiter, api);
app.use(errorHandler);

//*****************************************************
//send all other request to the Angular App
//*****************************************************
app.all('*', fileSystemLimiter, (req, res) => {
   res.sendFile(path.join(__dirname, 'dist/prevent22/index.html'));
});

//Set port
const port = process.env.PORT || '8081';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on port ${port}`));

module.exports = app;
