const axios = require('axios');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');
const Booklist = require('../models/booklist')

module.exports = {
  search,
  addToBooklist,
  removeFromBooklist,
}

function search(req, res) {
  const q = req.query.intitle + req.query.inauthor;
  if (q) {
    const searchUrl='https://www.googleapis.com/books/v1/volumes?q=';
    axios.get(searchUrl+q)
    .then(response => {
      Booklist.find({ownerId: req.user._id })
      .then(booklists => { 
        res.render('books/search', {
          title: "Search for Books",
          user: req.user,
          results: response.data.items,
          qTitle: req.query.intitle,
          qAuthor: req.query.inauthor,
          booklists: booklists,
        })
      })
    })
    .catch (error => {
      console.log(error);
      res.redirect('/books/search');
    })
  }
  else {
    res.render('books/search', {
      results: null,
      query: null,
      qTitle: null,
      qAuthor: null,
      booklists: null,
      user: req.user,
      title: "Search for Books",
    })
  }
}

function addToBooklist(req, res) {
  Booklist.findById(req.body.booklistSelect)
  .then(booklist => {
    Book.findOne({ googleId: req.body.googleId})
    .then(book => {
      if(book) {
        if (!book.collectedBy.includes(req.user._id)) {
          book.collectedBy.push(req.user._id);
        }
        book.save()
        booklist.books.push(book._id)
        booklist.save()
        .then( () => {
          // const q = `intitle=${req.body.qTitle}&inauthor=${req.body.qAuthor}`
          // res.redirect(`/books/?${q}`)
          res.redirect(`/booklists/${booklist._id}`)
        })
      } else {
        req.body.collectedBy = req.user._id;
        Book.create(req.body)
        .then(book => {
          booklist.books.push(book._id)
          booklist.save()
          .then( () => {
            // const q = `intitle=${req.body.qTitle}&inauthor=${req.body.qAuthor}`
            // res.redirect(`/books/?${q}`)
          res.redirect(`/booklists/${booklist._id}`)
          })
        })
      }
    })
  })
}

function removeFromBooklist(req,res) {
  Booklist.findById(req.body.booklistId)
  .then(booklist => {
    const idx = booklist.books.indexOf(req.params.id);
    booklist.books.splice(idx, 1)
    booklist.save()
    .then(
      res.redirect('/booklists'))
  })
}