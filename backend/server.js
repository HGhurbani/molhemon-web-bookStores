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
  const { name, icon } = req.body;
  const [result] = await pool.execute('INSERT INTO categories (name, icon) VALUES (?,?)', [name, icon]);
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

// Orders
app.get('/api/orders', async (_req, res) => {
  const [orders] = await pool.query('SELECT * FROM orders ORDER BY order_date DESC');
  const [items] = await pool.query('SELECT * FROM order_items');
  const result = orders.map(o => ({ ...o, items: items.filter(i => i.order_id === o.id) }));
  res.json(result);
});

app.post('/api/orders', async (req, res) => {
  const { customer_id, seller_id, total, status = 'قيد المعالجة', items = [] } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO orders (customer_id, seller_id, total, status) VALUES (?,?,?,?)',
    [customer_id || null, seller_id || null, total, status]
  );
  const orderId = result.insertId;
  for (const item of items) {
    await pool.execute(
      'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?,?,?,?)',
      [orderId, item.id, item.quantity, item.price]
    );
  }
  const [rows] = await pool.query('SELECT * FROM orders WHERE id=?', [orderId]);
  const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id=?', [orderId]);
  res.status(201).json({ ...rows[0], items: itemRows });
});

app.put('/api/orders/:id', async (req, res) => {
  await pool.query('UPDATE orders SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM orders WHERE id=?', [req.params.id]);
  const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id=?', [req.params.id]);
  res.json({ ...rows[0], items: itemRows });
});

app.delete('/api/orders/:id', async (req, res) => {
  await pool.query('DELETE FROM orders WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/plans', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM subscription_plans');
  res.json(rows);
});

app.post('/api/plans', async (req, res) => {
  const { name, price, duration, description } = req.body;
  const [result] = await pool.execute('INSERT INTO subscription_plans (name, price, duration, description) VALUES (?,?,?,?)', [name, price, duration, description]);
  const [rows] = await pool.query('SELECT * FROM subscription_plans WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/plans/:id', async (req, res) => {
  await pool.query('UPDATE subscription_plans SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM subscription_plans WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/plans/:id', async (req, res) => {
  await pool.query('DELETE FROM subscription_plans WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/subscriptions', async (_req, res) => {
  const [rows] = await pool.query("SELECT s.*, c.name AS customer_name, p.name AS plan_name FROM subscriptions s LEFT JOIN customers c ON s.customer_id=c.id LEFT JOIN subscription_plans p ON s.plan_id=p.id ORDER BY s.start_date DESC");
  res.json(rows);
});

app.post('/api/subscriptions', async (req, res) => {
  const { customer_id, plan_id } = req.body;
  const [planRows] = await pool.query('SELECT duration FROM subscription_plans WHERE id=?', [plan_id]);
  if (planRows.length === 0) return res.status(400).json({ error: 'Invalid plan' });
  const duration = planRows[0].duration;
  const [result] = await pool.execute('INSERT INTO subscriptions (customer_id, plan_id, end_date) VALUES (?,?, DATE_ADD(NOW(), INTERVAL ? DAY))', [customer_id || null, plan_id, duration]);
  const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.get('/api/users', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM users');
  res.json(rows);
});

app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO users (name, email, password, role) VALUES (?,?,?,?)',
    [name, email, password, role]
  );
  const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/users/:id', async (req, res) => {
  await pool.query('UPDATE users SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM users WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/users/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

// Payment Methods
app.get('/api/payment-methods', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM payment_methods');
  res.json(rows);
});

app.post('/api/payment-methods', async (req, res) => {
  const { name } = req.body;
  const [result] = await pool.execute('INSERT INTO payment_methods (name) VALUES (?)', [name]);
  const [rows] = await pool.query('SELECT * FROM payment_methods WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/payment-methods/:id', async (req, res) => {
  await pool.query('UPDATE payment_methods SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM payment_methods WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/payment-methods/:id', async (req, res) => {
  await pool.query('DELETE FROM payment_methods WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

// Coupons
app.get('/api/coupons', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM coupons');
  res.json(rows);
});

app.post('/api/coupons', async (req, res) => {
  const { code, discount_type, discount_value, expires_at, is_active } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO coupons (code, discount_type, discount_value, expires_at, is_active) VALUES (?,?,?,?,?)',
    [code, discount_type, discount_value, expires_at || null, is_active !== false]
  );
  const [rows] = await pool.query('SELECT * FROM coupons WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/coupons/:id', async (req, res) => {
  await pool.query('UPDATE coupons SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM coupons WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/coupons/:id', async (req, res) => {
  await pool.query('DELETE FROM coupons WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

// Payments
app.get('/api/payments', async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, c.name AS customer_name, o.status AS order_status, sp.name AS plan_name
     FROM payments p
     LEFT JOIN customers c ON p.customer_id=c.id
     LEFT JOIN orders o ON p.order_id=o.id
     LEFT JOIN subscriptions s ON p.subscription_id=s.id
     LEFT JOIN subscription_plans sp ON s.plan_id=sp.id
     ORDER BY p.transaction_date DESC`
  );
  res.json(rows);
});

app.post('/api/payments', async (req, res) => {
  const { customer_id, order_id, subscription_id, payment_method_id, coupon_id, amount, status = 'pending' } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO payments (customer_id, order_id, subscription_id, payment_method_id, coupon_id, amount, status) VALUES (?,?,?,?,?,?,?)',
    [customer_id || null, order_id || null, subscription_id || null, payment_method_id || null, coupon_id || null, amount, status]
  );
  const [rows] = await pool.query('SELECT * FROM payments WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/payments/:id', async (req, res) => {
  await pool.query('UPDATE payments SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM payments WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/payments/:id', async (req, res) => {
  await pool.query('DELETE FROM payments WHERE id=?', [req.params.id]);
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

app.post('/api/google-merchant/import', async (_req, res) => {
  const [rows] = await pool.query(
    'SELECT googleMerchantId, googleApiKey FROM settings WHERE id=1'
  );
  const cfg = rows[0] || {};
  if (!cfg.googleMerchantId || !cfg.googleApiKey) {
    return res
      .status(400)
      .json({ error: 'Google Merchant configuration missing' });
  }
  try {
    const resp = await fetch(
      `https://shoppingcontent.googleapis.com/content/v2.1/${cfg.googleMerchantId}/products?key=${cfg.googleApiKey}`
    );
    const data = await resp.json();
    const products = data.resources || data.items || [];
    const imported = [];
    for (const p of products) {
      const [result] = await pool.execute(
        'INSERT INTO books (title, price, description, cover_image) VALUES (?,?,?,?)',
        [p.title, (p.price && p.price.value) || 0, p.description || '', p.imageLink || '']
      );
      const [bookRows] = await pool.query('SELECT * FROM books WHERE id=?', [result.insertId]);
      imported.push(bookRows[0]);
    }
    res.json(imported);
  } catch (err) {
    console.error('Failed to import Google Merchant products', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

