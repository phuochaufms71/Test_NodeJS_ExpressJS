const express = require("express");
const { getItems, getItemById, getItemsPagination, createNewItem, updateItem, deleteItem } = require("../controller/itemController");
const { checkAccessToken, checkRoleAdmin } = require("../middleware/auth");
const itemRoute = express.Router();

itemRoute.get('/', checkAccessToken, getItems)
itemRoute.get('/:id', checkAccessToken, getItemById)
itemRoute.get('/pagination', checkAccessToken, getItemsPagination)

itemRoute.post('/', checkAccessToken, checkRoleAdmin, createNewItem)

itemRoute.put('/:id', checkAccessToken, checkRoleAdmin, updateItem)

itemRoute.delete('/:id', checkAccessToken, checkRoleAdmin, deleteItem)

module.exports = itemRoute;