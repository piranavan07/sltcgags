console.log('Hello world!');

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const tweetsElement = document.querySelector('.tweets');
//const API_URL = window.location.hostname == 'localhost' ? 'http://localhost:5000/tweets' : 'https://piranavan.000webhostapp.com/tweets' ;
const API_URL = window.location.hostname == 'localhost' ? 'http://localhost:5000/tweets' : 'https://piranavan.000webhostapp.com/tweets' ;
//const API_URL = 'http://localhost:5000/tweets';


loadingElement.style.display = '';

listAllTweets();

form.addEventListener('submit', (event) => {

	event.preventDefault();
	const formData = new FormData(form);
	const name = formData.get('name');
	const messages = formData.get('messages');

	const tweet ={
		name,
		messages
	};


	form.style.display = 'none';
	loadingElement.style.display = '';


	fetch(API_URL, {
		method: 'POST',
		body: JSON.stringify(tweet),
		headers: {
			'content-type': 'application/json'
		}

	}).then(response => response.json())
	  .then(createdtweet => {
		 // console.log(createdtweet);
		  form.reset();
		  setTimeout(() => {
			  form.style.display = '';
		  },30000);

		  //loadingElement.style.display = 'none';
		  listAllTweets();
	  });
});

function listAllTweets(){
	tweetsElement.innerHTML = '';
	fetch(API_URL, {

	}).then(response => response.json())
	  .then(tweets => {
			//console.log(tweets);
			tweets.reverse();
			tweets.forEach(tweet =>{
				const div = document.createElement('div');

				const header = document.createElement('h3');
				header.textContent = tweet.name;

				const messages = document.createElement('p');
				messages.textContent = tweet.messages;

				const date = document.createElement('small');
				date.textContent = new Date(tweet.created);


				div.appendChild(header);
				div.appendChild(messages);
				div.appendChild(date);

				tweetsElement.appendChild(div);
			});
			loadingElement.style.display = 'none';
		});
}
