const { default: axios } = require('axios');
const mongoose = require('mongoose');

module.exports = {
  search
}


function search(req, res) {
  const q = req.query.q;
  if (q) {
    const searchUrl='https://www.googleapis.com/books/v1/volumes?q=';
    axios.get(searchUrl+q)
    .then(response => {
      // console.log(response.data.items[0].volumeInfo.title);
      res.render('books/search', {
        results: response.data.items,
        user: req.user,
        title: "Search Books",
        query: q,
      })
    })
    .catch (error => {
      console.log(error);
    })
  }
  else {
    res.render('books/search', {
      results: null,
      query: null,
      user: req.user,
      title: "Search Books",
    })
  }
}