const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const passport = require('passport');
const app = express();
const db = 'mongodb+srv://amit-singh_1:9576435668@cluster0-49vnb.mongodb.net/test?retryWrites=true'
//Bring All Routs
const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const questions = require('./routes/api/questions');

//Config of body-parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false})
        .then(() => console.log('MongoDb Connected Successfully...'))
        .catch(err => console.log(err))

//Passport MiddleWare
app.use(passport.initialize());
//Config of JWT strategy
require('./strategies/jwtStrategies')(passport);


//just for testing -> route
app.get('/', (req, res) => {
    res.json('Hey there Big stack');
})

//Actual route
app.use('/api/auth', auth)
app.use('/api/profile', profile)
app.use('/api/questions', questions)

//******************************************************************************************* */
/*
const company = [
        
    {companyname:'company1', category:'Technology', start:1996, end:2011},
    
    {companyname:'company2', category:'Auto', start:1996, end:2011},
    
    {companyname:'company3', category:'Hunda', start:1997, end:2012},
    
    {companyname:'company4', category:'Tvs', start:1998, end:2013},
    
    {companyname:'company5', category:'Mobile', start:1999, end:2015},
    
    {companyname:'company6', category:'Merceadies', start:2000, end:2016}

]

// const ages = [33, 12, 20, 16, 5, 54, 21, 44, 61, 13, 15, 45, 25, 64, 32];

// const canDrink = [];
// // console.log(ages.length);
// for(let i=0; i<ages.length; i++){
// if(ages[i] >= 21){
//     canDrink.push(ages[i]);
// }
// }

// const canDrink = ages.filter(age => {
//     console.log(age)
//     if(age >=21){
//        return true
//     }
// })

// const canDrink = ages.filter(age => age >=21)

// console.log(canDrink)

const retailCOmpany = company.filter(company  => {

   var x =  company.start === 1996
   console.log(x.length)
    return true
}  )

console.log(retailCOmpany)
//******************************************************************************************* */




const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is running at ${port}`));