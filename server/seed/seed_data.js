require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const connectToDatabase = require('../db');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Food = require('../models/Food');

const categoriesData = [
  { name: 'High Protein', slug: 'high-protein', icon: 'bi-lightning-charge-fill', description: 'Fuel your fitness with 25g+ protein per serving' },
  { name: 'Keto & Low Carb', slug: 'keto-low-carb', icon: 'bi-fire', description: 'Zero grain, low glycemic index, healthy fats' },
  { name: 'Pure Veg Greens', slug: 'pure-veg-greens', icon: 'bi-flower1', description: '100% plant-powered, fresh farm-harvested greens' },
  { name: 'Detox & Smoothies', slug: 'detox-smoothies', icon: 'bi-cup-straw', description: 'Cold-pressed raw juices and antioxidant smoothie bowls' },
  { name: 'Organic Bowls', slug: 'organic-bowls', icon: 'bi-egg-fried', description: 'Nutrient-rich ancient grains and roasted veggies' },
  { name: 'Calorie Conscious', slug: 'calorie-conscious', icon: 'bi-calculator-fill', description: 'Portion-controlled satisfying meals under 400 kcal' },
  { name: 'Mediterranean Diet', slug: 'mediterranean', icon: 'bi-droplet-fill', description: 'Heart-healthy cold pressed olive oil and lean proteins' },
];

const cities = ['Coimbatore', 'Chennai', 'Bangalore', 'Hosur', 'Kochi'];

const restaurantNames = [
  "Green Leaf Organics", "Macro Kitchen", "NutriBowl Express", "Pure & Clean Eats",
  "The Protein Lab", "Keto Cravers", "Vitality Bowls", "Garden Fresh Cafe",
  "Salad Days Bistro", "Lean & Green Kitchen", "Wholesome Harvest", "Fitness Fuel Hub",
  "Nature's Platter", "Herbivore Haven", "The Sprout Kitchen", "Clean Fuel Diner",
  "Nourish & Flourish", "Earth & Roots", "Zen Garden Cuisine", "Iron & Leaf",
  "Fresh Root Kitchen", "Organica Bistro", "The Healthy Spoon", "Pure Fuel Hub",
  "Green Goddess Cafe", "Farm To Fork", "True Harvest", "Superfood Central",
  "The Avocado Club", "Greens & Grains", "Eco Bowl Bar", "Power Plant Cafe",
  "Vital Fuel Cafe", "NutriCore Kitchen", "Botanical Bowl", "The Fresh Table",
  "Pure Greenery", "Clean Cuisine Co.", "The Macro Box", "Harvest Moon Bowl",
  "Roots & Greens", "The Fit Kitchen", "Alive & Raw", "The Healthy Plate",
  "Pure Nutrition Hub", "The Daily Salad", "Eco Fuel Cafe", "Grain & Sprout",
  "Nature’s Fuel", "The Dietician's Table", "Clean Energy Cafe", "Green Heart Kitchen",
  "Vigor & Vitality", "The Organic Bowl", "Farm Fresh Eats", "The Protein Table",
  "NutriLife Kitchen", "Simply Greens", "Wellness Kitchen", "Pure Life Organics"
];

const dishTemplates = [
  { name: "Grilled Norwegian Salmon Macro Plate", price: 349, cal: 420, p: 38, c: 12, f: 18, veg: false, tags: "High Protein, Keto, Omega-3" },
  { name: "Organic Quinoa Superfood Salad", price: 219, cal: 310, p: 14, c: 42, f: 8, veg: true, tags: "Vegan, Gluten Free, Fiber Rich" },
  { name: "Herb Grilled Chicken Breast & Broccoli", price: 289, cal: 360, p: 44, c: 8, f: 9, veg: false, tags: "High Protein, Low Carb, Lean" },
  { name: "Mediterranean Hummus & Falafel Plate", price: 239, cal: 380, p: 16, c: 48, f: 14, veg: true, tags: "Plant Powered, Clean Eats" },
  { name: "Acai Berry Antioxidant Smoothie Bowl", price: 199, cal: 260, p: 8, c: 45, f: 6, veg: true, tags: "Detox, Vitamin C, Raw" },
  { name: "Avocado Sourdough Toast with Poached Egg", price: 229, cal: 340, p: 18, c: 28, f: 16, veg: false, tags: "Healthy Fats, High Energy" },
  { name: "Spiced Paneer Tikka Protein Platter", price: 269, cal: 390, p: 26, c: 14, f: 22, veg: true, tags: "Pure Veg, High Protein" },
  { name: "Steamed Edamame & Teriyaki Tofu Bowl", price: 249, cal: 320, p: 24, c: 26, f: 11, veg: true, tags: "Vegan, Protein Rich" },
  { name: "Keto Creamy Almond Zucchini Noodles", price: 259, cal: 290, p: 12, c: 9, f: 24, veg: true, tags: "Keto, Low Carb, Diabetic Friendly" },
  { name: "Grilled Turkey & Spinach Power Wrap", price: 279, cal: 350, p: 32, c: 30, f: 9, veg: false, tags: "High Protein, Whole Wheat" },
  { name: "Brown Rice & Lentil Detox Bowl", price: 189, cal: 330, p: 15, c: 54, f: 5, veg: true, tags: "Ayurvedic, Clean Gut" },
  { name: "Matcha Chia Seed Coconut Pudding", price: 169, cal: 210, p: 7, c: 22, f: 10, veg: true, tags: "Superfood, Zero Refined Sugar" },
];

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToDatabase();
    console.log('MongoDB connected successfully!');

    // 1. Create Default Users
    console.log('Seeding Default Users...');
    await User.deleteMany({});
    
    const adminUser = new User({
      username: 'admin',
      email: 'admin@healthyfuture.com',
      password: 'admin@123',
      first_name: 'Super',
      last_name: 'Administrator',
      role: 'admin',
      phone: '9998887770',
      city: 'Coimbatore',
    });
    await adminUser.save();

    const ownerUser = new User({
      username: 'healthyowner',
      email: 'owner@healthyfuture.com',
      password: 'Owner@12345',
      first_name: 'Raghav',
      last_name: 'Chef',
      role: 'hotel_owner',
      phone: '9887766554',
      city: 'Coimbatore',
    });
    await ownerUser.save();

    const customerUser = new User({
      username: 'boobesh',
      email: 'boobesh@example.com',
      password: 'User@12345',
      first_name: 'Boobesh',
      last_name: 'Kumar',
      role: 'customer',
      phone: '9876543210',
      city: 'Coimbatore',
      address: '124, Healthy Boulevard, Near Race Course',
    });
    await customerUser.save();
    console.log('Created admin, healthyowner, and boobesh users.');

    // 2. Categories
    console.log('Seeding Categories...');
    await Category.deleteMany({});
    const createdCategories = [];
    for (let i = 0; i < categoriesData.length; i++) {
      const cat = new Category({ ...categoriesData[i], display_order: i });
      await cat.save();
      createdCategories.push(cat);
    }
    console.log(`Created ${createdCategories.length} categories.`);

    // 3. Restaurants (60)
    console.log('Seeding 60 Healthy Restaurants...');
    await Restaurant.deleteMany({});
    const createdRestaurants = [];

    for (let i = 0; i < restaurantNames.length; i++) {
      const name = restaurantNames[i];
      const city = cities[i % cities.length];
      const is_pure_veg = i % 3 === 0; // 1 out of 3 pure veg
      const delivery_time_mins = 20 + ((i * 5) % 30);
      const rating = (4.4 + (i % 6) * 0.1).toFixed(1);

      const rest = new Restaurant({
        name,
        owner: ownerUser._id,
        description: `Premium nutrition kitchen in ${city} crafting certified clean meals with locally sourced organic produce.`,
        tagline: is_pure_veg ? '100% Pure Vegetarian Clean Nutrition' : 'Macro-Balanced Chef Prepared Meals',
        cuisine: is_pure_veg ? 'Pure Veg, Salads & Detox Bowls' : 'High Protein, Mediterranean & Keto',
        city,
        address: `${100 + i}, Green Park Avenue, ${city}`,
        phone: `984${String(1000000 + i).slice(-7)}`,
        rating: parseFloat(rating),
        total_reviews: 80 + (i * 12),
        delivery_time_mins,
        delivery_charge: i % 4 === 0 ? 0 : 30,
        minimum_order: 100,
        is_pure_veg,
        is_approved: true,
        is_featured: i < 8,
        logo_image: `https://images.unsplash.com/photo-${1550000000000 + (i * 100000)}?auto=format&fit=crop&w=300&q=80`,
        banner_image: `https://images.unsplash.com/photo-${1540000000000 + (i * 100000)}?auto=format&fit=crop&w=1200&q=80`,
      });

      await rest.save();
      createdRestaurants.push(rest);
    }
    console.log(`Created ${createdRestaurants.length} restaurants across ${cities.join(', ')}.`);

    // 4. Foods (720 dishes: 12 dishes per restaurant * 60 restaurants = 720 dishes)
    console.log('Seeding 720 dishes with certified macronutrient counts...');
    await Food.deleteMany({});
    let totalFoodsCount = 0;

    for (let rIdx = 0; rIdx < createdRestaurants.length; rIdx++) {
      const rest = createdRestaurants[rIdx];

      for (let dIdx = 0; dIdx < dishTemplates.length; dIdx++) {
        const template = dishTemplates[dIdx];
        const cat = createdCategories[dIdx % createdCategories.length];
        const isVeg = rest.is_pure_veg ? true : template.veg;

        const food = new Food({
          name: `${rest.name.split(' ')[0]}'s ${template.name}`,
          restaurant: rest._id,
          category: cat._id,
          description: `Chef crafted with certified nutrition. Zero refined sugars, zero seed-oils, 100% organic farm produce.`,
          ingredients: `Fresh farm produce, cold-pressed virgin olive oil, Himalayan pink salt, organic herbs and superfoods.`,
          price: template.price,
          original_price: Math.round(template.price * 1.2),
          calories: template.cal,
          protein_g: isVeg && !template.veg ? 24.0 : template.p,
          carbs_g: template.c,
          fat_g: template.f,
          fiber_g: Math.round(template.c * 0.15) || 5,
          is_veg: isVeg,
          is_available: true,
          is_featured: dIdx === 0,
          rating: (4.6 + (dIdx % 4) * 0.1).toFixed(1),
          tags: template.tags,
          image: `https://images.unsplash.com/photo-${1546000000000 + (dIdx * 200000)}?auto=format&fit=crop&w=600&q=80`,
        });

        await food.save();
        totalFoodsCount++;
      }
    }
    console.log(`Successfully seeded ${totalFoodsCount} certified healthy dishes into MongoDB!`);
    console.log('====================================================');
    console.log('MongoDB Seeding Completed Successfully for Healthy Future!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seedDatabase();
