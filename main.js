var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'boa457813',
    database:'opentutorials'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
  
    if(pathname === '/'){
        if(queryData.id === undefined){
            
            db.query(`SELECT * fROM topic`,function(error,topics){
                console.log(topics);
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var html = template.HTML(title,list,`<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
                response.writeHead(200);
                response.end(html);
            })
           
        }else{
            db.query(`SELECT * fROM topic`,function(error,topics){
                if(error){
                    throw error;
                }
                db.query(`SELECT * FROM topic WHERE id = ?`,[queryData.id],function(error2,topic){
                    if(error2){
                        throw errorw;
                    }
                    console.log(topics);
                    var title = topic[0].title;
                    var description = topic[0].description;
                    var list = template.list(topics);
                    var html = template.HTML(title,list,`<h2>${title}</h2>${description}`, `<a href="/create">create</a> <a href="/update?id=${queryData.id}">update</a> 
                    <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${queryData.id}">
                         <input type="submit" value="delete">
                         </form>`);
                    response.writeHead(200);
                    response.end(html);
                })
            })
            // fs.readdir('./data',function(error,filelist){
            // var filteredId = path.parse(queryData.id).base;
            // fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
            //     var title = queryData.id;
            //     var sanitizedTitle = sanitizeHtml(title);
            //     var sanitizedDescription = sanitizeHtml(description,{allowedTags:['h1']});
            //     var list = template.list(filelist);
            //     var html = template.HTML(sanitizedTitle,list,`<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, `<a href="/create">create</a> <a href="/update?id=${sanitizedTitle}">update</a> 
            //     <form action="/delete_process" method="post">
            //         <input type="hidden" name="id" value="${sanitizedTitle}">
            //         <input type="submit" value="delete">
            //     </form>
            //     `);
            //     response.writeHead(200);
            //     response.end(html);
            //     })
            // })
        }
            
    }else if(pathname === '/create'){
        db.query(`SELECT * fROM topic`,function(error,topics){
            console.log(topics);
            var title = 'Welcome';
            var description = 'Hello, Node.js';
            var list = template.list(topics);
            var html = template.HTML(title,list,`
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `, `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        })
        // fs.readdir('./data',function(error,filelist){
        //     // var filteredId = path.parse(queryData.id).base;
           
        //         var title = queryData.id;
        //         var list = template.list(filelist);
        //         var html = template.HTML(title,list,`
        //             <form action="/create_process" method="post">
        //                 <p><input type="text" name="title" placeholder="title"></p>
        //                 <p>
        //                     <textarea name="description" placeholder="description"></textarea>
        //                 </p>
        //                 <p>
        //                     <input type="submit">
        //                 </p>
        //             </form>
        //         `);
        //         response.writeHead(200);
        //         response.end(html);
               
        //     })
    }else if(pathname === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            db.query(`INSERT INTO topic(title,description, created,author_id) VALUES(?,?,NOW(),?)`,[post.title, post.description,1],function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302,{Location: `/?id=${result.insertId}`});
                response.end('success !');
            })
            // fs.writeFile(`data/${title}`,description,'utf8',function(err){
            //     response.writeHead(302,{Location: `/?id=${title}`});
            //     response.end('success !');
            // })
        });
    }else if(pathname === '/update'){
        // fs.readdir('./data',function(error,filelist){
            // var filteredId = path.parse(queryData.id).base;
            // fs.readFile(`data/${filteredId}`,'utf8',function(err,description){
        db.query(`SELECT * FROM topic`,function(error,topics){
            if(error){
                throw error
            }
            db.query(`SELECT * FROM topic WHERE id =?`,[queryData.id],function(error2,topic){

                var id = topic[0].id;
                var title = topic[0].title;
                var list = template.list(topics);
                var html = template.HTML(title,list,`
                <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                    <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
                `, `<a href="/create">create</a> <a href="/update?id=${id}">update</a>`);
                response.writeHead(200);
                response.end(html);
                })
            })
    }else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            db.query(`UPDATE topic set title=?,description=? WHERE id=?`,[title,description,id],function(error,result){
                response.writeHead(302,{Location:`/?id=${post.id}`});
                response.end('success');
            })
            // fs.rename(`data/${id}`,`data/${title}`,function(error){
            //     fs.writeFile(`data/${title}`,description,'utf8',function(err){
            //         response.writeHead(302,{Location: `/?id=${title}`});
            //         response.end('success !');
            //     })
            // })
           
        });
    }else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            console.log('id: ',id);
            db.query(`DELETE FROM topic WHERE id =?`,[id],function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302,{Location:'/'});
                response.end('');
            })
            // var filteredId = path.parse(id).base;
            // fs.unlink(`data/${filteredId}`,function(error){
            //     response.writeHead(302,{Location: `/`});
            //         response.end();
            // })
           
        });
    } else{
        response.writeHead(404);
        response.end('Not Found');
    }
    
    
   
});
app.listen(3000);
