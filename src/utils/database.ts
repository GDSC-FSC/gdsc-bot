import Database from 'better-sqlite3';

const db = new Database('database.db');

// Create events table
db.exec(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY,
        title TEXT,
        thumbnailLink TEXT,
        detailsLink TEXT,
        date TEXT,
        activityType TEXT,
        description TEXT
    )
`);

// Create custom_commands table
db.exec(`
    CREATE TABLE IF NOT EXISTS custom_commands (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE,
        description TEXT,
        value TEXT,
        color TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS config (
        id INTEGER PRIMARY KEY, 
        data TEXT
    )
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS autoresponders (
        id INTEGER PRIMARY KEY, 
        trigger_phrase TEXT, 
        response_message TEXT, 
        embed_data TEXT
    )
`);

// You can add more table creation statements as needed

export default db;

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});
