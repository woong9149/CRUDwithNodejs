const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/',(req,res)=>{
    res.render('home',{});
})

module.exports = router;

/*
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const topic = require('../lib/topic');
const passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

var authData = {
    email: 'egoing777@gmail.com',
    password: '111111',
    nickname: 'egoing'
}

// router.use(passport.initialize());
// router.use(passport.session());

passport.serializeUser(function(user,done){
    console.log('serialize : ',user);
    done(null,user.email);
})

passport.deserializeUser(function(id,done){
    console.log('deserializeUser : ',id);
    done(null,authData);
})

passport.use(new LocalStrategy(
    {
        usernameField : 'email',
        passwordField : 'password'
    },function(username,password,done){
        console.log('LocalStrategy',username,password);
        if(username === authData.email){
            console.log(1);
            if(password ===authData.password){
                console.log(2);
                done(null,authData);
            }else{
                console.log(3);
                done(null,false,{
                    message: 'Incorrect password.'
                })
            }
        }else{
            console.log(4);
            return done(null,false,{
                message: 'Incorrect username'
            })
        }

    }))

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
    failureRedirect: '/auth/login'
}))

router.get('/logout_process',(req,res)=>{
    console.log('req: ',req);
    topic.logout_process(req,res);
})

module.exports = router;

*/










