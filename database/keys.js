const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
	key: {
		type: String,
		required: true
	},
	word: {
		type: String,
		required: true,
		maxlength: 50
	}
});

const Key = mongoose.model('keys', keySchema);

module.exports = Key;
