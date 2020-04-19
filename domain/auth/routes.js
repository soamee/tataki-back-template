const express = require('express');

const db = require('../../db');
const createAuthService = require('./service');

const authService = createAuthService({ db });

const router = express.Router();

router.post('/login', (req, res) => {
  authService
    .login(req.body)
    .then((user) => res.json(user))
    .catch((error) => res.status(401).json({ message: error }));
});

module.exports = router;
