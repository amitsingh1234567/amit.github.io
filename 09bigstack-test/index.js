const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Bring all routes
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const question = require('./routes/api/question');


const app = express();

//Middleware for body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


port = process.env.PORT || 3000;

//Beringing mongoDB
 const db = require('./setup/myurl').mongoURL;
 mongoose.connect(db)
 .then( () => console.log('MongoDB connected Successfully... '))
 .catch( err => console.log(err));

//Test router
app.get('/', (req,res) => {
    res.send('Hi i m from Node');
});

app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/question', question);



app.listen(port, () => console.log(`Server running on port ${port}`));

