const mongoose = require('mongoose');

defaultSettings = { type: String, required: true };

const itemSchema = new mongoose.Schema({
	title: {
		...defaultSettings,
		maxlength: 1000
	},
	content: {
		...defaultSettings
	},
	link: {
		...defaultSettings
	},
	guid: {
		...defaultSettings
	},
	image: {
		...defaultSettings
	},
	source: {
		...defaultSettings,
		maxlength: 50
	},
	pubdate: {
		...defaultSettings,
		maxlength: 11
	},
	hour: {
		type: Number,
		maxlength: 4
	}
});

const Item = mongoose.model('items', itemSchema);

module.exports = Item;
