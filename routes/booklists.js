const express = require('express');
const router = express.Router();

const booklistsCtrl = require('../controllers/booklists');

router.get('/', isLoggedIn, booklistsCtrl.index);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;