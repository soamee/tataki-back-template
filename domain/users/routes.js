const express = require('express');

const logger = require('../../components/logger')({});
const db = require('../../db');
const createUsersService = require('./service');

const usersService = createUsersService({ db });

const { injectUser } = require('../../utils/auth');

const router = express.Router();

router.get('/me', injectUser, (req, res) => {
  const { id } = req.user;
  usersService
    .findMe({ id })
    .then((user) => res.json(user))
    .catch((err) => {
      logger.error(err);
      res.status(400).json(err);
    });
});

router.get('/:id', (req, res) => {
  usersService
    .findById({ id: req.params.id })
    .then((user) => res.json(user))
    .catch((err) => {
      logger.error(err);
      res.status(400).json(err);
    });
});

router.get('/', (req, res) => {
  const { email } = req.query;
  usersService
    .findAll({ email })
    .then((users) => res.json(users))
    .catch((err) => {
      logger.error(err);
      res.status(400).json(err);
    });
});

router.post('/', (req, res) => {
  usersService
    .create({ userToBeCreated: req.body })
    .then((user) => res.json(user))
    .catch((err) => {
      logger.error(err);
      res.status(400).json(err);
    });
});

router.put('/:id', (req, res) => {
  const {
    params: { id },
  } = req;
  const { body } = req;
  usersService
    .update(id, body)
    .then((role) => res.json(role))
    .catch((error) => {
      logger.error(error);
      res.status(400).json(error);
    });
});

module.exports = router;
