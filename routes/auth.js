const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');

router.get('/login',function(request,response){
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title,list,`
    <form actiond="/auth/login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="text" name="pwd" placeholder="password"></p>
        <p>
            <input type="submit" value="login"></input>
        </p>
    </form>
    `);
    
    response.send(html);
})

module.exports = router;












