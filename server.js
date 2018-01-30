'use strict';

const data = require('./db/notes');
const express = require('express');
const { PORT } = require('./config');
//const logger = require('./middleware');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);


// INSERT EXPRESS APP CODE HERE...

const app = express();
app.use(express.static('public'));
app.use(express.json());
//app.use(logger);


app.get('/v1/notes/:id', (req, res, next) => {
  const { id } = req.params;
  // const passIdInt = parseInt(id);
  // const note = data.find(item => item.id === passIdInt);
  // res.json(note);
  notes.find(id, (err, item) => {
    if (err) {
      return next(err);
    } 
    res.json(item);
  });
});



// search

app.get('/v1/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  console.log(searchTerm + ' searchTerm');
  // search through /notes
  //let filterNotes = searchTerm ? data.filter(word => word.title.includes(searchTerm)) : data; 
  //res.json(filterNotes);
  //console.log(req.query);
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});


app.put('/v1/notes/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    console.log(typeof req.body);
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
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