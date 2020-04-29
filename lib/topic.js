var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
var path = require('path');

exports.home = function(request,response){
    db.query(`SELECT * fROM topic`,function(error,topics){
        
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);
        var html = template.HTML(title,list,`<h2>${title}</h2>${description}`, `<a href="/create">create</a> <a href="/authorTable">authors</a>`
        );
        response.writeHead(200);
        response.end(html);
    })
}

exports.page = function(request,response){
    var _url = request.url;
    var queryData = path.parse(request.params.pageId).base;
    db.query(`SELECT * fROM topic`,function(error,topics){
        if(error){
            throw error;
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[request.params.pageId],function(error2,topic){
            if(error2){
                throw errorw;
            }
           
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title,list,
                `<h2>${sanitizeHtml(title)}</h2>
                ${sanitizeHtml(description)}
                <p>by ${sanitizeHtml(topic[0].name)}</p>`, 
                `<a href="/create">create</a> <a href="/update/${request.params.pageId}">update</a> 
                <form action="/delete_process" method="post">
                    <input type="hidden" name="id" value="${request.params.pageId}">
                    <input type="submit" value="delete">
                </form>`);
            response.writeHead(200);
            response.end(html);
        })
    })
}

exports.create = function(request, response){
    db.query(`SELECT * fROM topic`,function(error,topics){
        db.query(`SELECT * FROM author`,function(error2,authors){
            var title = 'Create';
            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(title),list,`
            <form action="/create_process" method="post">
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
            `, `<a href="/create">create</a>`);
            response.writeHead(200);
            response.end(html);
        })
        
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
    /*
    var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            var author = post.author;
            db.query(`INSERT INTO topic(title,description, created,author_id) VALUES(?,?,NOW(),?)`,[title,description,author],function(error,result){
                if(error){
                    throw error;
                }
                response.writeHead(302,{Location: `/?id=${result.insertId}`});
                response.end('success !');
            })
       
        */
    });
}

exports.update = function (request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log('params: ',request.params.updateId)
    db.query(`SELECT * FROM topic`,function(error,topics){
            
        if(error){
            throw error
        }
        db.query(`SELECT * FROM topic WHERE id =?`,[request.params.updateId],function(error2,topic){
            db.query(`SELECT * FROM author`,function(error2,authors){
            var id = topic[0].id;
            var title = topic[0].title;
            var list = template.list(topics);
            var html = template.HTML(sanitizeHtml(title),list,`
            <form action="/update_process" method="post">
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
            `, `<a href="/create">create</a> <a href="/update/${id}">update</a>`);
            response.writeHead(200);
            response.end(html);
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
           
        
    /*
    var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end',function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            var author = post.author;
            db.query(`UPDATE topic set title=?,description=?,author_id=? WHERE id=?`,[title,description,author,id],function(error,result){
                response.writeHead(302,{Location:`/?id=${post.id}`});
                response.end('success');
            })
           
        });
    */
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
   
   /*
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
    });
    */
}