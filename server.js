'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { words } = require('./data/words');

const PORT = process.env.PORT || 8000;

// HANDLES
const handleWords = (req, res) => {
    let idIndex = Math.floor(Math.random() * (words.length -1));
    let id = words[idIndex].id;
    let letterCount = words[idIndex].letterCount;
    res.json({id, letterCount});
}

const handleGuess = (req, res) => {
    let wordId = req.params.wordId;

    let wordObj = words.find((word) => {
        return word.id === wordId
    })
    
    let letter = req.params.letter;

    let status = [];

    for (let char of wordObj.word) {
        let truthy = char === letter;
        status.push(truthy);
    }

    res.json(status)
}

express()
    .use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    })
	.use(morgan('tiny'))
	.use(express.static('public'))
    .use(bodyParser.json())
    .use(express.urlencoded({extended: false}))

    // endpoints
    .get('/hangman/words', handleWords)
    .get('/hangman/guess/:wordId/:letter', handleGuess)

    .listen(PORT, () => console.log(`Listening on port ${PORT}`));