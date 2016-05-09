var fse = require('fs-extra');

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