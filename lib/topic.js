var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var path = require('path');
var cookie = require('cookie');

var authStatusUI=(request,response)=>{
    //  var isOwner = authIsOwner(request,response);
    var authStatusUI = '<a href="/auth/login">login</a>';
    if(authIsOwner(request,response)){
        authStatusUI = `${request.session.nickname} | <a href="/auth/logout_process">logout</a>`;
    }
    return authStatusUI;
}


function authIsOwner(request,response){
    var isOwner = false;
    var cookies = {};
    if(request.headers.cookie){
        cookies = cookie.parse(request.headers.cookie);
    }
    if(cookies.email === 'egoing777@gmail.com' && cookies.password ==='111111'){
        isOwner = true;
    }
    return isOwner;
}

exports.home = function(request,response){
    // var isOwner = authIsOwner(request,response);
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(request.list);
        var html = template.HTML(title,list,`<h2>${title}</h2>${description}
            <img src="/images/machintoshi.jpg" style="width:300px; display:block; margin-top:10px;">`, `<a href="/topic/create">create</a> <a href="/authorTable">authors</a>`,
            authStatusUI(request,response)
            );
        response.writeHead(200,{'Content-Type':'text/html'});
        response.end(html);
}

exports.page = function(request,response){
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[request.params.pageId],function(error2,topic){
            if(error2){
                console.log('throw~~: ',error2);
                throw error2;
            }else{
                console.log('throw2~~: ',error2);
                var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(request.list);
                var html = template.HTML(title,list,
                    `<h2>${sanitizeHtml(title)}</h2>
                    ${sanitizeHtml(description)}
                    <p>by ${sanitizeHtml(topic[0].name)}</p>`, 
                    `<a href="/topic/create">create</a> <a href="/topic/update/${request.params.pageId}">update</a> 
                    <form action="/topic/delete_process" method="post">
                        <input type="hidden" name="id" value="${request.params.pageId}">
                        <input type="submit" value="delete">
                    </form>`,
                    authStatusUI(request,response));
                // response.writeHead(200);
                response.send(html);
            }
           
            
        })
}

exports.create = function(request, response){
        if(!request.isOwner){
            response.send('Login required!! <a href="/auth/login">Go Login</a>');
            return false;
        }
        db.query(`SELECT * FROM author`,function(error2,authors){
            var title = 'Create';
            var list = template.list(request.list);
            var html = template.HTML(sanitizeHtml(title),list,`
            <form action="/topic/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                        ${template.authorSelect(authors)}
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, `<a href="/topic/create">create</a>`,
            authStatusUI(request,response));
            response.writeHead(200,{'Content-Type':'text/html'});
            response.end(html);
        })
}

exports.create_process = function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    var author = post.author;
    db.query(`INSERT INTO topic(title,description, created,author_id) VALUES(?,?,NOW(),?)`,[title,description,author],function(error,result){
        if(error){
            throw error;
        }
        response.writeHead(302,{Location: `/?id=${result.insertId}`});
        response.end();
    
    });
}

exports.update = function (request, response){
    if(!request.isOwner){
        response.send('Login required!! <a href="/auth/login">Go Login</a>');
        console.log('request: ',request);
        return false;
    }
    
    var _url = request.url;
    db.query(`SELECT * FROM topic WHERE id =?`,[request.params.updateId],function(error2,topic){
        db.query(`SELECT * FROM author`,function(error2,authors){
            db.query(`SELECT B.name FROM topic A LEFT JOIN author B ON A.author_id=B.id WHERE A.id=?`,[request.params.updateId],function(error3,authorIsOwner){
                var name = authorIsOwner;
                console.log('authorIsOwner: ',authorIsOwner[0].name);
                if(request.headers.cookie.nickname != authorIsOwner[0].name){
                    var title = topic[0].title;
                var description = topic[0].description;
                var list = template.list(request.list);
                var html = template.HTML(title,list,
                    `<h2>${sanitizeHtml(title)}</h2>
                    ${sanitizeHtml(description)}
                    <p>by ${sanitizeHtml(topic[0].name)}</p>`, 
                    `<a href="/topic/create">create</a> <a href="/topic/update/${request.params.pageId}">update</a> 
                    <form action="/topic/delete_process" method="post">
                        <input type="hidden" name="id" value="${request.params.pageId}">
                        <input type="submit" value="delete">
                    </form>
                    <p style="color:red">본인이 작성한 글이 아닙니다.</p>`,
                    authStatusUI(request,response));
                // response.writeHead(200);
                response.send(html);
                }else{
                    var id = topic[0].id;
                    var title = topic[0].title;
                    var list = template.list(request.list);
                    var html = template.HTML(sanitizeHtml(title),list,`
                    <form action="/topic/update_process" method="post">
                        <input type="hidden" name="id" value="${id}">
                        <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(title)}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${sanitizeHtml(topic[0].description)}</textarea>
                        </p>
                        <p>
                                ${template.authorSelect(authors,topic[0].author_id)}
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `, `<a href="/topic/create">create</a> <a href="/topic/update/${id}">update</a>`,
                    authStatusUI(request,response));
                    response.writeHead(200,{'Content-Type':'text/html'});
                    response.end(html);
                }
            })
        
        })
    })
}

exports.update_process = function(request,response){
            var post = request.body;
            var id = post.id;
            var title = post.title;
            var description = post.description;
            var author = post.author;
            db.query(`UPDATE topic set title=?,description=?,author_id=? WHERE id=?`,[title,description,author,id],function(error,result){
                response.writeHead(302,{Location:`/?id=${post.id}`});
                response.end('success');
            })
}

exports.delete_process = function(request, response){
    if(!request.isOwner){
        response.send('Login required!! <a href="/auth/login">Go Login</a>');
        return false;
    }
        var post = request.body;
        var id = post.id;
        console.log('id2: ',id);
        db.query(`SELECT * FROM topic WHERE id =?`,[id],function(error2,topic){
            db.query(`SELECT * FROM author`,function(error2,authors){
                db.query(`SELECT B.name FROM topic A LEFT JOIN author B ON A.author_id=B.id WHERE A.id=?`,[id],function(error3,authorIsOwner){
                    var name = authorIsOwner;
                    console.log('authorIsOwner: ',authorIsOwner[0].name);
                    if(request.headers.cookie.nickname != authorIsOwner[0].name){
                        response.send('본인이 작성한 글이 아닙니다 !');
                    }else{
                        db.query(`DELETE FROM topic WHERE id =?`,[id],function(error,result){
                            if(error){
                                throw error;
                            }
                            response.writeHead(302,{Location:'/'});
                            response.end('');
                        })
                    }
                })
            })
        })
}

exports.logIn = function(request,response){
        
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title,list,`
        <form action="/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p><input type="submit"></p>
        </form>

       `, `<a href="/create">create</a> <a href="/authorTable">authors</a>`,
       authStatusUI(request,response)
        );
    response.writeHead(200,{'Content-Type':'text/html'});
    response.end(html);
}

exports.login_process = function(request, response){
    var post = request.body;
    var email = post.email;
    var password = post.password;
    if(email =='egoing777@gmail.com' && password=='111111'){
        request.session.is_logined = true;
        request.session.nickname = 'egoing';
        response.writeHead(302,{
            'Set-Cookie':[
                `email=${email}; Path=/`,
                `password=${password}; Path=/`,
                `nickname=egoing; Path=/`
            ]
            ,Location:'/'
         });
         
         response.end();
    }else{
        response.end('Get Out Of Here !');
    }
}

exports.logout_process = function(request, response){
        response.writeHead(302,{
            'Set-Cookie':[
                `email=; Path=/;Max-Age=0`,
                `password=; Path=/;Max-Age=0`,
                `nickname=; Path=/;Max-Age=0`
            ]
            ,Location:'/'
         });
         response.end();
   
}