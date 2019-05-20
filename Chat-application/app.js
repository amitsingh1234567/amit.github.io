const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session'); 
const passport = require('passport');
var io = require('socket.io').listen();
users = [];
connections = [];

const app = express();

//Passport config
require('./config/passport')(passport);

//DB Config
const db=require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db,{ useNewUrlParser:true })
.then(()=>console.log('MongoDB Connected...'))
.catch(err =>console.log(err));

//EJS
app.use(expressLayouts);
app.set("view engine",'ejs');

//BodyParser
app.use(express.urlencoded({extended:false}));

// Express Session
app.use(session({
   secret:'secret',
   resave:true,
   saveUninitialized:true,
}));

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

const port = process.env.PORT || 3000;

// Global Variables
app.use( (req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
});

//Routers
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


var ser = app.listen(port, ()=>{
    console.log(`Server Running on port ${port}`);
});

io.attach(ser);
io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected', connections.length);

    //Disconnect
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected ', connections.length);
    });

    //Send Message
    socket.on('send message', (data) =>{
        io.sockets.emit('new message', {msg:data, user: socket.username});
    });

    //New User
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });
   
    function updateUsernames(){
        io.sockets.emit('get users', users);
    }
});