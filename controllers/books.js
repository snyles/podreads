const axios = require('axios');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');

module.exports = {
  search,
  index,
  addToBooklist
}

function index(req,res) {
  req.user
  .populate('books').exec((err, booklists))
}


//   Book.find( { collectedBy: req.user._id })
//   .then(books => {
//     res.render('books/index', {
//       title: 'My Books',
//       user: req.user,
//       books
//     })
//   })
// }

function search(req, res) {
  const q = req.query.intitle + req.query.inauthor;

  if (q) {
    const searchUrl='https://www.googleapis.com/books/v1/volumes?q=';
    axios.get(searchUrl+q)
    .then(response => {
      // console.log(response.data.items[0].volumeInfo.title);
      res.render('books/search', {
        title: "Search for Books",
        user: req.user,
        results: response.data.items,

        qTitle: req.query.intitle,
        qAuthor: req.query.inauthor,
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
      user: req.user,
      title: "Search for Books",
    })
  }
}

function addToBooklist(req, res) {
  req.body.collectedBy = req.user._id;
  Book.findOne({ googleId: req.body.googleId})
  .then(book => {
    if(book) {
      book.collectedBy.push(req.user._id);
      book.save()
    } else {
      Book.create(req.body)
    }
  req.user.booklists[0].books.push(book)
  req.user.save()
    .then( () => {
      const q = `intitle=${req.body.qTitle}&inauthor=${req.body.qAuthor}`
      res.redirect(`/books/search?${q}`)
   })
  })
}