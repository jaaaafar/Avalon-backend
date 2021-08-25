const mongoose = require('mongoose');

mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => {
		console.log('connection to database success!');
	})
	.catch((err) => {
		console.log('connection to database failed: ' + err);
	});
