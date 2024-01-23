import sqlite3 from 'sqlite3';
import { unlink } from 'fs';

export interface DatabaseItem {
    id?: number;
    item: string;
    itemType: 'folder';
    modifiedDate?: Date;
    size?: number;
    copyStarted: boolean;
    copyFinished: boolean;
}

export class DatabaseManager {
    private db: sqlite3.Database;

    constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Connected to the database.');
            }
        });
    }

    public initializeDb(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                this.db.run(`CREATE TABLE IF NOT EXISTS items (
                    id INTEGER PRIMARY KEY,
                    item TEXT,
                    itemType TEXT,
                    modifiedDate DATETIME,
                    size INTEGER,
                    copyStarted BOOLEAN,
                    copyFinished BOOLEAN
                )`, (tableErr) => {
                    if (tableErr) {
                        console.error('Error creating items table', tableErr.message);
                        reject(tableErr);
                        return;
                    }

                    this.db.run(`CREATE INDEX IF NOT EXISTS idx_items_item ON items(item)`, (indexErr) => {
                        if (indexErr) {
                            console.error('Error creating index on `item`', indexErr.message);
                            reject(indexErr);
                        } else {
                            console.log('Index on column `item` created.');
                            resolve();
                        }
                    });
                });
            });
        });
    }

    public closeAndRemoveDb(dbPath: string) {
        this.db.close((err) => {
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

    public addItem(itemData: DatabaseItem) {
        const sql = `INSERT INTO items (item, itemType, modifiedDate, size, copyStarted, copyFinished) VALUES (?, ?, ?, ?, ?, ?)`;
        const { item, itemType, modifiedDate, size, copyStarted, copyFinished } = itemData;

        this.db.run(sql, [item, itemType, modifiedDate, size, copyStarted, copyFinished], function (err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`A row has been inserted with rowid ${this.lastID}`);
            }
        });
    }

    public getItem(id: number): Promise<DatabaseItem | null> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM items WHERE id = ?`;
            this.db.get(sql, [id], (err, row: DatabaseItem) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        // Assuming row contains the fields matching the Item interface
                        const item: DatabaseItem = {
                            id: row.id,
                            item: row.item,
                            itemType: row.itemType,
                            modifiedDate: row.modifiedDate ? new Date(row.modifiedDate) : new Date(), // Use default value if modifiedDate is undefined
                            size: row.size,
                            copyStarted: Boolean(row.copyStarted), // Convert to boolean
                            copyFinished: Boolean(row.copyFinished), // Convert to boolean
                        };
                        resolve(item);
                    } else {
                        resolve(null); // No item found
                    }
                }
            });
        });
    }

    public updateItem(id: number, itemData: DatabaseItem) {
        const sql = `UPDATE items SET item = ?, itemType = ?, modifiedDate = ?, size = ?, copyStarted = ?, copyFinished = ? WHERE id = ?`;
        const { item, itemType, modifiedDate, size, copyStarted, copyFinished } = itemData;
        
        this.db.run(sql, [item, itemType, modifiedDate, size, copyStarted, copyFinished, id], function (err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Row(s) updated: ${this.changes}`);
            }
        });
    }

    public deleteItem(id: number) {
        const sql = `DELETE FROM items WHERE id = ?`;
        this.db.run(sql, [id], function (err) {
            if (err) {
                console.error(err.message);
            } else {
                console.log(`Row(s) deleted: ${this.changes}`);
            }
        });
    }

    public queryItem(propertyName: keyof DatabaseItem, propertyValue: any): Promise<DatabaseItem[]> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM items WHERE ${propertyName} = ?`;
            this.db.all(sql, [propertyValue], (err, rows: DatabaseItem[]) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    // Map each row to an Item object
                    const items: DatabaseItem[] = rows.map(row => ({
                        id: row.id,
                        item: row.item,
                        itemType: row.itemType,
                        modifiedDate: row.modifiedDate ? new Date(row.modifiedDate) : new Date(), // Use default value if modifiedDate is undefined
                        size: row.size,
                        copyStarted: Boolean(row.copyStarted),
                        copyFinished: Boolean(row.copyFinished)
                    }));
                    resolve(items);
                }
            });
        });
    }

    public getItemByProperty(propertyName: keyof DatabaseItem, propertyValue: any): Promise<DatabaseItem | null> {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM items WHERE ${propertyName} = ?`;
            this.db.get(sql, [propertyValue], (err, row: DatabaseItem) => {
                if (err) {
                    console.error(err.message);
                    reject(err);
                } else {
                    if (row) {
                        const item: DatabaseItem = {
                            id: row.id,
                            item: row.item,
                            itemType: row.itemType,
                            modifiedDate: row.modifiedDate ? new Date(row.modifiedDate) : new Date(), // Use default value if modifiedDate is undefined
                            size: row.size,
                            copyStarted: Boolean(row.copyStarted), // Assuming stored as integers
                            copyFinished: Boolean(row.copyFinished)
                        };
                        resolve(item);
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }
}

export default DatabaseManager;
