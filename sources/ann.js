const RssPasrer = require('rss-parser');
const Cheerio = require('cheerio');
const got = require('got');
const defaultImage = 'https://i.imgur.com/JhhknMC.png';

let parser = new RssPasrer();

const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

//returns false if anything unexcpected happens or no image
const getImage = async (url) => {
	try {
		const annURL = 'https://www.animenewsnetwork.com';
		const response = await got(url);
		//console.log(response.body);
		const $ = Cheerio.load(response.body);
		let image = $('.meat').find('img')[0].attribs['data-src'];
		if (image === undefined) return false;
		image = annURL + image;
		return image;
	} catch (error) {
		console.log('error in getImage() of ann.js: ' + error);
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
			content: completeItem.content,
			link: completeItem.link,
			guid: completeItem.guid,
			image: completeItem.image,
			source: completeItem.source,
			pubdate,
			hour
		};
		return formatedItem;
	} catch (e) {
		console.log('error in formatItem() ann.js: ' + e);
	}
};

//returns false if anything goes wrong
const getItems = async (size = 20) => {
	try {
		let feed = await parser.parseURL('https://www.animenewsnetwork.com/news/rss.xml');
		if (feed.items == undefined) return false;
		let items = feed.items;
		let completeItem;
		let itemsList = [];
		for (let i = 0; i < items.length; i++) {
			if (size === 0) break;
			//console.log(items[i].title);
			let source = 'ANN';
			let image = await getImage(items[i].link);
			if (!image) image = defaultImage;
			await sleep(1000);
			completeItem = { ...items[i], image, source };
			completeItem = formatItem(completeItem);
			//console.log(completeItem.title)
			itemsList.push(completeItem);
			size--;
		}
		console.log('ANN list is: ' + itemsList.length);
		return itemsList;
	} catch (e) {
		console.log('error in RSS parser ANN: ' + e);
		return false;
	}
};

module.exports = getItems;
