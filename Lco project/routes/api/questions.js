const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const router = express.Router();

//Load Person Model
const Person = require('../../models/Person');
//Load Profile Model
const Profile = require('../../models/Profile');
//Load Question Model
const Question = require('../../models/Question');
//Load LinuxQuestion Model
const LinuxQuestion = require('../../models/Linusquestion');


//@type     GET    
//@route    /api/questions
//@dec      route for showing all questions
//@access   PUBLIC
router.get('/', (req, res) => {
    Question.find()
    .then(questions => res.status(200).json(questions))
    .catch(err => res.json({noquestion: 'No question to display'}))
})

//@type     POST    
//@route    /api/questions/
//@dec      route for submitting question
//@access   PRIVATE
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    const newQuestion = new Question({
     user: req.user.id,
     textone: req.body.textone,
     texttwo: req.body.texttwo,
     name: req.body.name
    })   
    
    newQuestion.save()
    .then(question => res.status(200).json(question))
    .catch(err => console.log('Unable to save question in dataBase ' + err))

})

//@type     POST    
//@route    /api/questions/answre/:id
//@dec      route for showing answer
//@access   PRIVATE

router.post('/answer/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

    Question.findById(req.params.id)
    .then(question => {
        const newAnswer = {
            user: req.user.id,
            text: req.body.text,
            name: req.body.name
        };
        question.answers.push(newAnswer);
        question.save().then(question => res.status(200).json(question)).catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

//@type     POST    
//@route    /api/questions/upvote/:id
//@dec      route for showing answer
//@access   PRIVATE
router.post('/upvote/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    Profile.findOne({user: req.user.id})
        .then(profile => {
        Question.findById(req.params.id)
        .then(question => {
            if(question.upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0) {
                return res.status(400).json({noupvote: 'User already upvoted'})
            }
            question.upvotes.push({user: req.user.id});
            question.save()
            .then(question => res.json(question))
            .catch(err => console.log(err))

        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})


//@type     POST    
//@route    /api/questions/linuxquestion
//@dec      route for submiting linuxQuestion
//@access   PRIVATE
router.post('/linuxquestion', passport.authenticate('jwt', {session: false}), (req, res) => {

        const newlinuxquestion = new LinuxQuestion({
                user:        req.user.id,
                description: req.body.description,
                code:        req.body.code,
                error:       req.body.error
        })

        newlinuxquestion.save()
        .then(linuxquestion => res.status(200).json(linuxquestion))
        .catch(err => console.log(err))
})

router.post('/user-love-question/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

       LinuxQuestion.findById(req.params.id)
       .then(question => {
          const newQuestion = {
              user: req.user.id,
              awsome: req.body.awsome,
              verygood: req.body.verygood,
              good: req.body.good,
              bad: req.body.bad,
              verybad: req.body.verybad,
          };
          question.love.push(newQuestion);
          question.save()
          .then(question => res.status(201).json(question))
          .catch(err => console.log(err))            
       })
       .catch(err => console.log(err))
           
})

router.post('/enquiry-feedback-question/:id', passport.authenticate('jwt', {session: false}), (req, res) => {

        LinuxQuestion.findById(req.params.id)
        .then(question => {
            
          const feedback = question.love.filter(item => item.user.toString() === req.body.id.toString())
          res.json(feedback);
          
        })
        .catch(err => console.log(err))
})

module.exports = router;