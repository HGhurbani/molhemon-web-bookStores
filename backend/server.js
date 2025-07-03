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
    'INSERT INTO books (title, author_id, category_id, price, original_price, rating, reviews, description, isbn, publisher, publish_date, pages, format, cover_image, type, sample_audio, delivery_method, ebook_file, audio_file) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    [
      data.title,
      data.authorId,
      data.categoryId,
      data.price,
      data.originalPrice,
      0,
      0,
      data.description,
      data.isbn,
      data.publisher,
      data.publishDate,
      data.pages,
      data.format,
      data.coverImage,
      data.type,
      data.sampleAudio,
      data.deliveryMethod,
      data.ebookFile,
      data.audioFile,
    ]
  );
  const [rows] = await pool.query('SELECT * FROM books WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const mapped = {
    title: data.title,
    author_id: data.authorId,
    category_id: data.categoryId,
    price: data.price,
    original_price: data.originalPrice,
    description: data.description,
    isbn: data.isbn,
    publisher: data.publisher,
    publish_date: data.publishDate,
    pages: data.pages,
    format: data.format,
    cover_image: data.coverImage,
    type: data.type,
    sample_audio: data.sampleAudio,
    delivery_method: data.deliveryMethod,
    ebook_file: data.ebookFile,
    audio_file: data.audioFile,
  };
  await pool.query('UPDATE books SET ? WHERE id=?', [mapped, id]);
  const [rows] = await pool.query('SELECT * FROM books WHERE id=?', [id]);
  res.json(rows[0]);
});

app.delete('/api/books/:id', async (req, res) => {
  const id = req.params.id;
  await pool.query('DELETE FROM books WHERE id=?', [id]);
  res.sendStatus(204);
});

app.get('/api/books/:id/ratings', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM book_ratings WHERE book_id=? ORDER BY created_at DESC',
    [req.params.id]
  );
  res.json(rows);
});

app.post('/api/books/:id/ratings', async (req, res) => {
  const { userId, rating, comment } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO book_ratings (book_id, user_id, rating, comment) VALUES (?,?,?,?)',
    [req.params.id, userId || null, rating, comment || null]
  );
  const [agg] = await pool.query(
    'SELECT AVG(rating) AS avgRating, COUNT(*) AS count FROM book_ratings WHERE book_id=?',
    [req.params.id]
  );
  const { avgRating, count } = agg[0];
  await pool.query('UPDATE books SET rating=?, reviews=? WHERE id=?', [avgRating, count, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM book_ratings WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.get('/api/authors', async (_req, res) => {
  const [authors] = await pool.query('SELECT * FROM authors');
  if (authors.length) {
    const ids = authors.map(a => a.id);
    const [bookCounts] = await pool.query(
      'SELECT author_id AS id, COUNT(*) AS count FROM books WHERE author_id IN (?) GROUP BY author_id',
      [ids]
    );
    const [soldCounts] = await pool.query(
      `SELECT b.author_id AS id, SUM(oi.quantity) AS sold FROM order_items oi JOIN books b ON oi.book_id=b.id WHERE b.author_id IN (?) GROUP BY b.author_id`,
      [ids]
    );
    const bcMap = Object.fromEntries(bookCounts.map(r => [r.id, r.count]));
    const scMap = Object.fromEntries(soldCounts.map(r => [r.id, r.sold]));
    authors.forEach(a => {
      a.booksCount = bcMap[a.id] || 0;
      a.soldCount = scMap[a.id] || 0;
    });
  }
  res.json(authors);
});

app.post('/api/authors', async (req, res) => {
  const { name, bio, image, followers = 0 } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO authors (name, bio, image, followers) VALUES (?,?,?,?)',
    [name, bio, image || null, followers]
  );
  const [rows] = await pool.query('SELECT * FROM authors WHERE id=?', [result.insertId]);
  const author = rows[0];
  const [bookCount] = await pool.query('SELECT COUNT(*) AS count FROM books WHERE author_id=?', [author.id]);
  const [soldCount] = await pool.query(
    'SELECT SUM(oi.quantity) AS sold FROM order_items oi JOIN books b ON oi.book_id=b.id WHERE b.author_id=?',
    [author.id]
  );
  author.booksCount = bookCount[0].count;
  author.soldCount = soldCount[0].sold || 0;
  res.status(201).json(author);
});

app.put('/api/authors/:id', async (req, res) => {
  await pool.query('UPDATE authors SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM authors WHERE id=?', [req.params.id]);
  const author = rows[0];
  const [bookCount] = await pool.query('SELECT COUNT(*) AS count FROM books WHERE author_id=?', [author.id]);
  const [soldCount] = await pool.query(
    'SELECT SUM(oi.quantity) AS sold FROM order_items oi JOIN books b ON oi.book_id=b.id WHERE b.author_id=?',
    [author.id]
  );
  author.booksCount = bookCount[0].count;
  author.soldCount = soldCount[0].sold || 0;
  res.json(author);
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
  const [orders] = await pool.query(
    'SELECT id, customer_id, seller_id, total, status, DATE(order_date) AS date FROM orders ORDER BY order_date DESC'
  );
  const [items] = await pool.query(
    'SELECT oi.*, b.title FROM order_items oi JOIN books b ON oi.book_id=b.id'
  );
  const result = orders.map(o => ({
    ...o,
    items: items.filter(i => i.order_id === o.id)
  }));
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
  const [rows] = await pool.query(
    'SELECT id, customer_id, seller_id, total, status, DATE(order_date) AS date FROM orders WHERE id=?',
    [orderId]
  );
  const [itemRows] = await pool.query(
    'SELECT oi.*, b.title FROM order_items oi JOIN books b ON oi.book_id=b.id WHERE oi.order_id=?',
    [orderId]
  );
  res.status(201).json({ ...rows[0], items: itemRows });
});

app.put('/api/orders/:id', async (req, res) => {
  await pool.query('UPDATE orders SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query(
    'SELECT id, customer_id, seller_id, total, status, DATE(order_date) AS date FROM orders WHERE id=?',
    [req.params.id]
  );
  const [itemRows] = await pool.query(
    'SELECT oi.*, b.title FROM order_items oi JOIN books b ON oi.book_id=b.id WHERE oi.order_id=?',
    [req.params.id]
  );
  res.json({ ...rows[0], items: itemRows });
});

app.get('/api/orders/:id', async (req, res) => {
  const [rows] = await pool.query(
    'SELECT id, customer_id, seller_id, total, status, DATE(order_date) AS date FROM orders WHERE id=?',
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'Order not found' });
  }
  const [itemRows] = await pool.query(
    'SELECT oi.*, b.title FROM order_items oi JOIN books b ON oi.book_id=b.id WHERE oi.order_id=?',
    [req.params.id]
  );
  res.json({ ...rows[0], items: itemRows });
});

app.delete('/api/orders/:id', async (req, res) => {
  await pool.query('DELETE FROM orders WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

app.get('/api/plans', async (req, res) => {
  const { type, packageType } = req.query;
  let query = 'SELECT * FROM subscription_plans';
  const params = [];
  const conditions = [];
  if (type) {
    conditions.push('plan_type=?');
    params.push(type);
  }
  if (packageType) {
    conditions.push('package_type=?');
    params.push(packageType);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  const [rows] = await pool.query(query, params);
  res.json(rows);
});

app.post('/api/plans', async (req, res) => {
  const { name, price, duration, description, plan_type, package_type } = req.body;
  const [result] = await pool.execute('INSERT INTO subscription_plans (name, price, duration, description, plan_type, package_type) VALUES (?,?,?,?,?,?)', [name, price, duration, description, plan_type || 'membership', package_type || null]);
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
  const { name, test_mode } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO payment_methods (name, test_mode) VALUES (?, ?)',
    [name, test_mode === true]
  );
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

// Slider Images
app.get('/api/sliders', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM sliders ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/sliders', async (req, res) => {
  const { image_url, link, alt } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO sliders (image_url, link, alt) VALUES (?,?,?)',
    [image_url, link, alt]
  );
  const [rows] = await pool.query('SELECT * FROM sliders WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/sliders/:id', async (req, res) => {
  await pool.query('UPDATE sliders SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM sliders WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/sliders/:id', async (req, res) => {
  await pool.query('DELETE FROM sliders WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

// Banner Images
app.get('/api/banners', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM banners ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/banners', async (req, res) => {
  const { image_url, link, alt, group_size } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO banners (image_url, link, alt, group_size) VALUES (?,?,?,?)',
    [image_url, link, alt, group_size]
  );
  const [rows] = await pool.query('SELECT * FROM banners WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/banners/:id', async (req, res) => {
  await pool.query('UPDATE banners SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM banners WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/banners/:id', async (req, res) => {
  await pool.query('DELETE FROM banners WHERE id=?', [req.params.id]);
  res.sendStatus(204);
});

// Features
app.get('/api/features', async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM features ORDER BY id ASC');
  res.json(rows);
});

app.post('/api/features', async (req, res) => {
  const { icon, title, description } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO features (icon, title, description) VALUES (?,?,?)',
    [icon, title, description]
  );
  const [rows] = await pool.query('SELECT * FROM features WHERE id=?', [result.insertId]);
  res.status(201).json(rows[0]);
});

app.put('/api/features/:id', async (req, res) => {
  await pool.query('UPDATE features SET ? WHERE id=?', [req.body, req.params.id]);
  const [rows] = await pool.query('SELECT * FROM features WHERE id=?', [req.params.id]);
  res.json(rows[0]);
});

app.delete('/api/features/:id', async (req, res) => {
  await pool.query('DELETE FROM features WHERE id=?', [req.params.id]);
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

