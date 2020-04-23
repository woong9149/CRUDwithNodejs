var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function(request,response){
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
            `,
            `<a href="/create">create</a>`
            );
            response.writeHead(200);
            response.end(html);
       })
    })
}

exports.delete_process = function(request,response){
    var body = '';
    request.on('data',function(data){
        body += data;
    })
    request.on('end',function(){
        var post = qs.parse(body);
        var id = post.id;
        console.log('iodid: ',id);
        db.query(`DELETE FROM author WHERE id=?`,[id],function(error,result){
            if(error){
                throw error;
            }
            response.writeHead(302,{Location:'/authorTable'});
            response.end('');
         })
    })
    
}











