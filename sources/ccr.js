const RssPasrer = require('rss-parser');
const Cheerio = require('cheerio');
const got = require('got');
const defaultImage = 'https://i.imgur.com/U732aF0.png';

let parser = new RssPasrer();

const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

//returns false if anything unexcpected happens or no image
const getImage = (content) => {
	try {
		const $ = Cheerio.load(content);
		let image = $('img').attr('src');
		//console.log(image);
		if (image === undefined) return false;
		return image;
	} catch (e) {
		console.log('error in getImage() of ccr.js: ' + error);
		return false;
	}
};

const formatItem = (completeItem) => {
	try {
		const rawDate = completeItem.isoDate;
		let pubdate = rawDate.substr(0, 10);
		//console.log(pubdate);
		let hour = rawDate.substr(11, 5).replace(':', '');
		//console.log(hour);
		//in case content was empty, content = title
		if(completeItem.content == "" || completeItem.content == undefined) completeItem.content = completeItem.title;
		//recreating the entire item
		formatedItem = {
			title: completeItem.title,
			content: completeItem['content:encoded'] || completeItem.content,
			link: completeItem.link,
			guid: completeItem.guid,
			image: completeItem.image,
			source: completeItem.source,
			pubdate,
			hour
		};
		return formatedItem;
	} catch (e) {
		console.log('error in formatItem() mal.js: ' + e);
	}
};

//returns false if anything goes wrong
const getItems = async (size = 20) => {
	try {
		let feed = await parser.parseURL('http://feeds.feedburner.com/crunchyroll/animenews');
		if (feed.items == undefined) return false;
		let items = feed.items;
		let completeItem;
		let itemsList = [];
		for (let i = 0; i < items.length; i++) {
			if (size === 0) break;
			let source = 'Crunchyroll';
			let image = getImage(items[i]['content:encoded']);
			if (!image) image = defaultImage;
			completeItem = { ...items[i], image, source };
			completeItem = formatItem(completeItem);
			itemsList.push(completeItem);
			size--;
		}
		console.log('CCR list is: ' + itemsList.length);
		return itemsList;
	} catch (e) {
		console.log('error in RSS parser CCR: ' + e);
		return false;
	}
};

module.exports = getItems;
