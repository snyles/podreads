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
  create,
  delete: deletePodcast,
  index,
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
      podcast: response.body,
      episodes: response.body.episodes,
      nextDate: response.body.next_episode_pub_date,
      user: req.user,
    })
  })
  .catch(err => {
    res.redirect('/podcasts/search');
  })
}

function create(req, res) {
  if(!req.user.podcasts.some( podcast => podcast.podcastId === req.body.id)) {
    req.user.podcasts.push(req.body)
    req.user.save()
  }
  res.redirect(`/podcasts/${req.body.podcastId}`)
}

function deletePodcast(req, res) {
  const idx = req.user.podcasts.findIndex( podcast => podcast.podcastId === req.params.id)
  req.user.podcasts.splice(idx, 1);
  req.user.save()
  res.redirect(`/podcasts/${req.params.id}`)
}

function index(req,res) {
  res.render('podcasts/index', {
    title: 'My Followed Podcasts',
    podcasts: req.user.podcasts,
    user: req.user
  })
}