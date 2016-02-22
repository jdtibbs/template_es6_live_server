var browserify = require('browserify');
var fs = require('fs');
var process = require('process');
var shell = require('shelljs');
var uglify = require('uglify-js');

fs.stat('./public', function(error, stats) {
	if (error) {
		shell.mkdir('./public'); // make the target directory.
	} else if (stats.isDirectory()) {
		shell.rm('-rf', './public/*'); // clear the target directory.
	} else {
		throw new Error('Attention: directory ./public was not initialized.');
	}

	// copy files to ./public
	fs.createReadStream('./app/app.css')
		.pipe(fs.createWriteStream('./public/app.css'));
	fs.createReadStream('./app/favicon.ico')
		.pipe(fs.createWriteStream('./public/favicon.ico'));
	fs.createReadStream('./app/index.html')
		.pipe(fs.createWriteStream('./public/index.html'));

	var writeable = fs.createWriteStream('./public/app.js');

	// transform to ES5.
	browserify('./app/app.js')
		.transform('babelify', {
			presets: ['es2015']
		})
		.bundle()
		.pipe(writeable);

	// compress the ES5.
	writeable.on('finish', function() {
		if (process.argv.length > 2 && process.argv[2] === '-prod') {
			fs.writeFile('./public/app.js', uglify.minify("./public/app.js").code);
		}
	});
});
