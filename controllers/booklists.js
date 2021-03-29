const axios = require('axios');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');
const Booklist = require('../models/booklist');
const { response } = require('express');

module.exports = {
  index
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