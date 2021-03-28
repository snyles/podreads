const express = require('express');
const router = express.Router();

const booksCtrl = require('../controllers/books');

router.get('/search', booksCtrl.search);






module.exports = router;