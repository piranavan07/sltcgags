const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const rateLimit = require("express-rate-limit");




const app = express();
const db = monk(process.env.MONGO_URI || 'localhost/tweet');//meower=gags
const tweets = db.get('tweets'); //mews=tweets
const filter = new Filter();


app.use(cors());
app.use(express.json());



app.get('/', (req, res) =>{
	res.json({
		message: 'Hello SLTC!!!! '
	});
	
});

app.get('/tweets', (req, res) => {
	tweets
		.find()
		.then(tweets => {
			res.json(tweets);
			
		});
	
	
});





function isValidtweet(tweet){
	return tweet.name && tweet.name.toString().trim() !== '' &&
		tweet.messages && tweet.messages.toString().trim() !== '';
	
}

app.use(rateLimit({
	windowMs: 30*1000,//30sec
	max: 1 // limit each ip to 1 requests per windowMs
}));

app.post('/tweets', (req, res) => {
	//console.log(req.body);
	if (isValidtweet(req.body)) {
		//insert into db...
		const tweet = {
			name: filter.clean(req.body.name.toString()),
			messages: filter.clean(req.body.messages.toString()),
			created: new Date()
		}; 
		console.log(tweet);
		tweets
			.insert(tweet)
			.then(createdtweet => {
				res.json(createdtweet);
			});
		
	} else {
		res.status(422);
		res.json({
			message: 'Hey! Name and Message are required!'
		});
		
	}
	
});

app.listen(5000, () => {
	console.log('Listening on http://localhost:5000');

});