const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const topic = require('../lib/topic');

// router.get('/login',function(request,response){
//     var title = 'WEB - login';
//     var list = template.list(request.list);
//     var html = template.HTML(title,list,`
//     <form action="/auth/login_process" method="post">
//         <p><input type="text" name="email" placeholder="email"></p>
//         <p><input type="text" name="pwd" placeholder="password"></p>
//         <p>
//             <input type="submit" value="login"></input>
//         </p>
//     </form>
//     `);
    
//     response.send(html);
// })

router.get('/login',(req,res)=>{
    topic.logIn(req,res);
    console.log('success !')
})

router.post('/login_process',(req,res)=>{
    topic.login_process(req,res);
})

module.exports = router;












