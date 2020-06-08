const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const topic = require('../lib/topic');
const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

router.get('/login',(req,res)=>{
    topic.logIn(req,res);
    console.log('success !')
})

// router.post('/login_process',(req,res)=>{
//     console.log('req: ',req);
//     topic.login_process(req,res);
// })
router.post('/login_process',passport.authenticate('local',{
    successRedirect :'/',
    falureRedirect: '/auth/login'
}))

router.get('/logout_process',(req,res)=>{
    console.log('req: ',req);
    topic.logout_process(req,res);
})

module.exports = router;












