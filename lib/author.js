var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');


authStatusUI=(request,response)=>{

    var authStatusUI = '<a href="/auth/login">login</a>';
    if(request.isOwner){
        authStatusUI = '<a href="/auth/logout_process">logout</a>';
    }
    return authStatusUI;
}

exports.home = function(request,response){
    if(!request.isOwner){
        response.send('Login required!! <a href="/auth/login">Go Login</a>');
        return false;
    }
    db.query(`SELECT * FROM topic`,function(error,topics){
        if(error){
            throw error;
        }
      db.query(`SELECT * FROM author`,function(error2,authors){
        if(error2){
            throw error2;
        }
        var title = 'author';
        var list = template.list(topics);
        var html = template.HTML(title,list,
            `
            ${template.authorTable(authors)}
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
             <form action="/author_create_process" method="post">
                <p><input type="text" name="name" placeholder="name"></p>
                <p>
                    <textarea name="profile" placeholder="profile"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>`,
            '',
          authStatusUI(request,response)
            );
            response.writeHead(200,{'Content-Type':'text/html'});
            response.end(html);
       })
    })
}

exports.create_process = function(request,response){
    console.log('request.isOwner: ',request.isOwner);
    if(!request.isOwner){
        response.send('Login required!! <a href="/login">Go Login</a>');
        return false;
    }
        var post = request.body;
        db.query(`INSERT INTO author (name,profile) VALUES(?,?)`,[post.name, post.profile],function(error,result){
            if(error){
                throw error;
            }
            response.writeHead(302,{Location:'/authorTable'});
              response.end('');
        })
}

exports.update = function(request,response){
    if(!request.isOwner){
        response.send('Login required!! <a href="/login">Go Login</a>');
        return false;
    }
    console.log('owner1: ',request.isOwner);
    var _url = request.url;
    db.query(`SELECT * FROM topic`,function(error,topics){
        if(error){
            throw error;
        }
      db.query(`SELECT * FROM author`,function(error2,authors){
        if(error2){
            throw error2;
        }
        db.query(`SELECT * FROM author WHERE id =?`,[request.params.author_updateId],function(error3,author){
            console.log('author: ',author);
            if(error3){
                throw error2;
            }
            var title = 'author';
            var list = template.list(topics);
            var html = template.HTML(title,list,
                `
                ${template.authorTable(authors)}
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                 <form action="/author_update_process" method="post">
                 <input type="hidden" name="id" value="${author[0].id}">
                    <p><input type="text" name="name" value="${sanitizeHtml(author[0].name)}"></p>
                    <p>
                        <textarea name="profile" >${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>`,
            ``
                );
                response.writeHead(200,{'Content-Type':'text/html'});
                response.end(html);
        })
       })
    })
}

exports.update_process = function(request,response){
        var post = request.body;
        var id = post.id;
        var name = post.name;
        var profile = post.profile;
        console.log('id: ',id,name,profile)
        db.query(`UPDATE author SET name=?,profile=? WHERE id=?`,[name,profile,id],function(error,result){
            if(error){
                throw error;
            }
            response.writeHead(302,{Location:'/authorTable'});
            response.end('');
         })
    
}

exports.delete_process = function(request,response){
    
    if(!request.isOwner){
        response.send('Login required!! <a href="/login">Go Login</a>');
        console.log('0');
        return false;
    }
    // var body = '';
    // request.on('data',function(data){
        // body += data;
    // })
    // request.on('end',function(){
        var post = request.body;
        var id = post.id;
        console.log('id: ',id);
        db.query(`DELETE FROM author WHERE id=?`,[id],function(error,result){
            if(error){
                throw error;
            }
            response.writeHead(302,{Location:'/authorTable'});
            response.end('');
         })
    // })

}











