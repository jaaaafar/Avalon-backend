const Key = require('../database/keys');
const Item = require('../database/items');
const globalParser = require('./globalParser');

//parametres for the globalparser function
const SIZE = 3;
const DELAY = 40;
//Delay for the main function
const MAINDELAY = 1000 * 60 * 10;

//gets array of words and returns filtered array of words
const removeDuplicates = (words) => {
	let uniqWords = [];
	for (let i = 0; i < words.length; i++) {
		if (!uniqWords.includes(words[i])) uniqWords.push(words[i]);
	}
	//console.log(uniqWords);
	return uniqWords;
};

//fetch all key words from database
const fetchKeyWords = async () => {
	let allWords = [];
	let result = await Key.find({}, 'word');
	result.forEach((entry) => {
		allWords.push(entry.word);
	});
	//allWords is now an array of words
	//we need to remove duplicate words first before passing the array to the next step
	//console.log(allWords);
	allWords = removeDuplicates(allWords);
	//now allWords is a clean array of words fetched from the database
	return allWords;
};

//return an array of only words included in the item
const containsKeyWord = async (item, allWords) => {
	let availableWords = [];
	let title = item.title;
	let content = item.content;
	for (let i = 0; i < allWords.length; i++) {
		if (content.includes(allWords[i]) || title.includes(allWords[i])) availableWords.push(allWords[i]);
	}
	//availableWords now contains an array of only words in the title or content; Nice
	//console.log(availableWords);
	//next we send notifications to all keys that have at least one of the available words
	//...
};

const fetchNewFeed = () => {
	globalParser(SIZE, DELAY)
		.then(async (list) => {
			//proccessing the returned list
			//list contains feed items
			//the size of the list if SIZE
			//console.log(list.length);
			//if not items in the list; meaning no new items
			if (list.length === 0) return;
			//saving the items to database
			Item.create(list, (err, nice) => {
				if (err) {
					console.log(
						'In feedListener.fetchNewFeed; error happpened while trying to save items in database: ' + err
					);
					console.log('item list is: ');
					for (let i=0; i<list.length; i++) {
						console.log("title: " + list[i].title + " source: " + list[i].source);
					}
				}
			});
			//getting a clean array of all keywords in the database
			allWords = await fetchKeyWords();
			//checking each of the new items if they contain key words
			list.forEach((item) => {
				containsKeyWord(item, allWords);
			});
		})
		.catch((err) => {
			console.error('From feedListener.fetchNewFeed() ; Something went wrong: ' + e);
		});
};

fetchNewFeed();
setInterval(fetchNewFeed, MAINDELAY);
setInterval(() => console.log('Working...'), 1000 * 60 * 60);
