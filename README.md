# Molhemoon Web Bookstore

This project is a React-based bookstore application. Data persistence is handled
through **Firebase Firestore**. A small PHP backend is kept for optional legacy
features such as importing from Google Merchant.

## Firebase setup
1. Create a Firebase project.
2. Update the credentials in `src/lib/firebase.js` with your project's details.

## Configuration
1. (Optional) Edit `php/config.php` if you plan to run the legacy PHP backend.
2. Install frontend dependencies if you want to run the React dev server (requires internet access):

```bash
npm install
```

## Running
Start the development server:

```bash
npm run dev
```

The app now reads and writes data directly from Firebase.

Authentication uses Firebase Auth. New accounts are created with `createUserWithEmailAndPassword` and stored in the `users` collection in Firestore.

## Google Merchant Integration
Set `GOOGLE_MERCHANT_ID` and `GOOGLE_API_KEY` in your `.env` file to enable importing products from Google Merchant Center. In the dashboard settings you can trigger "استيراد من Google Merchant" to fetch and add products as books.

## Payment Methods
Payment methods are stored in the `payment_methods` collection in Firestore. Each method can hold a JSON configuration containing your gateway keys (for example Stripe publishable/secret keys or PayPal client details). The dashboard lets you edit this JSON for every method. Only Firebase is required – no additional backend is needed for payments.

## Notes
- Data in the dashboard is persisted in Firebase. The optional PHP backend is only used for the Google Merchant import.
- If you need to build the project for production, run `npm run build` (requires installed dependencies).
- Category management forms still include a dropdown to select an icon from the `lucide-react` library.
