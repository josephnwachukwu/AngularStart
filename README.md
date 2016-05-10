# Angular Boilerplate

##A Boilerplate without all the BS

**Note: This is still a work in progress and its in the beginning stages. several things still have to be added such as modules for security, forms, cookies, music, images, and navigation. Jshint still has to be added to the build script and the build scripts have to be modified.**

---

Angular Boilerplate is a client site single page application template built using [AngularJS](http://angularjs.org). it conforms to todays front end development best practices as well as my personal preferences.

## Why make another boilerplate? Where are so many

This boilerplate was created to expedite making websites. 

## Install and Get started
**(1)** Get UI-Router in one of the following ways:

- clone & [build](CONTRIBUTING.md#developing) this repository
- [download the release](http:/gensystemstech.com/angular-boilerplate.zip) (or [minified](http:/gensystemstech.com/angular-boilerplate.min.zip))

**(2)** Start Coding:

Start Devleoping from boilerplate or drop your template and styles into the build. 

##The Package
###CSS
#### [Less](lesscss.org) and [Bem methodology](https://bem.info) are used for the css. 

####No grunt or gulp all building and testing is done with node. Much cleaner. Nothing too complicated. 

### Node Modules

* [concat](https://www.npmjs.com/package/concat)
* [glob](https://github.com/isaacs/node-glob)
* [less](https://www.npmjs.com/package/less)
* [watch](https://www.npmjs.com/package/watch)
* [open](https://www.npmjs.com/package/open)
* [path](https://www.npmjs.com/package/path)
* [jshint](https://www.npmjs.com/package/jshint)
* [uglify](https://www.npmjs.com/package/uglify-js)
* [livereload](https://www.npmjs.com/package/livereload)
* [glob-all](https://www.npmjs.com/package/glob-all)
* [fs-extra](https://www.npmjs.com/package/fs-extra)

### Other Libraries
* [Modernizr](https://modernizr.com/)
* [UI-Router](https://github.com/angular-ui/ui-router)
* [jQuery](https://jquery.com/)

## A little about the code

### Index.html
The Index.html holds the necessary scripts as well as the open graph and meta tags and the basic structure of the app.
>
```html
<!DOCTYPE html>
<html lang="en">
<head>
	<title>Angular JS Boilerplate</title>
	<link rel="stylesheet" media="all" type="text/css" href="css/build.css" />
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
</head>
<body  data-ng-app="boilerplate">
	<header></header>
	<div class="container">
		<div>
		</div>
		<div class="row">
			<div class="__column __column--12x">
				<h1>Style Guide</h1>
				<h2>Grid</h2>
			</div>
		</div>
		<div class="row">
			<div class="__column __column--3x">
				<span>Hello</span>
			</div>
		</div>
	</div>
	<footer></footer>
</body>
</html>
```

### Server.js
Server.js starts the server and launches the page in your default browser

>
```javascript
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
};
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
```


### Watch.js
Watch.js watches the /less folders and the /js folders for changes. 

>
```javascript
var watch = require('node-watch');
var _fs = require('fs');
var glob = require("glob");
var less = require('less');
var fileArr;
console.log("watching less and js");
function concat(opts) {
	var fileList = opts.src;
	var distPath = opts.dest;
	var out = fileList.map(function(filePath){
		return _fs.readFileSync(filePath).toString();
	});
	_fs.writeFileSync(distPath, out.join('\n'));
	console.log(' '+ distPath +' built.');
}
watch(['build/js', 'build/less'], { recursive: false, followSymLinks: true }, function(filename) {
	console.log(filename, ' changed.');
	glob("build/less/*.less", function (er, files) {
		fileArr = files;
		concat({
			src : fileArr,
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
```


### app.js
app.js is the main entry point for the app. 
>
```javascript
//Angular Boilerplate App
// 'boilerplate' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'boilerplate.controllers' is found in controllers.js
angular.module('boilerplate', [])
.run(function(){
})
.config(function(){
});
```



