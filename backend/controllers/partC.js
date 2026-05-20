const db = require('../database');

exports.addPart = (req, res) => {
    const { car_id, part_name, cost, installed_date } = req.body;
    const userId = req.user.id;

    db.get('SELECT id FROM Cars WHERE id = ? AND user_id = ?', [car_id, userId], (err, car) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!car) return res.status(403).json({ error: 'This vehicle does not belong to you or was not found.' });

        db.run('INSERT INTO Parts (car_id, part_name, cost, installed_date) VALUES (?, ?, ?, ?)',
            [car_id, part_name, cost, installed_date],
            function(err) {
                if (err) return res.status(500).json({ error: 'An error occurred while adding the part.' });
                res.status(201).json({ message: 'Part successfully added!', partId: this.lastID });
            }
        );
    });
};

exports.getParts = (req, res) => {
    const carId = req.params.carId;
    const userId = req.user.id;

    db.get('SELECT id FROM Cars WHERE id = ? AND user_id = ?', [carId, userId], (err, car) => {
        if (err) return res.status(500).json({ error: 'Database error.' });
        if (!car) return res.status(403).json({ error: 'This vehicle does not belong to you.' });

        db.all('SELECT * FROM Parts WHERE car_id = ?', [carId], (err, rows) => {
            if (err) return res.status(500).json({ error: 'An error occurred while fetching parts.' });
            res.json(rows);
        });
    });
};