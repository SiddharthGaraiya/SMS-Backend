const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.get('/', studentController.getAllStudents);
router.get('/:id', studentController.getStudentById);
router.put('/', studentController.createStudent);
router.post('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/userid/:user_id',studentController.getStudentByUserId);
module.exports = router;
