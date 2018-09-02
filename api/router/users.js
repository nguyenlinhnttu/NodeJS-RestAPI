const express = require('express');
const router = express.Router();
const UserControler = require('../controllers/users')
const checkAuth = require('../middleware/check-auth')

router.post('/signup',UserControler.register_account)

router.post('/login',UserControler.login_account)

router.delete('/:userId',checkAuth, UserControler.delete_account)

module.exports = router;