
CREATE TABLE IF NOT EXISTS authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  image MEDIUMTEXT,
  followers INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_id INT,
  category_id INT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  original_price DECIMAL(10,2),
  rating DECIMAL(3,2) DEFAULT 0,
  reviews INT DEFAULT 0,
  description TEXT,
  isbn VARCHAR(50),
  publisher VARCHAR(255),
  publish_date DATE,
  pages INT,
  format VARCHAR(50),
  cover_image MEDIUMTEXT,
  type ENUM('physical','ebook','audio') DEFAULT 'physical',
  sample_audio MEDIUMTEXT,
  delivery_method VARCHAR(255),
  ebook_file MEDIUMTEXT,
  audio_file MEDIUMTEXT,
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
  paypalSecret VARCHAR(255),
  googleMerchantId VARCHAR(255),
  googleApiKey VARCHAR(255)
);

INSERT INTO settings (id, siteName) VALUES (1, 'Molhemoon') ON DUPLICATE KEY UPDATE siteName = VALUES(siteName);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  duration INT NOT NULL,
  description TEXT,
  plan_type ENUM('membership','package') NOT NULL DEFAULT 'membership',
  package_type ENUM('ebook','audio')
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

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  password VARCHAR(255),
  role ENUM('admin','author','seller','customer') NOT NULL DEFAULT 'customer'
);

CREATE TABLE IF NOT EXISTS book_ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  test_mode BOOLEAN DEFAULT FALSE
);

INSERT INTO payment_methods (id, name, test_mode) VALUES
  (1, 'Stripe', FALSE),
  (2, 'PayPal', FALSE),
  (3, 'Mada', FALSE),
  (4, 'Qitaf', FALSE),
  (5, 'Cash on Delivery', FALSE)
ON DUPLICATE KEY UPDATE name = VALUES(name), test_mode = VALUES(test_mode);

CREATE TABLE IF NOT EXISTS coupons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  discount_type ENUM('percentage','fixed') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  expires_at DATETIME,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  order_id INT,
  subscription_id INT,
  payment_method_id INT,
  coupon_id INT,
  amount DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);
CREATE TABLE IF NOT EXISTS sliders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  alt VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS banners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_url VARCHAR(255) NOT NULL,
  link VARCHAR(255),
  alt VARCHAR(255),
  group_size INT NOT NULL DEFAULT 3
);

CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  icon VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255)
);

-- Ensure columns can store large base64 data
ALTER TABLE authors MODIFY image MEDIUMTEXT;
ALTER TABLE books
  MODIFY cover_image MEDIUMTEXT,
  MODIFY sample_audio MEDIUMTEXT,
  MODIFY ebook_file MEDIUMTEXT,
  MODIFY audio_file MEDIUMTEXT;
