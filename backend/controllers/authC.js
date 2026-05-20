const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'garage_gizli_anahtar'; 

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run('INSERT INTO Users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
            if (err) {
                return res.status(400).json({ error: 'This username is already taken.' });
            }
            res.status(201).json({ message: 'Registration successful!', userId: this.lastID });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error.' });
    }
};

exports.login = (req, res) => {
    const { username, password } = req.body;
    
    db.get('SELECT * FROM Users WHERE username = ?', [username], async (err, user) => {
        if (err || !user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Incorrect password.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '2h' });
        res.json({ message: 'Login successful!', token });
    });
};