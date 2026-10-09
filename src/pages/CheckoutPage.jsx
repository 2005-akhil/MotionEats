import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import styles from './CheckoutPage.module.css';

export function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();
const formRef = useRef(null);

useEffect(() => {
  const handleVoiceField = (event) => {
    const { field, value } = event.detail || {};
    const allowedFields = [
      'name',
      'email',
      'phone',
      'address',
      'city',
      'zip',
    ];

    if (!allowedFields.includes(field) || typeof value !== 'string') {
      return;
    }

    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleVoicePlaceOrder = () => {
    formRef.current?.requestSubmit();
  };

  window.addEventListener('motioneats:voice-field', handleVoiceField);
  window.addEventListener('motioneats:place-order', handleVoicePlaceOrder);

  return () => {
    window.removeEventListener('motioneats:voice-field', handleVoiceField);
    window.removeEventListener('motioneats:place-order', handleVoicePlaceOrder);
  };
}, []);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    address: '', city: '', zip: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    delivery: 'standard',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const taxes = subtotal * 0.08;
  const orderTotal = total + taxes;

  if (items.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.emptyState}>
          <h2>No items to checkout</h2>
          <Link to="/restaurants" className={styles.backLink}>← Browse Restaurants</Link>
        </div>
      </main>
    );
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.cardName.trim()) e.cardName = 'Cardholder name required';
    if (form.cardNumber.replace(/\s/g, '').length < 13) e.cardNumber = 'Valid card number required';
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = 'Format: MM/YY';
    if (!form.cvv.match(/^\d{3,4}$/)) e.cvv = 'Invalid CVV';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let v = value;
    if (name === 'cardNumber') {
      v = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      v = value.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    }
    if (name === 'cvv') {
      v = value.replace(/\D/g, '').slice(0, 4);
    }
    setForm(f => ({ ...f, [name]: v }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name, email: form.email, phone: form.phone,
            address: form.address, city: form.city, zip: form.zip,
          },
          items,
          totals: { subtotal, deliveryFee, taxes, total: orderTotal },
          delivery: form.delivery,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not place order.');
      clearCart();
      navigate('/confirmation', { state: { form, orderTotal, orderId: data.orderId, emailSent: data.emailSent } });
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/cart" className={styles.backLink}>
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <h1 className={styles.title}>Checkout</h1>
        </div>

        <form
  ref={formRef}
  onSubmit={handleSubmit}
  className={styles.layout}
  noValidate
>
          {/* Left: form */}
          <div className={styles.formSide}>
            {/* Delivery info */}
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <Truck size={18} /> Delivery Details
              </h2>
              <div className={styles.fieldRow}>
                <Field label="Full Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="Jane Smith" required />
                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="jane@email.com" required />
              </div>
              <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} placeholder="+1 555 000 0000" />
              <Field label="Delivery Address" name="address" value={form.address} onChange={handleChange} error={errors.address} placeholder="123 Main Street" required />
              <div className={styles.fieldRow}>
                <Field label="City" name="city" value={form.city} onChange={handleChange} error={errors.city} placeholder="New York" required />
                <Field label="ZIP Code" name="zip" value={form.zip} onChange={handleChange} error={errors.zip} placeholder="10001" />
              </div>
            </section>

            {/* Payment */}
            <section className={styles.formSection}>
              <h2 className={styles.sectionTitle}>
                <CreditCard size={18} /> Payment (Mock — no real charge)
              </h2>
              <Field label="Cardholder Name" name="cardName" value={form.cardName} onChange={handleChange} error={errors.cardName} placeholder="Jane Smith" required />
              <Field label="Card Number" name="cardNumber" value={form.cardNumber} onChange={handleChange} error={errors.cardNumber} placeholder="1234 5678 9012 3456" required inputMode="numeric" />
              <div className={styles.fieldRow}>
                <Field label="Expiry (MM/YY)" name="expiry" value={form.expiry} onChange={handleChange} error={errors.expiry} placeholder="12/26" required inputMode="numeric" />
                <Field label="CVV" name="cvv" value={form.cvv} onChange={handleChange} error={errors.cvv} placeholder="123" required inputMode="numeric" type="password" />
              </div>
            </section>

            {errors.submit && <p className={styles.errorMsg} role="alert">{errors.submit}</p>}
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? (
                <><span className={styles.spinner} /> Processing…</>
              ) : (
                `Place Order · $${orderTotal.toFixed(2)}`
              )}
            </button>
            <p className={styles.disclaimer}>
              🔒 This is a demo. No real payment is processed.
            </p>
          </div>

          {/* Right: order summary */}
          <aside className={styles.summaryAside} aria-label="Order summary">
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.itemsList}>
              {items.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <span className={styles.summaryItemQty}>{item.quantity}×</span>
                  <span className={styles.summaryItemName}>{item.name}</span>
                  <span className={styles.summaryItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className={styles.summaryRow}><span>Delivery</span><span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span></div>
              <div className={styles.summaryRow}><span>Taxes</span><span>${taxes.toFixed(2)}</span></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>Total</span><span>${orderTotal.toFixed(2)}</span></div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', value, onChange, error, placeholder, required, inputMode }) {
  return (
    <div className={styles.field}>
      <label htmlFor={name} className={styles.label}>
        {label}{required && <span className={styles.required}>*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        aria-required={required}
        aria-describedby={error ? `${name}-error` : undefined}
        inputMode={inputMode}
      />
      {error && <p id={`${name}-error`} className={styles.errorMsg} role="alert">{error}</p>}
    </div>
  );
}
