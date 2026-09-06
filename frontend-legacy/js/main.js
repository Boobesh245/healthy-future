/**
 * Healthy Future - Core UI Utilities
 * Reusable components, formatters, and interactive elements
 */

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `custom-toast ${type}`;
  let icon = 'bi-info-circle-fill text-primary';
  if (type === 'success') icon = 'bi-check-circle-fill text-success';
  if (type === 'error') icon = 'bi-exclamation-triangle-fill text-danger';

  toast.innerHTML = `
    <i class="bi ${icon} fs-5"></i>
    <div class="flex-grow-1">${message}</div>
    <button type="button" class="btn-close btn-close-white ms-2" onclick="this.parentElement.remove()"></button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 4000);
}

function renderRestaurantCard(r) {
  const rating = parseFloat(r.rating || 4.5).toFixed(1);
  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="restaurant-card" onclick="location.href='/frontend/restaurant-details.html?id=${r.id}'" style="cursor: pointer;">
        <div class="restaurant-img-wrapper">
          <img src="${r.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'}" alt="${r.name}" loading="lazy">
          <div class="rating-badge">
            <i class="bi bi-star-fill"></i> ${rating}
          </div>
          <div class="delivery-badge">
            <i class="bi bi-clock-fill text-success"></i> ${r.delivery_time} mins
          </div>
        </div>
        <div class="restaurant-body">
          <div class="restaurant-name" title="${r.name}">${r.name}</div>
          <div class="restaurant-cuisine">${r.cuisine}</div>
          <div class="restaurant-footer">
            <span><i class="bi bi-geo-alt-fill text-danger me-1"></i>${r.city}</span>
            <span class="fw-bold text-dark">${parseFloat(r.delivery_charge) === 0 ? '<span class="text-success">Free Delivery</span>' : `₹${r.delivery_charge} delivery`}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFoodCard(f) {
  const typeClass = (f.food_type || 'Veg').toLowerCase().replace('-', '');
  const rating = parseFloat(f.rating || 4.5).toFixed(1);
  const tags = (f.health_tags || '').split(',').map(t => t.trim()).filter(Boolean);

  return `
    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
      <div class="food-card">
        <div class="food-img-wrapper">
          <img src="${f.image || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80'}" alt="${f.food_name}" loading="lazy" onclick="viewFoodDetails(${f.id})" style="cursor:pointer;">
          <div class="food-type-icon" title="${f.food_type}">
            <span class="type-dot ${typeClass}"></span>
          </div>
          <div class="rating-badge">
            <i class="bi bi-star-fill"></i> ${rating}
          </div>
        </div>
        <div class="food-body">
          <div class="food-title" title="${f.food_name}" onclick="viewFoodDetails(${f.id})" style="cursor:pointer;">${f.food_name}</div>
          <div class="food-restaurant">
            <a href="/frontend/restaurant-details.html?id=${f.restaurant}" class="text-muted"><i class="bi bi-shop me-1"></i>${f.restaurant_name}</a>
          </div>
          <div class="food-desc">${f.description || ''}</div>
          
          <div class="macro-pills-row">
            <span class="macro-pill cal" title="Calories"><i class="bi bi-fire"></i>${f.calories} kcal</span>
            <span class="macro-pill prot" title="Protein"><i class="bi bi-lightning-charge"></i>${f.protein}g P</span>
            <span class="macro-pill carb" title="Carbs"><i class="bi bi-pie-chart"></i>${f.carbohydrates}g C</span>
            <span class="macro-pill fat" title="Healthy Fat"><i class="bi bi-droplet"></i>${f.fat}g F</span>
          </div>

          <div class="health-tags-row">
            ${tags.slice(0, 2).map(tag => `<span class="tag-badge highlight">${tag}</span>`).join('')}
          </div>

          <div class="food-card-bottom">
            <div class="food-price">₹${f.price}</div>
            <button class="btn btn-add-cart" onclick="Cart.addToCart(${f.id}, 1)">
              <i class="bi bi-plus-lg me-1"></i>Add
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function viewFoodDetails(foodId) {
  // Can navigate to food-details.html or display modal
  window.location.href = `/frontend/food-details.html?id=${foodId}`;
}
