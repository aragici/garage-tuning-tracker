const db = require('../database');

exports.addCar = (req, res) => {
    const { brand, model, year } = req.body;
    const userId = req.user.id; 

    db.run('INSERT INTO Cars (user_id, brand, model, year) VALUES (?, ?, ?, ?)',
        [userId, brand, model, year],
        function(err) {
            if (err) return res.status(500).json({ error: 'An error occurred while adding the vehicle.' });
            res.status(201).json({ message: 'Vehicle added to garage!', carId: this.lastID });
        }
    );
};

exports.getMyCars = (req, res) => {
    const userId = req.user.id;

    db.all('SELECT * FROM Cars WHERE user_id = ?', [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'An error occurred while fetching vehicles.' });
        res.json(rows);
    });
};

exports.updateCar = (req, res) => {
    const { brand, model, year } = req.body;
    const carId = req.params.id;
    const userId = req.user.id;

    db.run('UPDATE Cars SET brand = ?, model = ?, year = ? WHERE id = ? AND user_id = ?',
        [brand, model, year, carId, userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'An error occurred while updating the vehicle.' });
            if (this.changes === 0) return res.status(404).json({ error: 'Vehicle not found or does not belong to you.' });
            res.json({ message: 'Vehicle successfully updated!' });
        }
    );
};

exports.deleteCar = (req, res) => {
    const carId = req.params.id;
    const userId = req.user.id;

    db.run('DELETE FROM Cars WHERE id = ? AND user_id = ?',
        [carId, userId],
        function(err) {
            if (err) return res.status(500).json({ error: 'An error occurred while deleting the vehicle.' });
            if (this.changes === 0) return res.status(404).json({ error: 'Vehicle not found or does not belong to you.' });
            res.json({ message: 'Vehicle removed from garage!' });
        }
    );
};