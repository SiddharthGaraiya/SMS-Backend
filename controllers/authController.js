const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.login = (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, result) => {
        if (err || result.length === 0) return res.status(401).send('Invalid credentials');

        const user = result[0];
        const validPass = bcrypt.compareSync(password, user.password);

        if (!validPass) return res.status(401).send('Invalid credentials');

        res.json({
            user_id: user.user_id,
            username: user.username,
            type: user.type
        });
    });
};
