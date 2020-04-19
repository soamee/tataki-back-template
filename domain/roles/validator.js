const Joi = require('@hapi/joi');

const createSchema = Joi.object().keys({
  userId: Joi.number(),
  isAllowedForEntitiesShow: Joi.boolean(),
  isAllowedForEntitiesEdit: Joi.boolean(),
  isAllowedForCatalogShow: Joi.boolean(),
  isAllowedForCatalogEdit: Joi.boolean(),
  isAllowedForEntitiesCreate: Joi.boolean(),
  isAllowedForUsersShow: Joi.boolean(),
  isAllowedForUsersCreate: Joi.boolean(),
  isAllowedForOrdersShow: Joi.boolean(),
  isAllowedForOrdersEdit: Joi.boolean(),
  isAllowedForProviderOrdersShow: Joi.boolean(),
  isAllowedForProviderOrdersEdit: Joi.boolean(),
  isAllowedForDeliveryNotesShow: Joi.boolean(),
  isAllowedForDeliveryNotesEdit: Joi.boolean(),
  isAllowedForDeliveryNotesAmazonShow: Joi.boolean(),
  isAllowedForDeliveryNotesAmazonEdit: Joi.boolean(),
  isAllowedForLocationsShow: Joi.boolean(),
  isAllowedForLocationsEdit: Joi.boolean(),
  isAllowedForLocationsCreate: Joi.boolean(),
});

const createValidator = (role) => Joi.validate(role, createSchema);

const updateSchema = Joi.object().keys({
  password: Joi.string().allow(''),
  isAllowedForEntitiesShow: Joi.boolean(),
  isAllowedForEntitiesEdit: Joi.boolean(),
  isAllowedForCatalogShow: Joi.boolean(),
  isAllowedForCatalogEdit: Joi.boolean(),
  isAllowedForEntitiesCreate: Joi.boolean(),
  isAllowedForUsersShow: Joi.boolean(),
  isAllowedForUsersCreate: Joi.boolean(),
  isAllowedForOrdersShow: Joi.boolean(),
  isAllowedForOrdersEdit: Joi.boolean(),
  isAllowedForProviderOrdersShow: Joi.boolean(),
  isAllowedForProviderOrdersEdit: Joi.boolean(),
  isAllowedForDeliveryNotesShow: Joi.boolean(),
  isAllowedForDeliveryNotesEdit: Joi.boolean(),
  isAllowedForDeliveryNotesAmazonShow: Joi.boolean(),
  isAllowedForDeliveryNotesAmazonEdit: Joi.boolean(),
  isAllowedForLocationsShow: Joi.boolean(),
  isAllowedForLocationsEdit: Joi.boolean(),
  isAllowedForLocationsCreate: Joi.boolean(),
});

const updateValidator = (role) => Joi.validate(role, updateSchema);

module.exports = {
  createValidator,
  updateValidator,
};
