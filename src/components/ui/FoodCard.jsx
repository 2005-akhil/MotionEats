import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import styles from './FoodCard.module.css';

export function FoodCard({ item, restaurant }) {
  const navigate = useNavigate();
  const { items, addItem, updateQuantity } = useCart();
  const [imgError, setImgError] = useState(false);

  const cartItem = items.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem(item, restaurant);
  };

  const handleBuy = () => {
    addItem(item, restaurant);
    navigate('/checkout');
  };

  const handleIncrease = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrease = () => {
    updateQuantity(item.id, quantity - 1);
  };

  return (
    <div className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={
            imgError
              ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80'
              : item.image
          }
          alt={item.name}
          className={styles.image}
          loading="lazy"
          onError={() => setImgError(true)}
        />

        {item.isPopular && (
          <span className={styles.popularBadge}>🔥 Popular</span>
        )}
      </div>

      <div className={styles.body}>
        <div className={styles.info}>
          <div className={styles.top}>
            <h4 className={styles.name}>{item.name}</h4>

            {item.isVeg ? (
              <span
                className={styles.vegBadge}
                title="Vegetarian"
              >
                🟢
              </span>
            ) : (
              <span
                className={styles.nonVegBadge}
                title="Non-vegetarian"
              >
                🔴
              </span>
            )}
          </div>

          <p className={styles.desc}>{item.description}</p>

          <div className={styles.meta}>
            <span className={styles.rating}>
              <Star size={12} fill="currentColor" />
              {item.rating.toFixed(1)}
            </span>

            <span className={styles.category}>
              {item.category}
            </span>
          </div>
        </div>

        <div className={styles.footer}>
          <span className={styles.price}>
            ${item.price.toFixed(2)}
          </span>

          <div className={styles.actions}>
            {quantity === 0 ? (
              <button
                type="button"
                className={styles.addBtn}
                onClick={handleAdd}
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus size={16} />
                Add
              </button>
            ) : (
              <div
                className={styles.quantityControl}
                role="group"
                aria-label={`${item.name} quantity`}
              >
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={handleDecrease}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>

                <span
                  className={styles.qty}
                  aria-live="polite"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={handleIncrease}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            <button
              type="button"
              className={styles.buyBtn}
              onClick={handleBuy}
              aria-label={`Buy ${item.name} now`}
            >
              <ShoppingBag size={15} />
              Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}