const Cheerio = require('cheerio');
const got = require('got');

let titles = '';

const getAnimes = async () => {
	const response = await got('https://myanimelist.net/topanime.php?limit=250');

	const $ = Cheerio.load(response.body);

	const anime = $('.ranking-list');

	for (let i = 0; i < anime.length; i++) {
		let title = $(anime[i]).find('.hoverinfo_trigger').text();
		//console.log(title + ', AAAAAAAAAAAAAAAAA');
		//console.log(title);
		titles = titles + title + ', ';
	}
};

getAnimes().then(() => console.log(titles));
