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
  edit,
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
  .then( (booklist) => {
    res.redirect(`/booklists/${booklist._id}`)
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
  Booklist.findByIdAndDelete(req.params.id, (err) => {
    res.redirect('/booklists')
  })
}

function edit(req,res) {
  Booklist.findById(req.params.id)
  .then( booklist => {
    res.render('booklists/edit', { 
      title: 'Edit Booklist', 
      booklist,
      user: req.user
     })
  })
}

function update(req, res) {
  Booklist.findByIdAndUpdate(req.params.id, req.body)
  .then( booklist => 
    res.redirect(`/booklists/${booklist._id}`)
  )
}