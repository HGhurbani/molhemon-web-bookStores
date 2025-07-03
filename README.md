# Molhemoon Web Bookstore

This project is a React-based bookstore application. A simple Node.js backend using MySQL has been added to persist data.

## Database setup
1. Install MySQL and create a user.
2. Run the SQL script in `backend/schema.sql` to create the database and tables:

```bash
mysql -u <user> -p < backend/schema.sql
```

## Configuration
1. Copy `.env.example` to `.env` and update the variables for your database credentials.
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

## Notes
- CRUD actions in the dashboard now communicate with the backend using the provided API routes.
- If you need to build the project for production, run `npm run build` (requires installed dependencies).
