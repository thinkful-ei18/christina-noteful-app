/* global $ store api*/
'use strict';

const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  function updateStoreAndRender(query) {
    api.search(query)
      .then(results => {
        store.notes = results;
        render();
      });
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId).then(results => {
        store.currentNote = results;
        render();
      });

    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm =  searchTerm ? { searchTerm } : {};
      
      api.search(store.currentSearchTerm).then(results => {
        store.notes = results;
        render();
      });
    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      if (store.currentNote.id) {
        // if store contains id, update note
        api.update(noteObj.id, noteObj).then(results => {
          store.currentNote = results;
          updateStoreAndRender(store.currentSearchTerm);
        });

      } else {
        // else create new note
        api.create(noteObj).then(results => {
          store.currentNote = results;
          updateStoreAndRender(store.currentSearchTerm);
        });
      }

    });
  }

  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').submit(event => {
      event.preventDefault;
      store.currentNote = false;
      render();
    });
  }

  function handleDeleteNote () {
    $('.js-notes-list').on('click', '.js-note-delete-button', event => {
      const noteId = getNoteIdFromElement(event.currentTarget);

      api.delete(noteId)
        .then(results => {
          // UPDATED TO CLEAR DELTED NOTE FROM FORM
          store.currentNote = false;
          updateStoreAndRender(noteId);
        });
    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleDeleteNote();
  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners,
    updateStoreAndRender,
  };

}());
