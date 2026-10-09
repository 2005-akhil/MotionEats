import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { CUISINE_CATEGORIES, searchRestaurants } from '../data/restaurants.js';
import { RestaurantCard } from '../components/ui/RestaurantCard.jsx';
import styles from './RestaurantsPage.module.css';

export function RestaurantsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';
  const selectedCuisine = searchParams.get('cuisine') || 'all';

  const [query, setQuery] = useState(urlQuery);
  const [sortBy, setSortBy] = useState('rating');

  const results = useMemo(() => {
    let list = searchRestaurants(urlQuery || query, selectedCuisine === 'all' ? null : selectedCuisine);
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'delivery') list = [...list].sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
    else if (sortBy === 'fee') list = [...list].sort((a, b) => a.deliveryFee - b.deliveryFee);
    return list;
  }, [urlQuery, query, selectedCuisine, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query) params.q = query;
    if (selectedCuisine !== 'all') params.cuisine = selectedCuisine;
    setSearchParams(params);
  };

  const handleCuisineChange = (id) => {
    const params = {};
    if (query) params.q = query;
    if (id !== 'all') params.cuisine = id;
    setSearchParams(params);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Restaurants</h1>
          <p className={styles.pageSubtitle}>{results.length} restaurant{results.length !== 1 ? 's' : ''} available</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <div className={styles.searchWrap}>
            <Search size={18} className={styles.searchIcon} />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search restaurants, cuisines, tags…"
              className={styles.searchInput}
              aria-label="Search restaurants"
            />
            {query && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => { setQuery(''); setSearchParams({}); }}
                aria-label="Clear search"
              >×</button>
            )}
          </div>
          <button type="submit" className={styles.searchBtn}>Search</button>
        </form>

        {/* Cuisine filters */}
        <div className={styles.filters} role="group" aria-label="Filter by cuisine">
          <div className={styles.cuisineFilters}>
            {CUISINE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${selectedCuisine === cat.id ? styles.filterActive : ''}`}
                onClick={() => handleCuisineChange(cat.id)}
                aria-pressed={selectedCuisine === cat.id}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className={styles.sortWrap}>
            <SlidersHorizontal size={14} />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={styles.sortSelect}
              aria-label="Sort restaurants"
            >
              <option value="rating">Top Rated</option>
              <option value="delivery">Fastest Delivery</option>
              <option value="fee">Lowest Fee</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyEmoji}>🔍</span>
            <h3>No restaurants found</h3>
            <p>Try a different search or cuisine filter.</p>
            <button
              className={styles.resetBtn}
              onClick={() => { setQuery(''); setSelectedCuisine('all'); setSearchParams({}); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {results.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
          </div>
        )}
      </div>
    </main>
  );
}
