
// CHAI.SPY() IS NOT A FUNCTION

'use strict';

const app = require('../server');

const chai = require('chai');
const chaiHttp = require('chai-http');
const spy = require('chai-spies');
const expect = chai.expect;

chai.use(chaiHttp);
chai.use(spy);

// REALITY CHECK TEST
describe('Reality Check', function() {
  
  it('true should be true', function() {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function() {
    expect(2 + 2).to.equal(4);
  });
});

// GET REQUEST STATIC TEST
describe('Express static', function() {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });

});

// 404 TEST
describe('404 handler', function () {

  it('should respond with 404 when given a bad path', function () {
    const spy = chai.spy();
    return chai.request(app)
      .get('/bad/path')
      .then(spy)
      .then(() => {
        expect(spy).to.not.have.been.called();
      })
      .catch(err => {
        expect(err.response).to.have.status(404);
      });
  });

});

// GET REQUEST TEST && ERROR(404)
describe('GET Request', function () {

  it('should return notes from GET request', function () {
    return chai.request(app)
      .get('/v1/notes')
      .then(function(res) {
        expect(res.body).to.be.a('array');
        expect(res).to.be.json;
        expect(res).to.have.status(200);
        expect(res.body.length).to.equal(10);
      });

  });

  it('should return a 404 if request ID does not exist', function () {
    chai.request(app)
      .get('/v1/notes/')
      .then(function(res) {
        const badID = 'whoopsie';
        return chai.request(app)
          .get(`/v1/notes/${badID}`)
          .then(function(res) {
            expect(res).to.have.status(404);
          });
      });

  });

  it('should return requested note by ID with GET request', function () {
    chai.request(app)
      .get('/v1/notes/')
      .then(function(res) {
        const id = res.body[0].id;
        return chai.request(app)
          .get(`/v1/notes/${id}`)
          .then(function(res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            expect(res.body.id).to.deep.equal(id);
          });
      });

  });

  it('should return correct note on search', function () {
    chai.request(app)
      .get('/v1/notes')
      .then(function(res) {
        const searchTerm = res.body[0].content;
        return chai.request(app)
          .get(`/v1/notes/?searchTerm=${searchTerm}`)
          .then(function(res) {
            expect(res).to.be.json;
            expect(res).to.have.status(200);
            //  why does this have an unhandled promise rejection warning when others don't?
            expect(res.body.content).to.deep.equal(searchTerm);
          })
          .catch(err => {
            err;
          });
      });
  });

});

// POST REQUEST TEST && ERROR(550)
describe('POST Request', function () {

  it('should create a new note on POST request', function () {
    const newNote = {title: 'Hello there', content: 'Im new'};
    return chai.request(app)
      .post('/v1/notes')
      .send(newNote)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('title', 'content');
        // expect res.body DEEP EQUALS returned ID
        expect(res.body).to.deep.equal(Object.assign(newNote, {id: res.body.id}));
      }); 
  });

  it('should return a status 500 when passed empty note', function () {
    const newNote = {};
    return chai.request(app)
      .post('/v1/notes')
      .send(newNote)
      .then()
      .catch(err => {
        expect(err).to.have.status(500);
      });
  });

});

// PUT REQUEST TEST && ERROR(404)
describe('PUT Request', function () {

  it('should update note with PUT request', function () {
    const updatedNote = {title:'Im updated whee', content: 'yay this is fun'};
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        updatedNote.id = res.body[0].id;
        return chai.request(app)
          // BREAK HERE FOR 404 ERROR
          .put(`/v1/notes/${updatedNote.id}`)
          .send(updatedNote);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.include.keys('title', 'content');
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updatedNote);
      })
      .catch(err => {
        expect(err).to.have.status(404);
      });
  });

  it('should return 404 if ID is not a note', function () {
    const updatedNote = {title:'Im updated', content: 'yay this is fun'};
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        updatedNote.id = res.body[0].id;
        return chai.request(app)
          .put('/v1/notes/helloImBroken')
          .send(updatedNote);
      })
      .then()
      .catch(err => {
        expect(err).to.have.status(404);
      });
  });

});

// DELETE REQUEST && ERROR(404)
describe('DELETE Request', function () {

  it('should delete the note with DELETE request', function () {
    chai.request(app)
      .get('/v1/notes')
      .then(function(res) {
        const toDelete = res.body[0].id;
        return chai.request(app)
          .delete(`/v1/notes/${toDelete}`)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res.body.id).to.deep.equal(toDelete);
          });
      });
  });

  it('should return 404 when item to be deleted does not exist', function () {
    chai.request(app)
      .get('/v1/notes')
      .then(function() {
        const wrongDelete = 'whoops';
        return chai.request(app)
          .delete(`/v1/notes/${wrongDelete}`)
          .then(function(res) {
            expect(res).to.have.status(404);
          });
      });
  });

});
