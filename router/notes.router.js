'use strict';


//  REQUIRE EXPRESS & ROUTER
const express = require('express');
const router = express.Router();

// REQUIRE NOTES, LOAD DATA FROM SIMDB & REQUIRE
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET NOTES 
router.get('/notes/:id', (req, res, next) => {
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

// GET NOTES FILTERED SEARCH
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
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

// UPDATE NOTE
router.put('/notes/:id', (req, res, next) => {
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

// CREATE NEW NOTE
router.post('/notes/', (req, res, next) => {
  // capture title & content from req
  const { title, content } = req.body;

  // validate user input
  const newItem = { title, content};
  if (!newItem.title) {
    const err = new Error('Missing title in request body');
    return next(err);
  }

  // validated, now create note & catch fall through err
  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http//${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });

});

// DELETE NOTE
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id, (err, item) => {
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

module.exports = router;