import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>🍽️ <strong>Motion</strong><span>Eats</span></span>
          <p className={styles.tagline}>Delivered fresh, controlled by you.</p>
        </div>
        <nav className={styles.links} aria-label="Footer navigation">
          <Link to="/restaurants">Restaurants</Link>
          <Link to="/motion-help">Motion Guide</Link>
          <Link to="/cart">Cart</Link>
        </nav>
        <p className={styles.copy}>© 2024 MotionEats. All rights reserved.</p>
      </div>
    </footer>
  );
}
