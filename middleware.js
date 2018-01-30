'use strict';

const middleware = function (req,res) {
  console.log(new Date + ' request made to ' + req.url + ' using ' + req.method);
};

module.exports = middleware;