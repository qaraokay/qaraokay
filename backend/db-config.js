import pg from 'pg';
const { Pool } = pg;

import dotenv from 'dotenv';
dotenv.config();

const ItemsPool = new Pool({
    
    connectionString: process.env.DB_URL,

    ssl: {
        rejectUnauthorized: false
    }

});

console.log('From db-config.js -----------------------');
console.log(dotenv);
console.log(ItemsPool);

export default ItemsPool;