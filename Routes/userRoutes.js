const express = require('express');
const router = express.Router();
const userControllers = require('D:/complete-node-bootcamp-master/4-natours/starter/Controllers/userControllers.js');
router
  .route('/')
  .get(userControllers.allUsers)
  .post(userControllers.createUser);
router
  .route('/:id')
  .get(userControllers.getUser)
  .patch(userControllers.updateUser)
  .delete(userControllers.deleteUser);
module.exports = router;
