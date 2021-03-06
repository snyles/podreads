const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');

router.get('/', isLoggedIn, booksCtrl.search);
router.post('/', isLoggedIn, booksCtrl.addToBooklist);
router.delete('/:id', isLoggedIn, booksCtrl.removeFromBooklist);


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google");
}

module.exports = router;