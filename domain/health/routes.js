const express = require('express');

const { name, version } = require('../../package.json');
const { environment } = require('../../config');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    name,
    version,
    environment,
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
  });
});

module.exports = router;
