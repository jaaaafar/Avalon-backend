const RssPasrer = require('rss-parser');
const Cheerio = require('cheerio');
const got = require('got');
const defaultImage = 'https://i.imgur.com/YhmdDCd.png';
const RSSURL = 'https://myanimelist.net/rss/news.xml';

let parser = new RssPasrer();

const sleep = (waitTimeInMs) => new Promise((resolve) => setTimeout(resolve, waitTimeInMs));

//returns false if anything unexcpected happens or no image
/* const getImage = async (url) => {
	try {
		const response = await got(url);
		//console.log(response.body);
		const $ = Cheerio.load(response.body);
		const image = $('.news-container').find('img').attr('src');
		if (image === undefined) return false;
		return image;
	} catch (error) {
		console.log('error in getImage() of mal.js: ' + error);
		return false;
	}
}; */

//returns false if anything unexcpected happens or no image
const getImage = async (ItemTitle, response) => {
	try {
		const $ = Cheerio.load(response.body);
		const title = $('item').find('title');
		let image = false;
		title.each((i, title) => {
			if ($(title).text().includes(ItemTitle)) {
				image = $(title).parent().find('media\\:thumbnail').text();
				//console.log(image);
				return false;
			}
		});
		return image;
	} catch (err) {
		console.log('error in getImage() of mal.js: ' + error);
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
		console.log('error in formatItem() mal.js: ' + e);
	}
};

//returns false if anything goes wrong
const getItems = async (size = 20) => {
	try {
		let feed = await parser.parseURL(RSSURL);
		if (feed.items == undefined) return false;
		const response = await got(RSSURL);
		let items = feed.items;
		let completeItem;
		let itemsList = [];
		for (let i = 0; i < items.length; i++) {
			if (size === 0) break;
			//console.log(items[i].title);
			let source = 'MyAnimeList';
			let image = await getImage(items[i].title, response);
			if (!image) image = defaultImage;
			await sleep(1000);
			completeItem = { ...items[i], image, source };
			completeItem = formatItem(completeItem);
			itemsList.push(completeItem);
			size--;
		}
		console.log('MAL list is: ' + itemsList.length);
		return itemsList;
	} catch (e) {
		console.log('error in RSS parser MAL: ' + e);
		return false;
	}
};

module.exports = getItems;
