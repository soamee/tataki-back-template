const express = require('express');
const { UNAUTHORIZED } = require('http-status-codes');

const db = require('../../db');
const createAuthService = require('./service');

const authService = createAuthService({ db });

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    return res.json(user);
  } catch (err) {
    return res.status(UNAUTHORIZED).json({ message: err });
  }
});

module.exports = router;
