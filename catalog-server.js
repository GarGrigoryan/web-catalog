require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.APP_DB_USER || 'postgres',
  host: process.env.APP_DB_HOST || '192.168.11.156',
  database: process.env.APP_DB_NAME || 'warehouse_db',
  password: process.env.APP_DB_PASSWORD || 'your_password',
  port: parseInt(process.env.APP_DB_PORT) || 5432,
});

const PORT = process.env.CATALOG_PORT || 6000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/catalog/items', async (req, res) => {
    try {
        const query = `
            SELECT id, name, description, sale_price as price, quantity, image_url
            FROM items
            WHERE quantity > 0
            ORDER BY name ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Catalog Server running on port ${PORT}`);
});
