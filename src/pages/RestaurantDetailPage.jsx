import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Bike, MapPin } from 'lucide-react';
import { getRestaurantById } from '../data/restaurants.js';
import { FoodCard } from '../components/ui/FoodCard.jsx';
import styles from './RestaurantDetailPage.module.css';

export function RestaurantDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const restaurant = getRestaurantById(id);
  const [activeCategory, setActiveCategory] = useState('all');

  if (!restaurant) {
    return (
      <main className={styles.main}>
        <div className={styles.notFound}>
          <span>🍽️</span>
          <h2>Restaurant not found</h2>
          <Link to="/restaurants" className={styles.backLink}>← Back to Restaurants</Link>
        </div>
      </main>
    );
  }

  const categories = ['all', ...new Set(restaurant.menu.map(item => item.category))];
  const filteredMenu = activeCategory === 'all'
    ? restaurant.menu
    : restaurant.menu.filter(item => item.category === activeCategory);

  return (
    <main className={styles.main}>
      {/* Hero */}
      <div className={styles.hero}>
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className={styles.heroImg}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'; }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <button
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className={styles.heroInfo}>
            <h1 className={styles.name}>{restaurant.name}</h1>
            <p className={styles.cuisine}>{restaurant.cuisine} · {restaurant.priceRange}</p>
            <div className={styles.meta}>
              <span className={styles.metaItem}>
                <Star size={14} fill="#FFD700" stroke="none" />
                {restaurant.rating.toFixed(1)} ({restaurant.reviewCount})
              </span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaItem}>
                <Clock size={14} />
                {restaurant.deliveryTime}
              </span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaItem}>
                <Bike size={14} />
                {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
              </span>
              <span className={styles.metaDot}>·</span>
              <span className={styles.metaItem}>
                <MapPin size={14} />
                {restaurant.address}
              </span>
            </div>
            {!restaurant.isOpen && (
              <span className={styles.closedBadge}>Currently Closed</span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Description */}
        <p className={styles.description}>{restaurant.description}</p>

        {/* Category tabs */}
        <div className={styles.categoryTabs} role="tablist" aria-label="Menu categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.catTab} ${activeCategory === cat ? styles.catTabActive : ''}`}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Menu items */}
        <div className={styles.menuGrid} aria-label="Menu items">
          {filteredMenu.map(item => (
            <FoodCard key={item.id} item={item} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </main>
  );
}
