import sqlite3 from 'sqlite3';
import { unlink } from 'fs';

// This is a placeholder - to be used only if more advanced state is required.

const dbPath = '/bin/node-teslausb/db.db';
let db;

export function createDb() {
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Connected to the database.');
            db.run(`CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY,
        item TEXT,
        itemType TEXT,
        copyStarted DATETIME,
        copyFinished DATETIME
      )`);
        }
    });
}

export function removeDb() {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Closed the database connection.');
            unlink(dbPath, (err) => {
                if (err) console.error('Error deleting database file:', err);
                else console.log('Database file deleted.');
            });
        }
    });
}

export function addItem(item, itemType, copyStarted, copyFinished) {
    const sql = `INSERT INTO items (item, itemType, copyStarted, copyFinished) VALUES (?, ?, ?, ?)`;
    db.run(sql, [item, itemType, copyStarted, copyFinished], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        }
    });
}

export function getItem(id, callback) {
    const sql = `SELECT * FROM items WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

export function updateItem(id, item, itemType, copyStarted, copyFinished) {
    const sql = `UPDATE items SET item = ?, itemType = ?, copyStarted = ?, copyFinished = ? WHERE id = ?`;
    db.run(sql, [item, itemType, copyStarted, copyFinished, id], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Row(s) updated: ${this.changes}`);
        }
    });
}

export function deleteItem(id) {
    const sql = `DELETE FROM items WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Row(s) deleted: ${this.changes}`);
        }
    });
}

export function queryItem(query, params, callback) {
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err.message);
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}
