import { DatabaseManager } from './modules/db.js';

const db = new DatabaseManager("/Users/blake/db.sqlite3");
await db.initializeDb();

// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("test21322132", "folder", new Date(), 123, false, false);
// db.addItem("blake", "folder", new Date(), 123, false, false);

let item = await db.queryItem("item", "test21322132")

// let item2 = await db.getItem(25)

console.log(item)