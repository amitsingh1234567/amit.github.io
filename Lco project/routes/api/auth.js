const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const myKey = require('../../setup/Mykey');
const passport = require('passport')
const router = express.Router();


//Import Schema for person registration
const Person = require('../../models/Person');

//@type     POST    
//@route    /api/auth/registration
//@dec      route for reistration all users
//@access   PUBLIC
router.post('/registration', (req, res) => {

    Person.findOne({email:req.body.email})
        .then(person => {
            if(person){
                 res.status(400).json({Emailerror: 'Email is allready registered in our system'})
            }
            else{
                const newPerson = new Person({
                      name:req.body.name,
                      email:req.body.email,
                      password:req.body.password,
                })
                bcrypt.genSalt(10, (err, salt) => {
                    if(err) throw err;
                    bcrypt.hash(newPerson.password, salt, (err, hash) => {
                        if(err) throw err;
                        newPerson.password = hash;
                        newPerson.save()
                        .then(person => res.json(person))
                        .catch(err => console.log(err)) 
                    });
                });  
            }
        })
        .catch(err => console.log(err)) 
})


//@type     POST    
//@route    /api/auth/login
//@dec      route for login all users
//@access   PUBLIC
router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    
    Person.findOne({email})
        .then(person => {
            if(!person){
               return res.status(404).json({Emailerror: 'User not found with this email'})
            }
            else{
                bcrypt.compare(password, person.password)
                .then((isCorrect) => {
                    if(!isCorrect){
                       return res.status(404).json({Password_Error: 'Password Incorrect'})
                    }
                    else{
                        // res.json({msg: 'User is able to login'})
                        //Use payload and create token for user
                        const payload = {
                            id:person.id,
                            name:person.name,
                            email:person.email
                        }
                        jwt.sign(
                           payload,
                           myKey.secret,
                         { expiresIn: '12h' },
                         (err, token) =>{
                            if(err) throw err;                          
                               return res.json({ seccess:true, token: 'Bearer ' + token });                            
                         })
                    }
                })
                .catch(err => console.log(err)) 
            }
        })
        .catch(err => console.log(err))

})

//@type     GET   
//@route    /api/auth/profile
//@dec      route for profile
//@access   PRIVATE
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res) =>{

            res.json({
                    id:req.user.id,
                    name: req.user.name,
                    email: req.user.email,
                    profilepic: req.user.profilepic
                    });
})

module.exports = router;