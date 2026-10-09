import dotenv from 'dotenv';

dotenv.config({ path: 'server/.env' });
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';
import crypto from 'node:crypto';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: [CLIENT_ORIGIN, 'http://localhost:5174'],
}));
app.use(express.json({ limit: '100kb' }));

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI is missing. Create server/.env from server/.env.example.');
  process.exit(1);
}

const client = new MongoClient(mongoUri);
let db;
let transporter = null;

function setupMailer() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.error('❌ Email is NOT configured.');
    console.error('SMTP_USER or SMTP_PASS is missing from server/.env');
    transporter = null;
    return;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email configuration failed:', error.message);
    } else {
      console.log('✅ Email server connected successfully');
    }
  });
}
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ error: 'Name, email and password are required.' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    const normalizedEmail = email.trim().toLowerCase();
    const users = db.collection('users');
    if (await users.findOne({ email: normalizedEmail })) return res.status(409).json({ error: 'An account with that email already exists.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const result = await users.insertOne({ name: name.trim(), email: normalizedEmail, passwordHash, createdAt: new Date() });
    res.status(201).json({ user: { id: String(result.insertedId), name: name.trim(), email: normalizedEmail } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create account.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await db.collection('users').findOne({ email: email?.trim().toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ error: 'Invalid email or password.' });
    res.json({ user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not log in.' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customer, items, totals, delivery } = req.body || {};
    if (!customer?.name || !customer?.email || !Array.isArray(items) || !items.length) return res.status(400).json({ error: 'Customer and order items are required.' });

    // Never persist card number, expiry, or CVV.
    const orderId = `ME-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const order = {
      orderId,
      customer: {
        name: String(customer.name).slice(0, 120),
        email: String(customer.email).trim().toLowerCase(),
        phone: String(customer.phone || '').slice(0, 40),
        address: String(customer.address || '').slice(0, 300),
        city: String(customer.city || '').slice(0, 100),
        zip: String(customer.zip || '').slice(0, 30),
      },
      items: items.map(item => ({
        id: String(item.id), name: String(item.name).slice(0, 150),
        quantity: Math.max(1, Number(item.quantity) || 1),
        price: Number(item.price) || 0,
      })),
      totals: {
        subtotal: Number(totals?.subtotal) || 0,
        deliveryFee: Number(totals?.deliveryFee) || 0,
        taxes: Number(totals?.taxes) || 0,
        total: Number(totals?.total) || 0,
      },
      delivery: String(delivery || 'standard'),
      status: 'Order Placed',
      createdAt: new Date(),
    };

    await db.collection('orders').insertOne(order);

    let emailSent = false;
    if (!transporter) {
  console.error('❌ Order email was NOT sent because email is not configured.');
} else {
      const lines = order.items.map(i => `${i.quantity} x ${i.name} — $${(i.price * i.quantity).toFixed(2)}`).join('\n');
      await transporter.sendMail({
        from: process.env.MAIL_FROM || process.env.SMTP_USER,
        to: order.customer.email,
        subject: `MotionEats order confirmation — ${orderId}`,
        text: `Thanks for your order, ${order.customer.name}!\n\nOrder ID: ${orderId}\n\n${lines}\n\nTotal: $${order.totals.total.toFixed(2)}\nDelivery: ${order.customer.address}, ${order.customer.city}\n\nMotionEats`,
      });
      emailSent = true;
      console.log(`✅ Order confirmation email sent to ${order.customer.email}`);
    }
    res.status(201).json({ orderId, emailSent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not save the order or send the confirmation email.' });
  }
});

async function start() {
  await client.connect();
  db = client.db(process.env.MONGODB_DB || 'motioneats');
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  setupMailer();
  app.listen(PORT, () => console.log(`MotionEats API running at http://localhost:${PORT}`));
  console.log('MongoDB connected');
}

start().catch(err => {
  console.error('Startup failed:', err.message);
  process.exit(1);
});
