var http = require('http');
var cookie = require('cookie');

http.createServer(function(request,response){
    
    var cookies = {};
    if(request.headers.cookie !== undefined){
        cookies = cookie.parse(request.headers.cookie);
    }
    console.log('yummy_cookie: ',cookies.yummy_cookie);
    response.writeHead(200,{
        'Set-Cookie':['yummy_cookie=choco',
                      'tasty_cookie=strawberry',
                      `Permanent=cookies;Max-Age=${60*60*24*30}`,//max-age는 현재 시점을 기준으로 상대적인값, expire는 절대적인값
                     `Secure=Secure; Secure`,
                     'HttpOnly=secrete; HttpOnly',
                     'Path=Path; Path=/cookie',
                     'Domain=Domain; Domain=02.org' //02.org앞에 어떤 sub도메인이 붙어도 살아있게함.
                    ]
    });
    response.end('Cookie');
}).listen(3000);






