import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'u6axwhnwuhpzi',
  password: process.env.DB_PASSWORD || '#2@l$4e5i~5+',
  database: process.env.DB_NAME || 'dbxs5qfidu3hqr',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/api/books', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM books');
  res.json(rows);
});

app.post('/api/books', async (req, res) => {
  const data = req.body;
  const [result] = await pool.execute(
    'INSERT INTO books (title, author_id, category_id, price, original_price, rating, reviews, description, isbn, publisher, publish_date, pages, format, cover_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [data.title, data.author_id, data.category_id, data.price, data.original_price, data.rating, data.reviews, data.description, data.isbn, data.publisher, data.publish_date, data.pages, data.format, data.cover_image]
  );
  const [rows] = await pool.query('SELECT * FROM books WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  await pool.query('UPDATE books SET ? WHERE id=?', [data, id]);
  const [rows] = await pool.query('SELECT * FROM books WHERE id=?', [id]);
  res.json(rows[0]);
});

app.delete('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM books WHERE id=?', [id]);
  res.sendStatus(204);
});

app.get('/api/authors', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM authors');
  res.json(rows);
});

app.post('/api/authors', async (req, res) => {
  const data = req.body;
  const [result] = await pool.execute('INSERT INTO authors (name, bio) VALUES (?,?)', [data.name, data.bio]);
  const [rows] = await pool.query('SELECT * FROM authors WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/authors/:id', async (req, res) => {
  await pool.query('UPDATE authors SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM authors WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/authors/:id', async (req, res) => {
  await pool.query('DELETE FROM authors WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/categories', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories');
  res.json(rows);
});

app.post('/api/categories', async (req, res) => {
  const [result] = await pool.execute('INSERT INTO categories (name) VALUES (?)', [req.body.name]);
  const [rows] = await pool.query('SELECT * FROM categories WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/categories/:id', async (req, res) => {
  await pool.query('UPDATE categories SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM categories WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/categories/:id', async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/sellers', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM sellers');
  res.json(rows);
});

app.post('/api/sellers', async (req, res) => {
  const { name, email, phone } = req.body;
  const [result] = await pool.execute('INSERT INTO sellers (name, email, phone) VALUES (?,?,?)', [name, email, phone]);
  const [rows] = await pool.query('SELECT * FROM sellers WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/sellers/:id', async (req, res) => {
  await pool.query('UPDATE sellers SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM sellers WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/sellers/:id', async (req, res) => {
  await pool.query('DELETE FROM sellers WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/customers', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM customers');
  res.json(rows);
});

app.post('/api/customers', async (req, res) => {
  const { name, email, phone } = req.body;
  const [result] = await pool.execute('INSERT INTO customers (name, email, phone) VALUES (?,?,?)', [name, email, phone]);
  const [rows] = await pool.query('SELECT * FROM customers WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/customers/:id', async (req, res) => {
  await pool.query('UPDATE customers SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM customers WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/customers/:id', async (req, res) => {
  await pool.query('DELETE FROM customers WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/settings', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM settings WHERE id=1');
  res.json(rows[0] || {});
});

app.put('/api/settings', async (req, res) => {
  await pool.query('UPDATE settings SET ? WHERE id=1', [req.body]);
  const [rows] = await pool.query('SELECT * FROM settings WHERE id=1');
  res.json(rows[0]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

