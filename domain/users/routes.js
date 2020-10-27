const express = require('express');

const { INTERNAL_SERVER_ERROR } = require('http-status-codes');

const logger = require('../../components/logger')({});
const db = require('../../db');
const createUsersService = require('./service');

const usersService = createUsersService({ db });

const injectUser = require('../../components/middlewares/injectUser');
const isAdmin = require('../../components/middlewares/isAdmin');

const router = express.Router();

router.put('/change-password', injectUser, async (req, res) => {
  try {
    const { body, user } = req;
    const updatedUser = await usersService.changePassword({ data: body, user });
    return res.json(updatedUser);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.get('/me', injectUser, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await usersService.findMe({ id });
    return res.json(user);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersService.findById({ id });
    return res.json(user);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const users = await usersService.findAll({ email });
    return res.json(users);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const user = await usersService.create({ userToBeCreated: body });
    return res.json(user);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const user = await usersService.update({ id, body });
    return res.json(user);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteResponse = await usersService.remove({ id });
    return res.json(deleteResponse);
  } catch (err) {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json(err);
  }
});

module.exports = router;
