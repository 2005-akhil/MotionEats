import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Star } from 'lucide-react';
import { RESTAURANTS, CUISINE_CATEGORIES } from '../data/restaurants.js';
import { RestaurantCard } from '../components/ui/RestaurantCard.jsx';
import styles from './HomePage.module.css';

const HERO_SLIDES = [
  { emoji: '🍛', title: 'Authentic Indian', sub: 'Bold spices, rich curries', color: '#FF6B35' },
  { emoji: '🍕', title: 'Wood-Fired Pizza', sub: 'Crispy, cheesy, perfect', color: '#E55A28' },
  { emoji: '🍔', title: 'Craft Burgers', sub: 'Premium beef, artisan buns', color: '#D44B22' },
  { emoji: '🍜', title: 'Asian Noodles', sub: 'Ramen, Pad Thai & more', color: '#C43D1B' },
];

export function HomePage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const featured = RESTAURANTS.filter(r => r.isFeatured);
  const topRated = [...RESTAURANTS].sort((a, b) => b.rating - a.rating).slice(0, 4);

  // Auto-rotate hero
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx(i => (i + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[heroIdx];

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section className={styles.hero} style={{ '--hero-color': slide.color }}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <span className={styles.heroPill}>
              <Zap size={14} />
              Motion-controlled ordering
            </span>
            <h1 className={styles.heroTitle}>
              Food you love,<br />
              <span className={styles.heroAccent}>delivered fast</span>
            </h1>
            <p className={styles.heroSub}>
              Order from the best restaurants nearby. Use your hands — or just your camera — to browse, add to cart, and checkout.
            </p>
            <div className={styles.heroActions}>
              <Link to="/restaurants" className={styles.heroCta}>
                Order Now <ArrowRight size={18} />
              </Link>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <strong>8+</strong>
                  <span>Restaurants</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <strong>30 min</strong>
                  <span>Avg delivery</span>
                </div>
                <div className={styles.heroStatDivider} />
                <div className={styles.heroStat}>
                  <strong>4.6★</strong>
                  <span>Avg rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Animated slide */}
          <div className={styles.heroVisual}>
            <div className={styles.slideCard} key={heroIdx}>
              <span className={styles.slideEmoji}>{slide.emoji}</span>
              <strong>{slide.title}</strong>
              <span>{slide.sub}</span>
            </div>
            {/* Dots */}
            <div className={styles.dots} role="tablist" aria-label="Hero slides">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === heroIdx ? styles.dotActive : ''}`}
                  onClick={() => setHeroIdx(i)}
                  role="tab"
                  aria-selected={i === heroIdx}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>What are you craving?</h2>
          <div className={styles.categories}>
            {CUISINE_CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                to={`/restaurants?cuisine=${cat.id}`}
                className={styles.catCard}
                aria-label={`Browse ${cat.label} restaurants`}
              >
                <span className={styles.catEmoji}>{cat.emoji}</span>
                <span className={styles.catLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured restaurants */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Restaurants</h2>
            <Link to="/restaurants" className={styles.viewAll}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.restaurantGrid}>
            {featured.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Star size={20} fill="#F59E0B" stroke="none" />
              Highest Rated
            </h2>
            <Link to="/restaurants" className={styles.viewAll}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.restaurantGrid}>
            {topRated.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        </div>
      </section>

      {/* Motion control promo */}
      <section className={styles.motionPromo}>
        <div className={styles.container}>
          <div className={styles.promoCard}>
            <div className={styles.promoContent}>
              <span className={styles.promoEmoji}>🖐️</span>
              <div>
                <h3>Try Hands-Free Ordering</h3>
                <p>Enable motion control in the header to navigate and order using just your webcam. No hands on the keyboard required.</p>
              </div>
            </div>
            <div className={styles.promoGestures}>
              <GestureItem emoji="☝️" label="Point" desc="Move cursor" />
              <GestureItem emoji="🤏" label="Pinch" desc="Click" />
              <GestureItem emoji="👍" label="Thumbs Up" desc="Scroll up" />
              <GestureItem emoji="👎" label="Thumbs Down" desc="Scroll down" />
              <GestureItem emoji="✊" label="Fist" desc="Next" />
              <GestureItem emoji="🖐️" label="Open Palm" desc="Back" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function GestureItem({ emoji, label, desc }) {
  return (
    <div className={styles.gestureItem}>
      <span className={styles.gestureEmoji}>{emoji}</span>
      <strong>{label}</strong>
      <span>{desc}</span>
    </div>
  );
}
