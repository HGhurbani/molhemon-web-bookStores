# Molhemoon Web Bookstore

This project is a React-based bookstore application. A simple Node.js backend using MySQL has been added to persist data.

## Database setup
1. Install MySQL and create a user.
2. Run the SQL script in `backend/schema.sql` to create the database and tables:

```bash
mysql -u <user> -p < backend/schema.sql
```

## Configuration
1. Copy `.env.example` to `.env` and update the variables if needed. The example already contains the provided database credentials and sets `VITE_API_BASE` to `https://demo.darmolhimon.com`.
2. Install dependencies (requires internet access):

```bash
npm install
```

## Running
Start the backend server:

```bash
npm run server
```

In another terminal, start the frontend development server:

```bash
npm run dev
```

The frontend expects the API to be available at the URL defined in `VITE_API_BASE`.
All dashboard sections including orders now read and write data through the MySQL backend.

## Google Merchant Integration
Set `GOOGLE_MERCHANT_ID` and `GOOGLE_API_KEY` in your `.env` file to enable importing products from Google Merchant Center. In the dashboard settings you can trigger "استيراد من Google Merchant" to fetch and add products as books.

## Notes
- CRUD actions in the dashboard now communicate with the backend using the provided API routes.
- If you need to build the project for production, run `npm run build` (requires installed dependencies).
- Category management forms now include a dropdown to select an icon from the `lucide-react` library.
