# Molhemoon Web Bookstore

This project is a React-based bookstore application. It now ships with a small
PHP MVC backend so it can run on typical shared hosting without Node.js.

## Database setup
1. Install MySQL and create a user.
2. Run the SQL script in `php/schema.sql` to create the database and tables:

```bash
mysql -u <user> -p < php/schema.sql
```

## Configuration
1. Edit `php/config.php` with your database credentials. The default values match the demo database used previously.
2. Install frontend dependencies if you want to run the React dev server (requires internet access):

```bash
npm install
```

## Running
Start the PHP backend using the built-in server:

```bash
php -S localhost:8000 -t php
```

In another terminal, start the frontend development server:

```bash
npm run dev
```

The frontend expects the API to be available on the same host (e.g. `http://localhost:8000`).
All dashboard sections including orders now read and write data through the PHP backend.

## Google Merchant Integration
Set `GOOGLE_MERCHANT_ID` and `GOOGLE_API_KEY` in your `.env` file to enable importing products from Google Merchant Center. In the dashboard settings you can trigger "استيراد من Google Merchant" to fetch and add products as books.

## Notes
- CRUD actions in the dashboard now communicate with the PHP backend using the provided API routes.
- If you need to build the project for production, run `npm run build` (requires installed dependencies).
- Category management forms still include a dropdown to select an icon from the `lucide-react` library.
