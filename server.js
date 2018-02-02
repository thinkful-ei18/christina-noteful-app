'use strict';

// REQUIRE EXPRESS & MORGAN, SET PORT TO ./CONFIG
const express = require('express');
const { PORT } = require('./config');
const morgan = require('morgan');

// INSERT EXPRESS APP CODE HERE...
// CREATE EXPRESS APP & STATIC
const app = express();
// LOG ALL REQUESTS THROUGH MORGAN
app.use(morgan('dev'));
// SERVE STATIC PAGE
app.use(express.static('public'));
// JSON PARSER (ALWAYS BEFORE ROUTERS!!!)
app.use(express.json());
// REQUIRE ROUTER & MOUNT ROUTER
const notesRouter = require('./router/notes.router');
app.use('/v1', notesRouter);



// ERROR LOGGING
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

// FALL THROUGH ERROR AT 500 SERVER
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

if (require.main === module) {
  app.listen(PORT, function () {
    console.info(`server listening on ${this.address().port}`);
  }).on('error', err => {
    console.error(err);
  });
}
module.exports = app; // export for testing