import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState([]);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [pureVegOnly, setPureVegOnly] = useState(searchParams.get('veg') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'rating');

  useEffect(() => {
    fetchRestaurants();
  }, [searchParams]);

  const fetchRestaurants = async () => {
    setLoading(true);
    const params = {
      search: searchParams.get('search') || undefined,
      city: searchParams.get('city') || undefined,
      pure_veg: searchParams.get('veg') === 'true' ? true : undefined,
      ordering: searchParams.get('sort') === 'delivery' ? 'delivery_time_mins' : '-rating'
    };

    const res = await api.get('/restaurants/', params);
    if (res.success && res.data) {
      const list = res.data.results || res.data;
      setRestaurants(Array.isArray(list) ? list : []);
      
      // Extract unique cities
      const uniqueCities = [...new Set((Array.isArray(list) ? list : []).map(r => r.city).filter(Boolean))];
      if (uniqueCities.length > 0) {
        setCities(prev => [...new Set([...prev, ...uniqueCities])]);
      }
    }
    setLoading(false);
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCity) params.city = selectedCity;
    if (pureVegOnly) params.veg = 'true';
    if (sortBy) params.sort = sortBy;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCity('');
    setPureVegOnly(false);
    setSortBy('rating');
    setSearchParams({});
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h3 fw-bold mb-1">
            <i className="bi bi-shop text-success me-2"></i>
            Healthy Kitchens & Restaurants
          </h1>
          <p className="text-muted mb-0">
            Browse verified kitchens preparing nutrient-dense, clean meals with certified macros.
          </p>
        </div>
        <div className="badge bg-success-subtle text-success fs-6 px-3 py-2 rounded-pill mt-2 mt-md-0">
          <i className="bi bi-shield-check me-1"></i> {restaurants.length} Verified Outlets
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card shadow-sm border-0 mb-4 bg-white rounded-3">
        <div className="card-body p-3">
          <form onSubmit={handleApplyFilters} className="row g-2 align-items-center">
            {/* Search */}
            <div className="col-12 col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 bg-light"
                  placeholder="Search restaurant or cuisine..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* City */}
            <div className="col-6 col-md-3">
              <select
                className="form-select bg-light"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="col-6 col-md-2">
              <select
                className="form-select bg-light"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="rating">Top Rated</option>
                <option value="delivery">Fastest Delivery</option>
              </select>
            </div>

            {/* Veg Checkbox & Actions */}
            <div className="col-12 col-md-3 d-flex align-items-center gap-2">
              <div className="form-check me-auto">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="vegOnlyCheck"
                  checked={pureVegOnly}
                  onChange={(e) => setPureVegOnly(e.target.checked)}
                />
                <label className="form-check-label small fw-semibold text-success" htmlFor="vegOnlyCheck">
                  Pure Veg
                </label>
              </div>

              <button type="submit" className="btn btn-success btn-sm px-3">
                Apply
              </button>
              {(search || selectedCity || pureVegOnly || sortBy !== 'rating') && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleClearFilters}
                  title="Reset Filters"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Restaurant Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading restaurants...</span>
          </div>
          <p className="text-muted mt-2">Discovering healthy kitchens near you...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm my-4">
          <i className="bi bi-cup-hot text-muted" style={{ fontSize: '3rem' }}></i>
          <h4 className="fw-bold mt-3">No Restaurants Found</h4>
          <p className="text-muted mb-3">Try adjusting your filters or searching for something else.</p>
          <button className="btn btn-outline-success" onClick={handleClearFilters}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {restaurants.map(rest => (
            <div className="col-12 col-md-6 col-lg-4" key={rest.id}>
              <RestaurantCard restaurant={rest} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantsPage;
