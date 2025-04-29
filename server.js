const express = require('express');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use(express.json());
app.use(cors({
  origin: 'https://sms-frontend-nine.vercel.app/',
  credentials: true,                        
}));
app.use('/login', authRoutes);
app.use('/admins', adminRoutes);
app.use('/students', studentRoutes);

const createDefaultAdmin = () => {
    const checkAdmin = 'SELECT * FROM users WHERE type = "Admin"';
    db.query(checkAdmin, (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            const hashedPassword = bcrypt.hashSync('admin123', 10);
            const insertUser = 'INSERT INTO users (username, password, type) VALUES ("admin", ?, "Admin")';
            db.query(insertUser, [hashedPassword], (err, userResult) => {
                if (err) throw err;
                const user_id = userResult.insertId;
                const insertAdmin = 'INSERT INTO admins (admin_name, admin_email, user_id) VALUES ("Default Admin", "admin@example.com", ?)';
                db.query(insertAdmin, [user_id], (err, result) => {
                    if (err) throw err;
                    console.log('Default Admin Created Successfully');
                });
            });
        }
    });
};

createDefaultAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
