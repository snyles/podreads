const axios = require('axios');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');
const Booklist = require('../models/booklist')

module.exports = {
  search,
}

function search(req,res) {
  const q = req.query.q;
  if(q) {
    const options = {'X-ListenAPI-Key': process.env.API_KEY }
    const apiUrl = `https://listen-api.listennotes.com/api/v2/search?q=${q}`;
    axios.get(apiUrl, options)
    .then(response => {
      // console.log(response.data.results)
      res.render('podcasts/search', {
        title: 'Podcast Search',
        results: response.data.results,
        user: req.user
      })
    })
    .catch(err => { console.log(err) })
  } else {
    res.render('podcasts/search', {
      title: 'Podcast Search',
      results: null,
      user: req.user
    })
  }
}