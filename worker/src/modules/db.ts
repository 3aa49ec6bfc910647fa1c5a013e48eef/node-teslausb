import Database from 'better-sqlite3';
import type BetterSqlite3 from 'better-sqlite3';
import { unlink } from 'fs';

export interface DatabaseInputItem {
    item: string;
    itemType: 'folder';
    itemModifiedDate?: Date;
    itemSize?: number;
    copyStarted: boolean;
    copyFinished: boolean;
}

export interface DatabaseItem extends DatabaseInputItem {
    id: number;
    recordCreated: Date;
}

export class DatabaseManager {
    private db: BetterSqlite3.Database;

    constructor(dbPath: string) {
        this.db = new Database(dbPath);
    }

    public initializeDb(): void {
        try {
            this.db.exec(`CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY,
                recordCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
                item TEXT,
                itemType TEXT,
                itemModifiedDate DATETIME,
                itemSize INTEGER,
                copyStarted BOOLEAN,
                copyFinished BOOLEAN
            )`);
            console.log('Table created or already exists.');

            this.db.exec(`CREATE INDEX IF NOT EXISTS idx_items_item ON items(item)`);
            console.log('Index on column `item` created or already exists.');
        } catch (err) {
            console.error(err);
        }
    }

    public closeAndRemoveDb(dbPath: string): void {
        try {
            this.db.close();
            console.log('Closed the database connection.');

            unlink(dbPath, (err) => {
                if (err) console.error('Error deleting database file:', err);
                else console.log('Database file deleted.');
            });
        } catch (err) {
            console.error(err);
        }
    }

    public addItem(itemData: DatabaseInputItem): void {
        const sql = `INSERT INTO items (item, itemType, itemModifiedDate, itemSize, copyStarted, copyFinished) VALUES (?, ?, ?, ?, ?, ?)`;
        const { item, itemType, itemModifiedDate, itemSize, copyStarted, copyFinished } = itemData;

        try {
            const stmt = this.db.prepare(sql);
            const info = stmt.run(item, itemType, itemModifiedDate, itemSize, copyStarted, copyFinished);
            console.log(`A row has been inserted with rowid ${info.lastInsertRowid}`);
        } catch (err) {
            console.error(err);
        }
    }

    public getItem(id: number): DatabaseItem | null {
        const sql = `SELECT * FROM items WHERE id = ?`;
        try {
            const stmt = this.db.prepare(sql);
            const row = stmt.get(id) as DatabaseItem;

            if (row) {
                const item: DatabaseItem = {
                    id: row.id,
                    recordCreated: new Date(row.recordCreated),
                    item: row.item,
                    itemType: row.itemType,
                    itemModifiedDate: row.itemModifiedDate ? new Date(row.itemModifiedDate) : undefined, // Use null if itemModifiedDate is undefined
                    itemSize: row.itemSize,
                    copyStarted: Boolean(row.copyStarted), // Convert to boolean
                    copyFinished: Boolean(row.copyFinished), // Convert to boolean
                };
                return item;
            }
            return null; // No item found
        } catch (err) {
            console.error(err);
            return null; // Return null in case of error
        }
    }

    public updateItem(id: number, itemData: DatabaseItem): void {
        const sql = `UPDATE items SET item = ?, itemType = ?, itemModifiedDate = ?, itemSize = ?, copyStarted = ?, copyFinished = ? WHERE id = ?`;
        const { item, itemType, itemModifiedDate, itemSize, copyStarted, copyFinished } = itemData;

        try {
            const stmt = this.db.prepare(sql);
            const info = stmt.run(item, itemType, itemModifiedDate, itemSize, copyStarted, copyFinished, id);
            console.log(`Row(s) updated: ${info.changes}`);
        } catch (err) {
            console.error(err);
        }
    }

    public deleteItem(id: number): void {
        const sql = `DELETE FROM items WHERE id = ?`;
        try {
            const stmt = this.db.prepare(sql);
            const info = stmt.run(id);
            console.log(`Row(s) deleted: ${info.changes}`);
        } catch (err) {
            console.error(err);
        }
    }

    public queryItem(propertyName: keyof DatabaseItem, propertyValue: any): DatabaseItem[] {
        const sql = `SELECT * FROM items WHERE ${propertyName} = ?`;
        try {
            const stmt = this.db.prepare(sql);
            const rows = stmt.all(propertyValue) as DatabaseItem[];

            const items: DatabaseItem[] = rows.map(row => ({
                id: row.id,
                recordCreated: new Date(row.recordCreated),
                item: row.item,
                itemType: row.itemType,
                itemModifiedDate: row.itemModifiedDate ? new Date(row.itemModifiedDate) : undefined, // Use null if itemModifiedDate is undefined
                itemSize: row.itemSize,
                copyStarted: Boolean(row.copyStarted),
                copyFinished: Boolean(row.copyFinished)
            }));
            return items;
        } catch (err) {
            console.error(err);
            return []; // Return empty array in case of error
        }
    }

    public getItemByProperty(propertyName: keyof DatabaseItem, propertyValue: any): DatabaseItem | null {
        const sql = `SELECT * FROM items WHERE ${propertyName} = ?`;
        try {
            const stmt = this.db.prepare(sql);
            const row = stmt.get(propertyValue) as DatabaseItem;

            if (row) {
                const item: DatabaseItem = {
                    id: row.id,
                    recordCreated: new Date(row.recordCreated),
                    item: row.item,
                    itemType: row.itemType,
                    itemModifiedDate: row.itemModifiedDate ? new Date(row.itemModifiedDate) : undefined, // Use null if itemModifiedDate is undefined
                    itemSize: row.itemSize,
                    copyStarted: Boolean(row.copyStarted),
                    copyFinished: Boolean(row.copyFinished)
                };
                return item;
            }
            return null; // No item found
        } catch (err) {
            console.error(err);
            return null; // Return null in case of error
        }
    }
}

export default DatabaseManager;
