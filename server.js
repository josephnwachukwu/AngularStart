//required for http server
var http = require('http'),
    fs = require('fs');
//required to open the browser
var open = require('open');
//required for opening static files
var path = require('path');
http.createServer(function(request, response) {
    console.log('request starting...');

    var filePath = './debug' + request.url;
    if (filePath == './debug/')
        filePath = './debug/index.html';

    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    
    fs.exists(filePath, function(exists) {
    
        if (exists) {
            fs.readFile(filePath, function (error, html) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                }
                else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(html, 'utf-8');
                }
            });
        }
        else {
            response.writeHead(404);
            response.end();
        }
    });
}).listen(8000);
console.log('server started at http://localhost:8000');


open('http://localhost:8000', function (err) {
  if (err) throw err;
  console.log('closed browser');
});