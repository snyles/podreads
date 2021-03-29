const axios = require('axios');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');
const Booklist = require('../models/booklist')

module.exports = {
  search,
  addToBooklist
}

function search(req, res) {
  const q = req.query.intitle + req.query.inauthor;
  if (q) {
    const searchUrl='https://www.googleapis.com/books/v1/volumes?q=';
    axios.get(searchUrl+q)
    .then(response => {
      // console.log(response.data.items[0].volumeInfo.title);

      User.findById(req.user._id)
      .populate('booklists').exec((error, u) => {
        res.render('books/search', {
          title: "Search for Books",
          user: req.user,
          results: response.data.items,
          
          qTitle: req.query.intitle,
          qAuthor: req.query.inauthor,
          booklists: u.booklists,
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
          res.redirect('/booklists')
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
            res.redirect('/booklists')
          })
        })
      }
    })
  })
}