# MotionEats — MongoDB + Email setup

## 1. Install dependencies
Run in the project root:
`npm install`

## 2. Configure the backend
Copy `server/.env.example` to `server/.env` and fill in your MongoDB connection string and SMTP settings.
Never commit or share `server/.env`.

## 3. Start the backend
`npm run server`

Expected messages:
- `MongoDB connected`
- `MotionEats API running at http://localhost:5000`

## 4. Start the frontend
Open a second terminal in the project root:
`npm run dev`

## Notes
- User passwords are stored as bcrypt hashes.
- Card number, expiry, and CVV are never sent to or stored in MongoDB.
- Checkout is still a demo payment flow; no real payment is processed.
- Gmail SMTP requires a Google App Password rather than your normal Gmail password.
