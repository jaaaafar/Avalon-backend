/* this global parser fetches data from all sources and filter them by confrming 
that they're not in DB before returning a list of only new items that are yet to be
stocked in database*/

const malParser = require('../sources/mal');
const annParser = require('../sources/ann');
const ccrParser = require('../sources/ccr');
const Item = require('../database/items');

const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

//delay is in seconds
const fetchItems = async (size, delay) => {
	let items = [];

	malParser(size).then(async (list) => {
		if (!list) {
			console.error(
				'Couldnt fetch MAL feed in globalPrarser.js. something went wrong in mal.js; check log for more information'
			);
			return;
		}

		//confirming that the items are not already in the database
		for (let i = 0; i < list.length; i++) {
			let result = await Item.find({ guid: list[i].guid });
			if (result.length != 0) continue;
			items.push(list[i]);
		}
	});

	annParser(size).then(async (list) => {
		if (!list) {
			console.error(
				'Couldnt fetch ANN feed in globalPrarser.js. something went wrong in ann.js; check log for more information'
			);
			return;
		}
		//confirming that the items are not already in the database
		for (let i = 0; i < list.length; i++) {
			let result = await Item.find({ guid: list[i].guid });
			//if found in db don't add to list. But in case the image was default
			//and new image available, then update before continuing
			if (result.length != 0) {
				if (
					result[0].image == 'https://i.imgur.com/JhhknMC.png' &&
					list[i].image != 'https://i.imgur.com/JhhknMC.png'
				) {
					console.log('entered condition');
					await result[0].updateOne({ $set: { image: list[i].image } });
				}
				continue;
			}
			items.push(list[i]);
		}
	});

	ccrParser(size).then(async (list) => {
		if (!list) {
			console.error(
				'Couldnt fetch CCR feed in globalPrarser.js. something went wrong in mal.js; check log for more information'
			);
			return;
		}

		//confirming that the items are not already in the database
		for (let i = 0; i < list.length; i++) {
			let result = await Item.find({ guid: list[i].guid });
			if (result.length != 0) continue;
			items.push(list[i]);
		}
	});

	await sleep(delay * 1000);

	return items;
};

module.exports = fetchItems;
