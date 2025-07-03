
CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT,
  category_id INT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2),
  rating DECIMAL(3,2),
  reviews INT,
  description TEXT,
  isbn VARCHAR(50),
  publisher VARCHAR(255),
  publish_date DATE,
  pages INT,
  format VARCHAR(50),
  cover_image VARCHAR(255),
  FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS sellers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  seller_id INT,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'قيد المعالجة',
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id) REFERENCES sellers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  book_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS settings (
  id INT PRIMARY KEY,
  siteName VARCHAR(255),
  description TEXT,
  contactEmail VARCHAR(255),
  contactPhone VARCHAR(255),
  address VARCHAR(255),
  facebook VARCHAR(255),
  twitter VARCHAR(255),
  instagram VARCHAR(255),
  themeColor VARCHAR(20),
  stripePublicKey VARCHAR(255),
  stripeSecretKey VARCHAR(255),
  paypalClientId VARCHAR(255),
  paypalSecret VARCHAR(255)
);

INSERT INTO settings (id, siteName) VALUES (1, 'Molhemoon') ON DUPLICATE KEY UPDATE siteName = VALUES(siteName);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration INT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  plan_id INT,
  start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  end_date DATETIME,
  status VARCHAR(50) DEFAULT 'نشط',
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL
);
