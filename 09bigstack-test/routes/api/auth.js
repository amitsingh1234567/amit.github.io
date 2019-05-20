const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonwt = require('jsonwebtoken');
const passport = require('passport');
const key = require('../../setup/myurl');


const router = express.Router();

// @type = GET
// @route = api/auth
// @desc = just for testing
// @access = PUBLIC

router.get('/', (req, res) => res.json({item:'Auth Successfully....'}));

//Import schema for person register 
const Person = require('../../models/person');

// @type = GET
// @route = api/auth
// @desc = just for testing
// @access = PUBLIC
router.post('/register', (req, res) => {
    Person.findOne({email: req.body.email})
    .then( person => {
        if(person){
            return res.status(404).json({message: 'Email is already registred'});

        }else{
            const Personobj = new Person({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password
            });
            //Encrypt password using bcrypt   
            bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(Personobj.password, salt, (err, hash) => {
              if(err) throw err;
              Personobj.password = hash;
    });          
});
            Personobj.save()
             .then( person => res.json(person))
             .catch( err => console.log(err));

        }

    })

    .catch( err => console.log(err));


});





module.exports = router;