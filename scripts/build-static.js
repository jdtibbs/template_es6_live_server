var fs = require('fs');

fs.stat('./public', function(error, stats) {

	// copy files to ./public
	fs.createReadStream('./app/app.css')
		.pipe(fs.createWriteStream('./public/app.css'));
	fs.createReadStream('./app/favicon.ico')
		.pipe(fs.createWriteStream('./public/favicon.ico'));
	fs.createReadStream('./app/index.html')
		.pipe(fs.createWriteStream('./public/index.html'));

});
