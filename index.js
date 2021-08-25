require('./database/mongoose');
require('./parser/feedListener');

const Item = require('./database/items');
const Key = require('./database/keys');
const auth = require('./auth');
const express = require('express');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/sip', async (req, res) => {
	console.log(req.query.sip);
	res.status(200).json({
		title: req.query.sip
	});
});

//router for GETting items
app.get('/items', auth, async (req, res) => {
	const mal = req.query.mal;
	const ann = req.query.ann;
	const ccr = req.query.ccr;
	const timeStamp = req.query.ts;
	const limit = req.query.limit || 500;
	let sources = [];
	try {
		if (mal) sources.push('MyAnimeList');
		if (ann) sources.push('ANN');
		if (ccr) sources.push('Crunchyroll');
		let dummyObjId = ObjectID.createFromTime(timeStamp);
		const docs = await Item.find({
			source: { $in: sources },
			_id: { $gt: dummyObjId }
		}).limit(parseInt(limit)).sort([['_id', -1]]);
		console.log(docs.length);
		//console.log(docs.length);
		res.status(200).send(docs);
	} catch (err) {
		res.status(500).send(error);
	}
});

//router for posting keywords
app.post('/words', auth, async (req, res) => {
	try {
		//checking if word & key alreasy in db
		const result = await Key.find({ key: req.body.key, word: req.body.word });
		if (result.length != 0) {
			res.status(409).send('word already exists for this key');
			return;
		}

		//creating key and word then saving
		const word = new Key({
			...req.body
		});
		await word.save();
		res.status(201).send(word);
	} catch (err) {
		res.status(400).send(err);
	}
});

app.delete('/words', auth, async (req, res) => {
	try {
		const wordToDelete = await Key.findOne({ key: req.body.key, word: req.body.word });
		if (!wordToDelete) return res.status(404).send('word not found for this key');
		await wordToDelete.remove();
		res.status(200).send(wordToDelete);
	} catch (err) {
		res.status(400).send('bad request');
	}
});

app.listen(port, () => {
	console.log('server is running.');
});
