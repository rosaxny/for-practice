'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const NoteSchema = mongoose.Schema({
	lyrics: String,
	memories: String,
	vlink: String
});

NoteSchema.methods.serialize = function() {
	return {
		id: this._id,
		lyrics: this.lyrics,
		memories: this.memories,
		vlink: this.vlink
	};
};

const Note = mongoose.model('Note', NoteSchema);

module.exports = {Note};