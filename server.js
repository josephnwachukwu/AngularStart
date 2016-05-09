var watch = require('node-watch');
var less = require('less');
var _fs = require('fs');
var fse = require('fs-extra');
var glob = require("glob-all");
var http = require('http');
var open = require('open');
var path = require('path');
var lessFiles;
var controllers;
var services;
var directives;

function concat(opts) {
    var fileList = opts.src;
    var distPath = opts.dest;
    var out = fileList.map(function(filePath){
        return _fs.readFileSync(filePath).toString();
    });
    _fs.writeFileSync(distPath, out.join('\n'));
    console.log(' '+ distPath +' built.');
}


fse.copy('build/js/app.js', 'debug/js/app.js', function (err) {
    if (err) return console.error(err)
    console.log("copied app.js");
});

fse.copy('build/index.html', 'debug/index.html', function (err) {
    if (err) return console.error(err)
    console.log("copied index.html");
});

fse.copy('build/views', 'debug/views', function (err) {
    if (err) return console.error(err)
    console.log('updated views');
});

fse.copy('build/js/lib', 'debug/js/lib', function (err) {
    if (err) return console.error(err)
    console.log('updated libraries');
});


glob("build/less/*.less", function (er, files) {
    console.log(files);
  lessFiles = files;
  concat({
    src : lessFiles,
    dest : 'debug/less/build.less'
    });
});

glob(["build/js/controllers/module.js", "build/js/controllers/*.js"], function (er, files) {
    console.log(files);
    controllers = files;
    concat({
        src : controllers,
        dest : 'debug/js/controllers.js'
    });
});

glob(["build/js/services/module.js", "build/js/services/*.js"], function (er, files) {
    console.log(files);
    services = files;
    concat({
        src : services,
        dest : 'debug/js/services.js'
    });
});

glob(["build/js/directives/module.js", "build/js/directives/*.js"], function (er, files) {
    console.log(files);
    directives = files;
    concat({
        src : directives,
        dest : 'debug/js/directives.js'
    });
});

http.createServer(function(request, response) {

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
    
    _fs.exists(filePath, function(exists) {
    
        if (exists) {
            _fs.readFile(filePath, function (error, html) {
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

open('http://localhost:8000/#/home', function (err) {
  if (err) throw err;
});

watch('build/less', { recursive: false, followSymLinks: true }, function(filename) {
    console.log(filename, ' changed.');

    glob("build/less/*.less", function (er, files) {
        console.log(files);
        lessFiles = files;
        concat({
            src : lessFiles,
            dest : 'debug/less/build.less'
        });
        var lessInput = _fs.readFileSync("debug/less/build.less");
        less.render(lessInput.toString())
        .then(function(output) {
                _fs.writeFileSync("debug/css/build.css", output.css);
                console.log("build.css created");
        },
        function(error) {
            console.log(error);
        });
    });
});

watch('build/js', { recursive: true, followSymLinks: true }, function(filename) {
    console.log(filename, ' changed.');

    glob(["build/js/controllers/module.js", "build/js/controllers/*.js"], function (er, files) {
        console.log(files);
        controllers = files;
        concat({
            src : controllers,
            dest : 'debug/js/controllers.js'
        });
    });

    glob(["build/js/services/module.js", "build/js/services/*.js"], function (er, files) {
        console.log(files);
        services = files;
        concat({
            src : services,
            dest : 'debug/js/services.js'
        });
    });

    glob(["build/js/directives/module.js", "build/js/directives/*.js"], function (er, files) {
        console.log(files);
        directives = files;
        concat({
            src : directives,
            dest : 'debug/js/directives.js'
        });
    });

    fse.copy('build/js/app.js', 'debug/js/app.js', function (err) {
        if (err) return console.error(err)
        console.log("copied app.js");
    });

});

console.log("watching less and js");