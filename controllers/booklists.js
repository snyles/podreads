const axios = require('axios');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');
const Booklist = require('../models/booklist');

module.exports = {
  index,
  create,
  show,
  delete: deleteBooklist,
  update
}

function index(req, res) {
  Booklist.find({ ownerId: req.user._id})
  .populate('books').exec((err, booklists) => {
    res.render('booklists/index', {
      title: 'Booklists',
      user: req.user,
      booklists
    })
  })
}

function create(req, res) {
  req.body.ownerId = req.user._id
  Booklist.create(req.body)
  .then( () => {
    res.redirect('/booklists')
  })
}

function show(req, res) {
  Booklist.findById(req.params.id)
  .populate('books').exec((err, booklist) => {
    res.render('booklists/show', {
      title: booklist.name,
      user: req.user,
      booklist
    })
  })
}

function deleteBooklist(req, res) {
  Booklist.findByIdAndDelete(req.params.id, (err, booklist) => {
    res.redirect('/booklists')
  })
}

function update(req, res) {

}