import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Menu, X, Search } from 'lucide-react';
import { useCart } from '../../context/CartContext.jsx';
import { useMotion, MOTION_STATE } from '../../context/MotionContext.jsx';
import { useMotionController } from '../../hooks/useMotionController.jsx';
import styles from './Header.module.css';

export function Header() {
  const { itemCount } = useCart();
  const { motionState } = useMotion();
  const { toggle } = useMotionController();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isMotionActive = motionState === MOTION_STATE.ACTIVE || motionState === MOTION_STATE.PAUSED;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/restaurants?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link to="/" className={styles.logo} aria-label="MotionEats home">
          <span className={styles.logoIcon}>🍽️</span>
          <span className={styles.logoText}>Motion<span className={styles.logoBold}>Eats</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav} aria-label="Main navigation">
          <Link to="/restaurants" className={styles.navLink}>Restaurants</Link>
          <Link to="/motion-help" className={styles.navLink}>Motion Guide</Link>
          <Link to="/cart" className={styles.navLink}>Cart</Link>
          <Link to="/login" className={styles.navLink}>Login</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          {/* Search */}
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen(v => !v)}
            aria-label="Search restaurants"
          >
            <Search size={18} />
          </button>

          {/* Motion control button */}
          <button
            className={`${styles.motionBtn} ${isMotionActive ? styles.motionActive : ''}`}
            onClick={toggle}
            aria-pressed={isMotionActive}
            aria-label={isMotionActive ? 'Disable motion control' : 'Enable motion control'}
            title="Toggle motion control"
          >
            <Zap size={16} />
            <span className={styles.motionLabel}>
              {motionState === MOTION_STATE.CAMERA_STARTING ? 'Starting…' :
               isMotionActive ? 'Motion: ON' : 'Motion Control'}
            </span>
          </button>

          {/* Cart */}
          <Link to="/cart" className={styles.cartBtn} aria-label={`Cart, ${itemCount} item${itemCount !== 1 ? 's' : ''}`}>
            <ShoppingCart size={20} />
            {itemCount > 0 && (
              <span className={styles.badge} aria-hidden="true">{itemCount}</span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button
            className={styles.mobileMenu}
            onClick={() => setMobileOpen(v => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className={styles.searchBar}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, cuisines…"
              className={styles.searchInput}
              autoFocus
              aria-label="Search"
            />
            <button type="submit" className={styles.searchSubmit}>Search</button>
          </form>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <div className={styles.mobileNav}>
          <Link to="/restaurants" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Restaurants</Link>
          <Link to="/motion-help" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Motion Guide</Link>
          <Link to="/cart" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Cart {itemCount > 0 && `(${itemCount})`}</Link>
          <Link to="/login" className={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>Login</Link>
          <button
            className={`${styles.mobileMotionBtn} ${isMotionActive ? styles.motionActive : ''}`}
            onClick={() => { toggle(); setMobileOpen(false); }}
          >
            <Zap size={16} />
            {isMotionActive ? 'Disable Motion Control' : 'Enable Motion Control'}
          </button>
        </div>
      )}
    </header>
  );
}
