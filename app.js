var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var app = express();

const route = require('./routes/route');
const usersRouter = require('./routes/users');

mongoose.connect('mongodb+srv://user:user@cluster0.z6kdb.mongodb.net/contactlist?retryWrites=true&w=majority');
mongoose.connection.on('connected', () => {
    console.log('Connected to database mongodb');
});
mongoose.connection.on('error', (err) => {
    if (err) {
        console.log(err);
    }
});

app.use(express.static(path.join(__dirname, 'public')));

const MongoStore = require('connect-mongo')(session);
app.use(session({
  name:'myname.sid',
  resave:false,
  saveUninitialized:false,
  secret:'secret',
  cookie:{
    maxAge:36000000,
    httpOnly:false,
    secure:false
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
require('./passport-config');

app.use('/api', route);
app.use('/users', usersRouter);

app.use(cors({
    credentials: true
}));

app.use(bodyparser.json());


const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
    res.send('test');
})

app.listen(port, () => {
    console.log('Server started at port: ' + port);
})
