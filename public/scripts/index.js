/* global $ noteful api store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search({}).then(results => {
    store.notes = results;
    noteful.render();
  });

});