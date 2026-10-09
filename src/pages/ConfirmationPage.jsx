import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Home, UtensilsCrossed } from 'lucide-react';
import styles from './ConfirmationPage.module.css';

// Generate a mock order ID
const genOrderId = () => `ME-${Date.now().toString(36).toUpperCase().slice(-6)}`;

export function ConfirmationPage() {
  const location = useLocation();
  const { form, orderTotal } = location.state || {};
  const orderId = location.state?.orderId || genOrderId();

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.iconWrap}>
          <CheckCircle size={64} className={styles.checkIcon} />
        </div>

        <h1 className={styles.title}>Order Confirmed! 🎉</h1>
        <p className={styles.subtitle}>
          Thank you{form?.name ? `, ${form.name.split(' ')[0]}` : ''}! Your order is on its way.
        </p>

        <div className={styles.orderCard}>
          <div className={styles.orderRow}>
            <span className={styles.orderLabel}>Order ID</span>
            <span className={styles.orderId}>{orderId}</span>
          </div>
          {form?.address && (
            <div className={styles.orderRow}>
              <span className={styles.orderLabel}>Delivering to</span>
              <span>{form.address}, {form.city}</span>
            </div>
          )}
          {orderTotal && (
            <div className={styles.orderRow}>
              <span className={styles.orderLabel}>Total charged</span>
              <span className={styles.orderTotal}>${orderTotal.toFixed(2)}</span>
            </div>
          )}
          <div className={styles.orderRow}>
            <span className={styles.orderLabel}>Estimated time</span>
            <span>25–40 minutes</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className={styles.progress} aria-label="Order progress">
          {['Order Placed', 'Preparing', 'On the Way', 'Delivered'].map((step, i) => (
            <div key={step} className={styles.progressStep}>
              <div className={`${styles.progressDot} ${i === 0 ? styles.progressActive : ''}`}>
                {i === 0 ? '✓' : i + 1}
              </div>
              <span className={styles.progressLabel}>{step}</span>
              {i < 3 && <div className={styles.progressLine} />}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <Link to="/" className={styles.homeBtn}>
            <Home size={16} /> Back to Home
          </Link>
          <Link to="/restaurants" className={styles.browseBtn}>
            <UtensilsCrossed size={16} /> Order Again
          </Link>
        </div>

        <p className={styles.note}>
          📧 {location.state?.emailSent ? `A confirmation email was sent to ${form?.email}.` : `Email confirmation could not be sent; check the server SMTP settings.`}
        </p>
      </div>
    </main>
  );
}
