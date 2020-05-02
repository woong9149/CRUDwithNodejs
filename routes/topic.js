var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var sanitizeHtml = require('sanitize-html');
var template = require('../lib/template.js');
const topic = require('../lib/topic');

router.get('/create',(req,res)=>{
    topic.create(req,res);
})

router.post('/create_process',(req,res)=>{
    topic.create_process(req,res);
})

router.get('/update/:updateId',(req,res)=>{
    topic.update(req,res);
})

router.post('/update_process',(req,res)=>{
    topic.update_process(req,res);
})

router.post('/delete_process',(req,res)=>{
    topic.delete_process(req,res);
})

router.get('/:pageId',(req,res,next)=>{
    try {
        topic.page(req,res);    
    } catch (e) {
        console.log('catch~~');
        next(e);
    }
})

module.exports = router;




