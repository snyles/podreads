const express = require('express');
const router = express.Router();

const podcastsCtrl = require('../controllers/podcasts');

// router.get('/', isLoggedIn, podcastsCtrl.index);
router.get('/', isLoggedIn , podcastsCtrl.index )
router.get('/search', isLoggedIn, podcastsCtrl.search)
router.get('/:id', isLoggedIn, podcastsCtrl.show )
router.post('/', isLoggedIn, podcastsCtrl.create )
router.delete('/:id', isLoggedIn, podcastsCtrl.delete )


// router.post('/', isLoggedIn, podcastsCtrl.create);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;