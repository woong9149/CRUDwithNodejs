const express = require('express')
const app =express()
var db = require('./lib/db');
const url = require('url')
const topic = require('./lib/topic');
const author = require('./lib/author');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic');
const authRouter = require('./routes/auth');
const helmet = require('helmet');
const cookie = require('cookie');
const session = require('express-session');
const FIleStore = require('session-file-store')(session)

// app.use(session({
//     secret: 'keyboard cat',
//     resave: false,
//     saveUninitialized: true,
//     store: new FIleStore()
// }))

app.use(helmet());

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());//compression()을 호출하면 미들웨어를 리턴한다.

function authIsOwner(request,response){
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
        // cookies.email = cookie.parse(request.body.email);
        // cookies.password = cookie.parse(request.body.password);
    }
    if(cookies.email === 'egoing777@gmail.com' && cookies.password ==='111111'){
        isOwner = true;
    }
    return isOwner;
}

app.get('*',function(request,response,next){
    // var isOwner = authIsOwner(request,response);
    // console.log('isOwner: ',isOwner);
  db.query('SELECT * FROM topic',function(error,topics){
      if(error){
          throw error;
      }
      request.list = topics;
    //   request.isOwner = isOwner;
      next();
  })
})


// app.post('*',function(request,response,next){
//     var isOwner = authIsOwner(request,response);
//     request.isOwner = isOwner;
//     next();
// });

app.use('/topic',topicRouter);
// app.use('/auth',authRouter);

app.get('/',(req,res) => {
    var _url = req.url;
    var queryData = url.parse(_url,true).query;
    topic.home(req,res);
})

app.get('/auth/login',(req,res)=>{
    topic.logIn(req,res);
    console.log('success !')
})

app.post('/auth/login_process',(req,res)=>{
    console.log('req: ',req);
    topic.login_process(req,res);
})

app.get('/logout_process',(req,res) => {
    topic.logout_process(req,res);
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

app.post('/authorDel_process', (req,res)=>{
    author.delete_process(req,res);
})

app.use(function(req,res,next){
    res.status(404).send('Sorry cant find that!');
})

app.use(function(err,req,res,next){
    console.log(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(3000, ()=> console.log('Example app listening on port 3000!'))

