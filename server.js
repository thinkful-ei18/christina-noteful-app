'use strict';

const data = require('./db/notes');
const express = require('express');
const { PORT } = require('./config');
const logger = require('./middleware');


// INSERT EXPRESS APP CODE HERE...

const app = express();
app.use(express.static('public'));
app.use(logger);


app.get('/v1/notes/:id', (req, res) => {
  const { id } = req.params;
  const passIdInt = parseInt(id);
  const note = data.find(item => item.id === passIdInt);
  res.json(note);
});

// search

app.get('/v1/notes', (req, res) => {
  const { searchTerm } = req.query;
  // search through /notes
  let filterNotes = searchTerm ? data.filter(word => word.title.includes(searchTerm)) : data; 
  res.json(filterNotes);
  console.log(req.query);
});





app.listen(PORT, function () {
  console.info(`server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});