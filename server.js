'use strict';

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Note} = require('./models');

app.use(express.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');

	if(req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

app.get('/', (req, res) =>{
	Note
		.find()
		.then((notes) => {
			res.json(notes.map((note) => {note.serialize()}))
		})
		.catch((err) => {
			console.error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});

app.post('/', (req, res) => {
	Note
		.create({
			lyrics: req.body.lyrics,
			memories: req.body.memories,
			vlink: req.body.vlink
		})
		.then((note) => { res.status(201).json(note.serialize())})
		.catch((err) => {
			console.error(err);
			res.status(500).json({error: 'something went wrong'});
		});
});


let server;

function runServer(db) {
	return new Promise((resolve, reject) => {
		mongoose.connect(db, (err) => {
			if(err) {
				return reject(err);
			}

			server = app.listen(PORT, () => {
				console.log(`App is listening on port ${PORT}`);
				resolve();
			})
			.on('error', (err) => {
				if(err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect()
					.then(() => {
						return new Promise((resolve, reject) => {
							console.log('Closing server');
							server.close((err) => {
								if(err) {
									return reject(err);
								}
								resolve();
							});
						});
					});
}

if(require.main === module) {
	runServer(DATABASE_URL).catch((err) => {
		console.log(err);
	});
}

module.exports = {app, runServer, closeServer};