const express = require('express')
const app =express()
const url = require('url')
const topic = require('./lib/topic');
const author = require('./lib/author');



app.get('/',(req,res) => {
    var _url = req.url;
    var queryData = url.parse(_url,true).query;
    if(queryData.id === undefined){
        topic.home(req,res);
    }else{
        topic.page(req,res);
    }
 
})

app.get('/page/:pageId/:chapterId',(req,res)=>{
    res.send(req.params);
})
app.listen(3000, ()=> console.log('Example app listening on port 3000!'))

/*
var http = require('http');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var db = require('./lib/db');
var topic = require('./lib/topic');
var author = require('./lib/author');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
  
    if(pathname === '/'){
        if(queryData.id === undefined){
            topic.home(request,response);
        }else{
            topic.page(request,response);
        }
    }else if(pathname === '/create'){
        topic.create(request,response);
    }else if(pathname === '/create_process'){
        topic.create_process(request,response);
    }else if(pathname === '/update'){
        topic.update(request,response);
    }else if(pathname === '/update_process'){
        topic.update_process(request,response);
    }else if(pathname === '/delete_process'){
        topic.delete_process(request,response);
    }else if(pathname === '/authorTable'){
        author.home(request,response);
    }else if(pathname === '/author_create_process'){
        author.create_process(request,response);
    }else if(pathname === '/author_update'){
        author.update(request,response);
    }else if(pathname === '/author_update_process'){
        author.update_process(request,response);
    }else if(pathname === '/authorDel_process'){
        author.delete_process(request,response);
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);

*/