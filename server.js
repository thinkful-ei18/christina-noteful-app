'use strict';

const data = require('./db/notes');
const express = require('express');
const { PORT } = require('./config');
const logger = require('./middleware');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


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

// app.get('/v1/notes', (req, res, next) => {
//   const { searchTerm } = req.query;
//   console.log(searchTerm);
//   // search through /notes
//   //let filterNotes = searchTerm ? data.filter(word => word.title.includes(searchTerm)) : data; 
//   //res.json(filterNotes);
//   //console.log(req.query);
//   notes.filter(searchTerm, (err, list) => {
//     if (err) {
//       return next(err);
//     } else {
//       res.json(list);
//       console.log('here');
//     }
//   });
// });

app.get('/v1/notes', (req, res, next) => {
  console.log('test');
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});





app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


app.listen(PORT, function () {
  console.info(`server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});