const auth = async (req, res, next) => {
	try {
		const pass = req.header('Authorization').replace('Bearer ', '');
		if (pass !== process.env.AUTH) throw new Error();
		next();
	} catch (error) {
		res.status(401).send({ error: 'please authenticate.' });
	}
};

module.exports = auth;
