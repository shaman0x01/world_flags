'use strict';

const countryNum = 249
let country;
let score = 0;
let countriesData = [];

const sleep = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


const resetAnswers = function () {
	for (let i = 0; i < 4; i++) {
		document.querySelectorAll('li')[i].style.backgroundColor = '#003F63';
	}
}

const selectQuestion = function() {
	let randomNumber = -1;
	while (randomNumber == -1 || !countriesData[randomNumber].name || !countriesData[randomNumber].flag){
		randomNumber = Math.floor(Math.random()*countryNum);
	}
	country = countriesData[randomNumber].name;
	const flag = countriesData[randomNumber].flag;
	document.querySelector('img').src = flag;
	document.querySelector('img').style.width = '300px';
	document.querySelector('img').style.height = '150px';
	const answers = selectAnswers(country, randomNumber);
	for (let i = 0; i < 4; i++) {
		document.querySelectorAll('li')[i].addEventListener('click', checkAnswer);
		document.querySelectorAll('li')[i].textContent = answers[i];
	}
}

const selectAnswers = function(country, correctAnswerIndex) {
	let answers = []
	let randomNumber = -1;
	let randoms = [];
	answers.push(countriesData[correctAnswerIndex].name);
	countriesData.splice(correctAnswerIndex, 1, country);
	for (let i = 0; i < 3; i++) {
		while (randomNumber == -1 || randoms.includes(randomNumber) || !countriesData[randomNumber].name){
			randomNumber = Math.floor(Math.random()*(countryNum));
		}
		randoms.push(randomNumber);
		answers.push(countriesData[randomNumber].name);
	}
	answers = answers.map( a => ({sort: Math.random(), value: a}))
				.sort((a,b) => a.sort - b.sort)
				.map(a => a.value)
	return answers;
}

const checkAnswer = function(e) {
	if (e.target.innerText === country){
		e.target.style.backgroundColor = '#A6BF4B';
		sleep(500).then(() => {
			score += 10;
			document.querySelector('.score').innerText = `Score: ${score}`;
			resetAnswers();
			selectQuestion();
		});
		
	} else {
		e.target.style.backgroundColor = '#D90B1C';
		score -= 5;
		document.querySelector('.score').innerText = `Score: ${score}`;
	}
}

fetch('https://restcountries.eu/rest/v2/all')
	.then(res => res.json())
	.then (data => {
		countriesData = data;
		selectQuestion();
	})