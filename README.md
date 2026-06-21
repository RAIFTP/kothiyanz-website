# Kothiyanz — Restaurant Management (Firebase)

This repository extends the existing Kothiyanz website into a lightweight Restaurant Management System using Firebase (Firestore + Auth). It preserves all original UI, animations and design — the new admin/waiter/kitchen/billing pages are separate and modular.

Files added (new):

- `firebase-config.js` — Firebase initialization (replace with your project values).
- `admin.html`, `admin.css`, `admin.js` — Admin dashboard (auth required).
- `waiter.html`, `waiter.js` — Waiter dashboard (create orders).
- `kitchen.html`, `kitchen.js` — Kitchen dashboard (order workflow).
- `billing.html`, `billing.js` — Billing UI (compute tax/discount/print/mark paid).
- `customer-menu.js` — Customer-side digital menu, cart, ordering and reservation wiring.
- `customer-menu.js` automatically hooks into `index.html` if a `<div id="digital-menu"></div>` placeholder exists.
- `test-firestore.html`, `test-firestore.js` — Browser-based CRUD test harness for Firestore.
- `init-sample-data.js` — Adds sample menu/tables/reservations to Firestore (manual trigger in test page).
- `firestore.rules` — Example Firestore Security Rules.

Quick setup

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore (Native mode) and Authentication (Email/Password) in the console.
3. Copy your Firebase config object and paste it into `firebase-config.js`.
4. (Optional but recommended) Create an admin user and give them an `admin` custom claim (see below).

Running locally

Serving files from the filesystem may block module imports in some browsers. Serve the project with a simple static server. On Windows PowerShell:

```powershell
# from repository root
python -m http.server 8000
# or use PowerShell's built-in simple server (PowerShell 5.x doesn't include one); Python is recommended
```

Open `http://localhost:8000/admin.html` for the admin dashboard, `waiter.html`, `kitchen.html`, `billing.html`, and `test-firestore.html` for test utilities.

Testing Firestore flows (quick)

1. Open `test-firestore.html` in the browser (served via local server as above).
2. Click `Init Sample Data` to insert a few menu items, tables, and sample reservation/order entries.
3. Use the `Run CRUD Tests` panel to create, read, update, and delete sample documents — results appear on the page and console.

Security rules (example)

See `firestore.rules` for a starting point that:
- Allows anyone to read the `menu` collection.
- Allows anyone to create `orders`, `reservations`, and `feedback` documents (customer actions).
- Restricts writes to `menu`, `tables`, `users` and most updates/deletes to authenticated admins (custom claim `admin == true`).

Make sure to review and adapt these rules to your requirements before going into production.

Adding admin claims

To mark an existing user as admin you must use the Firebase Admin SDK (server or Cloud Functions). Example (Node.js):

```js
const admin = require('firebase-admin');
admin.auth().setCustomUserClaims(uid, { admin: true });
```

Or use the Firebase Console to create an admin user and set claims from an admin utility you control.

WhatsApp integration

The project currently uses a simple WhatsApp Intent (web link) to open the user's WhatsApp prefilled with the order/reservation. For automated sending you can integrate Twilio, Vonage, or WhatsApp Business Cloud API in a Cloud Function.

Next recommended steps

- Review and lock down `firestore.rules` for production.
- Add role-based UI flows (admin/waiter accounts) and server-side verification for sensitive actions.
- Optionally add Cloud Functions for notifications (WhatsApp / SMS) and automatic reservation confirmations.

Cloud Functions (optional)

I added a sample `functions/` folder with two HTTP Cloud Function stubs:

- `setAdmin` — sets a user's custom claim `admin: true`. It requires an admin secret to be provided via header `x-admin-secret` or query/body `secret`. Use this only from a trusted server or via the `admin-helpers.js` client after you deploy (and provide the secret).
- `sendWhatsApp` — uses Twilio to send a message (WhatsApp or SMS) when Twilio credentials are configured in functions config.

Deploy steps (Firebase CLI)

1. Install Firebase CLI and log in:

```powershell
npm install -g firebase-tools
# then
# firebase login
```

2. Initialize functions (if not already):

```powershell
cd functions
npm install
cd ..
firebase init functions
```

3. Set required environment variables (example):

```powershell
firebase functions:config:set kothiyanz.admin_secret="YOUR_SECRET"
firebase functions:config:set twilio.sid="TWILIO_ACCOUNT_SID" twilio.token="TWILIO_AUTH_TOKEN" twilio.from="whatsapp:+1415..."
```

4. Deploy functions:

```powershell
firebase deploy --only functions
```

After deploy you'll get function URLs. Use `admin-helpers.js` (or your server) to call the `setAdmin` function to set admin roles, and `sendWhatsApp` to send messages programmatically.

Security note

Cloud Functions with admin operations must be protected. Use `ADMIN_SECRET` or require invocations from authenticated admin accounts. Never commit secrets in code.

If you'd like, I can apply these next steps for you (security rules tuning, role-based UI, or Cloud Functions). Tell me which and I'll proceed.

Recent changes (quick summary)

- Hardened `firestore.rules` with field-level validation for `menu`, `tables`, `orders`, `reservations`, and `feedback`.
- Added a tiny browser `admin-tools.html` to call the deployed `setAdmin` Cloud Function (requires function URL and secret).
- Tidied the Firestore test harness: `test-firestore.html` now includes `test-firestore.css` and has improved accessibility (`lang` attribute).

If you want me to proceed immediately with deploying functions and scripting admin-user creation, tell me and I'll provide exact commands and environment variable values to run locally.
