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