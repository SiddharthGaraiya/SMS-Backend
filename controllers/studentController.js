const db = require('../config/db');
const bcrypt = require('bcryptjs');


exports.getAllStudents = (req, res) => {
    db.query('SELECT * FROM students', (err, result) => {
        if (err) return res.status(500).send('Error fetching students');
        res.json(result);
    });
};


exports.getStudentById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM students WHERE student_id = ?', [id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Student not found');
        res.json(result[0]);
    });
};


exports.createStudent = (req, res) => {
    const { student_name, student_dob, student_gender, student_email, student_phone, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const insertUser = 'INSERT INTO users (username, password, type) VALUES (?, ?, "Student")';
    db.query(insertUser, [username, hashedPassword], (err, userResult) => {
        if (err) return res.status(500).send('Error creating user');

        const user_id = userResult.insertId;
        const insertStudent = 'INSERT INTO students (student_name, student_dob, student_gender, student_email, student_phone, user_id) VALUES (?, ?, ?, ?, ?, ?)';

        db.query(insertStudent, [student_name, student_dob, student_gender, student_email, student_phone, user_id], (err, result) => {
            if (err) return res.status(500).send('Error creating student');
            res.status(201).send('Student created');
        });
    });
};


exports.updateStudent = (req, res) => {
    const { id } = req.params;
    const { student_name, student_dob, student_gender, student_email, student_phone } = req.body;
    
    const updateStudent = 'UPDATE students SET student_name = ?, student_dob = ?, student_gender = ?, student_email = ?, student_phone = ? WHERE student_id = ?';
    db.query(updateStudent, [student_name, student_dob, student_gender, student_email, student_phone, id], (err, result) => {
        if (err) return res.status(500).send('Error updating student');
        res.send('Student updated successfully');
    });
};


exports.deleteStudent = (req, res) => {
    const { id } = req.params;
    const getUserId = 'SELECT user_id FROM students WHERE student_id = ?';

    db.query(getUserId, [id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Student not found');

        const user_id = result[0].user_id;
        const deleteUser = 'DELETE FROM users WHERE user_id = ?';
        
        db.query(deleteUser, [user_id], (err, result) => {
            if (err) return res.status(500).send('Error deleting student');
            res.send('Student deleted successfully');
        });
    });
};


exports.getStudentByUserId = (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT * FROM students WHERE user_id = ?';

    db.query(query, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching student');
        }
        if (result.length === 0) {
            return res.status(404).send('Student not found');
        }
        res.json(result[0]); 
    });
};

