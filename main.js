const express = require('express')
const app =express()
var db = require('./lib/db');
const url = require('url')
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser');
const compression = require('compression');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());//compression()을 호출하면 미들웨어를 리턴한다.

app.get('*',function(request,response,next){
  db.query('SELECT * FROM topic',function(error,topics){
      if(error){
          throw error;
      }
      request.list = topics;
      next();
  })
})

app.get('/',(req,res) => {
    var _url = req.url;
    var queryData = url.parse(_url,true).query;
    topic.home(req,res);
    })

app.get('/page/:pageId',(req,res)=>{
    topic.page(req,res);
})

app.get('/create',(req,res)=>{
    topic.create(req,res);
})

app.post('/create_process',(req,res)=>{
    topic.create_process(req,res);
})

app.get('/update/:updateId',(req,res)=>{
    topic.update(req,res);
})

app.post('/update_process',(req,res)=>{
    topic.update_process(req,res);
})

app.post('/delete_process',(req,res)=>{
    topic.delete_process(req,res);
})

app.get('/authorTable',(req,res)=>{
    author.home(req,res);
})

app.post('/author_create_process',(req,res)=>{
    author.create_process(req,res);
})

app.get('/author_update/:author_updateId',(req,res)=>{
    author.update(req,res);
})

app.post('/author_update_process', (req,res)=>{
    author.update_process(req,res);
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