const express = require('express');

const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

const logger = require('../../components/logger')({});
const db = require('../../db');
const createUsersService = require('./service');

const usersService = createUsersService({ db });

const injectUser = require('../../components/middlewares/injectUser');
const isAdmin = require('../../components/middlewares/isAdmin');

const router = express.Router();

router.put('/change-password', injectUser, (req, res) => {
  const { body, user } = req;
  usersService
    .changePassword({ data: body, user })
    .then((result) => res.json(result))
    .catch((err) => {
      logger.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    });
});

router.get('/me', injectUser, (req, res) => {
  const { id } = req.user;
  usersService
    .findMe({ id })
    .then((user) => res.json(user))
    .catch((err) => {
      logger.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    });
});

router.get('/:id', (req, res) => {
  usersService
    .findById({ id: req.params.id })
    .then((user) => res.json(user))
    .catch((err) => {
      logger.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    });
});

router.get('/', (req, res) => {
  const { email } = req.query;
  usersService
    .findAll({ email })
    .then((users) => res.json(users))
    .catch((err) => {
      logger.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    });
});

router.post('/', (req, res) => {
  usersService
    .create({ userToBeCreated: req.body })
    .then((user) => res.json(user))
    .catch((err) => {
      logger.error(err);
      res.status(INTERNAL_SERVER_ERROR).json(err);
    });
});

router.put('/:id', (req, res) => {
  const {
    params: { id },
  } = req;
  const { body } = req;
  usersService
    .update(id, body)
    .then((user) => res.json(user))
    .catch((error) => {
      logger.error(error);
      res.status(INTERNAL_SERVER_ERROR).json(error);
    });
});

router.delete('/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  usersService
    .remove({ id })
    .then((deleteResponse) => res.json(deleteResponse))
    .catch((err) => res.status(INTERNAL_SERVER_ERROR).json(err));
});

module.exports = router;
