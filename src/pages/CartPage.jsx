import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import styles from './CartPage.module.css';

export function CartPage() {
  const { items, subtotal, deliveryFee, total, itemCount, restaurantName, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <main className={styles.main}>
        <div className={styles.emptyState}>
          <ShoppingBag size={64} className={styles.emptyIcon} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/restaurants" className={styles.browseCta}>
            Browse Restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/restaurants" className={styles.backLink}>
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
          <h1 className={styles.title}>Your Cart</h1>
          {restaurantName && (
            <p className={styles.restaurantName}>From: {restaurantName}</p>
          )}
        </div>

        <div className={styles.layout}>
          {/* Cart items */}
          <section className={styles.itemsSection} aria-label="Cart items">
            <div className={styles.itemsList}>
              {items.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            <button className={styles.clearBtn} onClick={clearCart}>
              <Trash2 size={14} /> Clear cart
            </button>
          </section>

          {/* Order summary */}
          <aside className={styles.summary} aria-label="Order summary">
            <h2 className={styles.summaryTitle}>Order Summary</h2>

            <div className={styles.summaryRows}>
              <div className={styles.summaryRow}>
                <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Taxes & fees</span>
                <span>${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>${(total + subtotal * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <Link to="/checkout" className={styles.checkoutBtn}>
              Proceed to Checkout
            </Link>

            <p className={styles.secureNote}>🔒 Secure mock checkout</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className={styles.cartItem}>
      <img
        src={item.image}
        alt={item.name}
        className={styles.itemImage}
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80'; }}
      />
      <div className={styles.itemInfo}>
        <h3 className={styles.itemName}>{item.name}</h3>
        <p className={styles.itemPrice}>${item.price.toFixed(2)} each</p>
      </div>
      <div className={styles.itemControls}>
        <div className={styles.qtyControl} role="group" aria-label={`${item.name} quantity`}>
          <button className={styles.qtyBtn} onClick={onDecrease} aria-label="Decrease">
            <Minus size={13} />
          </button>
          <span className={styles.qty} aria-live="polite">{item.quantity}</span>
          <button className={styles.qtyBtn} onClick={onIncrease} aria-label="Increase">
            <Plus size={13} />
          </button>
        </div>
        <span className={styles.itemTotal}>${(item.price * item.quantity).toFixed(2)}</span>
        <button className={styles.removeBtn} onClick={onRemove} aria-label={`Remove ${item.name}`}>
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
