const axios = require('axios');
const unirest = require('unirest');
const mongoose = require('mongoose');

const Book = require('../models/book');
const User = require('../models/user');
const Booklist = require('../models/booklist');
const user = require('../models/user');

module.exports = {
  search,
  show,
  addPodcast,
  removePodcast,
}

function search(req,res) {
  const q = req.query.q;
  const offset = (req.query.offset) ? req.query.offset : 0;
  if(q) {
    const options = {'X-ListenAPI-Key': process.env.API_KEY }
    const apiUrl = `https://listen-api.listennotes.com/api/v2/search?q=${q}&sort_by_date=0&type=podcast&offset=${offset}&only_in=title%2Cdescription&language=English&safe_mode=0`;
    unirest.get(apiUrl).header(options)
    .then(response => {
      // console.log(response.body)
      res.render('podcasts/search', {
        title: 'Podcast Search',
        resultsTotal: response.body.total,
        resultsCount: response.body.count,
        nextOffset: response.body.next_offset,
        results: response.body.results,
        user: req.user,
        query: q,
      })
    })
    .catch(err => { console.log(err) })
  } else {
    res.render('podcasts/search', {
      title: 'Podcast Search',
      results: null,
      user: req.user,
      query: q,
    })
  }
}

function show(req, res) {
  const id = req.params.id;
  const nextDate = (req.query.offset) ? `next_episode_pub_date=${req.query.offset}&` : '';
  const options = {'X-ListenAPI-Key': process.env.API_KEY }
  const apiUrl = `https://listen-api.listennotes.com/api/v2/podcasts/${id}?${nextDate}sort=recent_first`

  unirest.get(apiUrl).header(options)
  .then(response => {
    // console.log(response.body)
    res.render('podcasts/show', {
      title: `Podcast: ${response.body.title}`,
      results: response.body,
      episodes: response.body.episodes,
      nextDate: response.body.next_episode_pub_date,
      user: req.user,
    })
  })
  .catch(err => {
    res.redirect('/podcasts/search');
  })
}

function addPodcast(req, res) {
  if(!req.user.podcasts.includes(req.params.id)) {
    req.user.podcasts.push(req.params.id)
    req.user.save()
  }
  res.redirect(`/podcasts/${req.params.id}`)
}

function removePodcast(req, res) {
  const i = req.user.podcasts.indexOf(req.params.id)
  req.user.podcasts.splice(i, 1);
  req.user.save()
  res.redirect(`/podcasts/${req.params.id}`)
}