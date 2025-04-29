const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAllAdmins);
router.get('/:id', adminController.getAdminById);
router.put('/', adminController.createAdmin);
router.post('/:id', adminController.updateAdmin);
router.delete('/:id', adminController.deleteAdmin);
router.get('/userid/:user_id', adminController.getAdminByUserId);

module.exports = router;
