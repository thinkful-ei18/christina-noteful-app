'use strict';


//  REQUIRE EXPRESS & ROUTER
const express = require('express');
const router = express.Router();

// REQUIRE NOTES, LOAD DATA FROM SIMDB & REQUIRE
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

// GET SPECIFIC NOTE 
router.get('/notes/:id', (req, res, next) => {
  const { id } = req.params;
  notes.find(id).then(item => {
    if (item) {
      res.json(item);
    } else {
      next();
    }
  }).catch(err => next(err));
});

// GET GENRAL NOTES && HANDLE NOTE SEARCH
router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm).then(item => {
    if (item){
      res.json(item);
    } else {
      next();
    }
  }).catch(err => next(err));
});

// UPDATE NOTE
router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj).then(item => {
    if (item) {
      res.json(item);
    } else {
      next();
    }
  }).catch(err => next(err));
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
  notes.create(newItem).then(item => {
    if (item) {
      res.location(`http//${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  }).catch(err => next(err));
});

// DELETE NOTE
router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;

  notes.delete(id).then(item => {
    if (item) {
      res.json(item);
    } else {
      next();
    }
  }).catch(err => next(err));
});

module.exports = router;