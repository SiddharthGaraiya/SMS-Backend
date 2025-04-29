const db = require('../config/db');
const bcrypt = require('bcryptjs');


exports.getAllAdmins = (req, res) => {
    db.query('SELECT * FROM admins', (err, result) => {
        if (err) return res.status(500).send('Error fetching admins');
        res.json(result);
    });
};


exports.getAdminById = (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM admins WHERE admin_id = ?', [id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Admin not found');
        res.json(result[0]);
    });
};


exports.createAdmin = (req, res) => {
    const { admin_name, admin_email, username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const insertUser = 'INSERT INTO users (username, password, type) VALUES (?, ?, "Admin")';
    db.query(insertUser, [username, hashedPassword], (err, userResult) => {
        if (err) return res.status(500).send('Error creating user');

        const user_id = userResult.insertId;
        const insertAdmin = 'INSERT INTO admins (admin_name, admin_email, user_id) VALUES (?, ?, ?)';

        db.query(insertAdmin, [admin_name, admin_email, user_id], (err, result) => {
            if (err) return res.status(500).send('Error creating admin');
            res.status(201).send('Admin created');
        });
    });
};


exports.updateAdmin = (req, res) => {
    const { id } = req.params;
    const { admin_name, admin_email } = req.body;

    const updateAdmin = 'UPDATE admins SET admin_name = ?, admin_email = ? WHERE admin_id = ?';
    db.query(updateAdmin, [admin_name, admin_email, id], (err, result) => {
        if (err) return res.status(500).send('Error updating admin');
        res.send('Admin updated successfully');
    });
};


exports.deleteAdmin = (req, res) => {
    const { id } = req.params;
    const getUserId = 'SELECT user_id FROM admins WHERE admin_id = ?';

    db.query(getUserId, [id], (err, result) => {
        if (err || result.length === 0) return res.status(404).send('Admin not found');

        const user_id = result[0].user_id;
        const deleteUser = 'DELETE FROM users WHERE user_id = ?';

        db.query(deleteUser, [user_id], (err, result) => {
            if (err) return res.status(500).send('Error deleting admin');
            res.send('Admin deleted successfully');
        });
    });
};

exports.getAdminByUserId = (req, res) => {
    const { user_id } = req.params;

    const query = 'SELECT * FROM admins WHERE user_id = ?';

    db.query(query, [user_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching admin');
        }
        if (result.length === 0) {
            return res.status(404).send('admin not found');
        }
        res.json(result[0]); 
    });
};