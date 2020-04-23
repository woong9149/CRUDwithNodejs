var mysql = require('mysql');

var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'boa457813',
    database:'opentutorials'
});
db.connect();

module.exports = db;