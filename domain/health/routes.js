const express = require('express');

const { name, version } = require('../../package.json');

const { ENVIRONMENT } = require('../../config');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name,
    version,
    environment: ENVIRONMENT,
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  });
});

module.exports = router;
