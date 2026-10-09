import { Link } from 'react-router-dom';
import { Star, Clock, Bike } from 'lucide-react';
import styles from './RestaurantCard.module.css';

export function RestaurantCard({ restaurant }) {
  const { id, name, cuisine, rating, reviewCount, deliveryTime, deliveryFee, image, tags, isOpen, isFeatured, priceRange } = restaurant;

  return (
    <Link
      to={`/restaurant/${id}`}
      className={`${styles.card} ${!isOpen ? styles.closed : ''}`}
      aria-label={`${name} - ${cuisine}, ${rating} stars, ${deliveryTime} delivery`}
    >
      <div className={styles.imageWrap}>
        <img
          src={image}
          alt={name}
          className={styles.image}
          loading="lazy"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80'; }}
        />
        {isFeatured && <span className={styles.featuredBadge}>⭐ Featured</span>}
        {!isOpen && <div className={styles.closedOverlay}>Closed</div>}
      </div>

      <div className={styles.body}>
        <div className={styles.top}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.price}>{priceRange}</span>
        </div>

        <p className={styles.cuisine}>{cuisine}</p>

        <div className={styles.tags}>
          {tags.slice(0, 2).map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.meta}>
          <span className={styles.rating}>
            <Star size={13} fill="currentColor" />
            {rating.toFixed(1)}
            <span className={styles.reviewCount}>({reviewCount})</span>
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.metaItem}>
            <Clock size={13} />
            {deliveryTime}
          </span>
          <span className={styles.dot}>·</span>
          <span className={styles.metaItem}>
            <Bike size={13} />
            {deliveryFee === 0 ? 'Free' : `$${deliveryFee.toFixed(2)}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
