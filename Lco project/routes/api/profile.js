const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

//Load Person Model
const Person = require('../../models/Person');

//Load Profile Model
const Profile = require('../../models/Profile');

//@type     GET    
//@route    /api/profile/
//@dec      route for personal user profile
//@access   PRIVATE
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
        Profile.findOne({user:req.user.id})
            .then(profile => {
                if(!profile){
                   return res.status(404).json({profilenotfound: 'No profile found'})
                }
                res.json(profile);
            })
            .catch(err => console.log('got some error in profile ' + err))
})


//@type     POST    
//@route    /api/profile/
//@dec      route for UPDATING/SAVING personal user profile
//@access   PRIVATE
router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
                                   
                const profileValue = {};
                profileValue.user = req.user.id;
                if(req.body.username) profileValue.username = req.body.username;
                if(req.body.website) profileValue.website = req.body.website;
                if(req.body.country) profileValue.country = req.body.country;
                if(req.body.portfolio) profileValue.portfolio = req.body.portfolio;
                if(typeof req.body.languages !== undefined){
                    profileValue.languages = req.body.languages.split(',');
                }
                profileValue.social = {};
                if(req.body.youtube) profileValue.social.youtube = req.body.youtube;
                if(req.body.facebook) profileValue.social.facebook = req.body.facebook;
                if(req.body.instagram) profileValue.social.instagram = req.body.instagram;
              
                Profile.findOne({user:req.user.id})
                    .then(profile => {
                        if(profile){
                            Profile.findOneAndUpdate({user:req.user.id}, {$set:profileValue},{new:true})
                            .then(profile => res.json(profile))
                            .catch(err => console.log('Problem in updating profile ' + err))
                        }else{
                            Profile.findOne({username: profileValue.username})
                            .then(profile => {
                                //Username allready exists
                                if(profile){
                                   return res.status(400).json({username:'Username already exists'})
                                }
                                //Save user
                               new Profile(profileValue).save() 
                                .then(profile => {                 
                                     res.status(200).json(profile)
                                    })
                                .catch(err => console.log('got error in saving profile ' + err))
                            })
                            .catch(err => console.log('Problem in finding username ' + err))
                        }
                    })
                    .catch(err => console.log('Problem in fetching profile ' + err))

})


//@type     GET    
//@route    /api/profile/:username
//@dec      route for getting user profile based on USERNAME 
//@access   PUBLIC
router.get('/:username', (req, res) => {
    Profile.findOne({username:req.params.username})
        .populate('user', ['name', 'profilepic', 'email'])
        .then(profile => {
            if(!profile){
               return res.status(404).json({usernotfound: 'User not found'})
            }
         res.json(profile)   
        })
        .catch(err => console.log('Error in fatching username ' + err))
})

//@type     GET    
//@route    /api/profile/find/everyone
//@dec      route for getting user profile based on EVERYONE
//@access   PUBLIC
router.get('/find/everyone', (req, res) => {
    Profile.find()
        .populate('user', ['name', 'profilepic', 'email'])
        .then(profiles => {
            if(!profiles){
               return res.status(404).json({usernotfound: 'No profile found'})
            }
         res.json(profiles)   
        })
        .catch(err => console.log('Error in fatching username ' + err))
})

//@type     DELETE    
//@route    /api/profile
//@dec      route for deleting user based on ID
//@access   PRIVATE
router.delete('/', passport.authenticate('jwt', {session:false}), (req, res) => {
           
     Profile.findOneAndRemove({_id:req.user.id})
        .then(() => {
            Person.findOneAndRemove({_id: req.user.id})
            .then(() => res.status(200).json({message: 'Profile deleted successfully'}))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

//@type     POST   
//@route    /api/profile/workrole
//@dec      route for adding work profile for a person
//@access   PRIVATE
router.post('/workrole', passport.authenticate('jwt', {session:false}), (req, res) => {

        Profile.findOne({user: req.user.id})
            .then(profile => {
                 if(!profile){
                     return res.json({message: 'Profile not found'})
                 }

               const workRoleValue = {
                     role:    req.body.role,
                     company: req.body.company,
                     country: req.body.country,
                     from:    req.body.from,
                     to:      req.body.to,
                     current: req.body.current,
                     details: req.body.details
               };
               profile.workrole.push(workRoleValue);
               res.json(profile)
            

            //    profile.save()
            //         .then(profile => res.json(profile))
            //         .catch(err => console.log(err))
            // })
           
        }) .catch(err => console.log(err))        
})

//@type     DELETE   
//@route    /api/profile/w_id
//@dec      route for deleting specific workrole
//@access   PRIVATE
router.delete('/workrole/:w_id', passport.authenticate('jwt', {session:false}), (req, res) => {

      const Id = req.params.w_id;    
      Profile.findOne({user: req.user.id})
            .then(profile => {
            //    const remove =  profile.workrole.map(item => item.id ).indexOf(req.params.w_id);  

            profile.workrole.pull(Id)
            profile.save()
            .then(profile => res.status(200).json(profile))
            .catch(err => console.log(err))
            })
            .catch(err => console.log(err))  
})


module.exports = router;