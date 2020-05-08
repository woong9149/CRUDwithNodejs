var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var path = require('path');

authStatusUI=(request,response)=>{

    var authStatusUI = '<a href="/login">login</a>';
    if(request.isOwner){
        authStatusUI = '<a href="/logout_process">logout</a>';
    }
    return authStatusUI;
}

exports.home = function(request,response){
        
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(request.list);
        var html = template.HTML(title,list,`<h2>${title}</h2>${description}
            <img src="/images/machintoshi.jpg" style="width:300px; display:block; margin-top:10px;">`, `<a href="/create">create</a> <a href="/authorTable">authors</a>`,
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
                    <form action="/delete_process" method="post">
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
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log('params: ',request.params.updateId)
   
        db.query(`SELECT * FROM topic WHERE id =?`,[request.params.updateId],function(error2,topic){
            db.query(`SELECT * FROM author`,function(error2,authors){
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
        var post = request.body;
        var id = post.id;
        console.log('id: ',id);
        db.query(`DELETE FROM topic WHERE id =?`,[id],function(error,result){
            if(error){
                throw error;
            }
            response.writeHead(302,{Location:'/'});
            response.end('');
        })
}

exports.logIn = function(request,response){
        
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title,list,`
        <form action="/login_process" method="post">
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
        response.writeHead(302,{
            'Set-Cookie':[
                `email=${email}`,
                `password=${password}`,
                `nickname=egoing`
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
                `email=;Max-Age=0`,
                `password=;Max-Age=0`,
                `nickname=;Max-Age=0`
            ]
            ,Location:'/'
         });
         response.end();
   
}