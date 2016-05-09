var watch = require('node-watch');
var less = require('less');
var _fs = require('fs');
var fse = require('fs-extra');
var glob = require("glob-all");
var lessFiles;
var controllers;
var services;
var directives;


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

});