const express = require('express')
const app =express()
var db = require('./lib/db');
const url = require('url')
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic');
const helmet = require('helmet');
app.use(helmet());

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

app.use('/topic',topicRouter);

app.get('/',(req,res) => {
    var _url = req.url;
    var queryData = url.parse(_url,true).query;
    topic.home(req,res);
})

app.get('/login',(req,res) => {
    // var _url = req.url;
    // var queryData = url.parse(_url,true).query;
    topic.logIn(req,res);
})

app.post('/login_process',(req,res) => {
    // var _url = req.url;
    // var queryData = url.parse(_url,true).query;
    topic.login_process(req,res);
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

app.use(function(req,res,next){
    res.status(404).send('Sorry cant find that!');
})

app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, ()=> console.log('Example app listening on port 3000!'))

