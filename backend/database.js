const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'garage.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        brand TEXT,
        model TEXT,
        year INTEGER,
        FOREIGN KEY (user_id) REFERENCES Users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER,
        part_name TEXT,
        cost REAL,
        installed_date TEXT,
        FOREIGN KEY (car_id) REFERENCES Cars(id)
    )`);
});

module.exports = db;