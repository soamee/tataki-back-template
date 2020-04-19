const express = require('express');

const logger = require('../../components/logger')({});
const db = require('../../db');
const createRolesService = require('./service');

const rolesService = createRolesService({ db });

const router = express.Router();

router.post('/', (req, res) => {
  const { body } = req;
  rolesService
    .create(body)
    .then((role) => res.json(role))
    .catch((error) => {
      logger.error(error);
      res.status(400).json(error);
    });
});

router.put('/:id', (req, res) => {
  const {
    params: { id },
  } = req;
  const { body } = req;
  rolesService
    .update(id, body)
    .then((role) => res.json(role))
    .catch((error) => {
      logger.error(error);
      res.status(400).json(error);
    });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  rolesService.remove(id).then((deletedRole) => res.json(deletedRole));
});

module.exports = router;
