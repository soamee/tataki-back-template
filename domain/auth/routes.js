const express = require('express');
const { UNAUTHORIZED } = require('http-status-codes');

const db = require('../../db');
const createAuthService = require('./service');

const authService = createAuthService({ db });

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  authService
    .login({ email, password })
    .then((user) => res.json(user))
    .catch((error) => res.status(UNAUTHORIZED).json({ message: error }));
});

module.exports = router;
