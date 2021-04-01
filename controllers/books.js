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
  let q = '';
  console.log("req.query", req.query);
  if(Object.keys(req.query).length !== 0) {
    console.log(req.query.intitle);
    if(req.query.intitle !== '') {
      q = req.query.intitle;
      if(req.query.inauthor) {
        q += `+inauthor:${req.query.inauthor}`
      }
    } else {
      q = `inauthor:${req.query.inauthor}`
    }
    q = q.replace(' ','+')
  }
  if (q) {
    const offset = (req.query.offset) ? req.query.offset : 0;
    const searchUrl=`https://www.googleapis.com/books/v1/volumes?startIndex=${offset}&q=`;
    axios.get(searchUrl+q)
    .then(response => {
      // console.log(response.body);
      Booklist.find({ownerId: req.user._id })
      .then(booklists => { 
        res.render('books/search', {
          title: "Search for Books",
          user: req.user,
          results: response.data.items,
          qTitle: req.query.intitle,
          qAuthor: req.query.inauthor,
          query: q,
          booklists: booklists,
          nextOffset: parseInt(offset) + 10,
          resultsTotal: response.data.totalItems,
        })
      })
    })
    .catch (error => {
      console.log(error);
      res.redirect('/books');
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
          res.redirect(`/booklists/${booklist._id}`)
        })
      } else {
        req.body.collectedBy = req.user._id;
        Book.create(req.body)
        .then(book => {
          booklist.books.push(book._id)
          booklist.save()
          .then( () => {
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