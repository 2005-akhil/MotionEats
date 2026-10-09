// MotionEats - 30 restaurants × 10 menu items = 300 food items

export const CUISINE_CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🍽️' },
  { id: 'indian', label: 'Indian', emoji: '🍛' },
  { id: 'burger', label: 'Burgers', emoji: '🍔' },
  { id: 'pizza', label: 'Pizza', emoji: '🍕' },
  { id: 'noodles', label: 'Noodles', emoji: '🍜' },
  { id: 'chinese', label: 'Chinese', emoji: '🥡' },
  { id: 'south-indian', label: 'South Indian', emoji: '🥞' },
  { id: 'healthy', label: 'Healthy', emoji: '🥗' },
  { id: 'wraps', label: 'Wraps', emoji: '🌯' },
  { id: 'desserts', label: 'Desserts', emoji: '🍰' },
  { id: 'cafe', label: 'Cafe', emoji: '☕' },
];

const images = {
  burger:
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  pizza:
    'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80',
  biryani:
    'https://images.unsplash.com/photo-1563379091339-03246963d96b?w=600&q=80',
  noodles:
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  dosa:
    'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80',
  dessert:
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
  healthy:
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  chicken:
    'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&q=80',
  paneer:
    'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&q=80',
  cafe:
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80',
};

// Helper to create menu items consistently.
function makeItem(
  id,
  name,
  price,
  category,
  image,
  isVeg = false,
  isPopular = false
) {
  return {
    id,
    name,
    description: `${name} prepared fresh with quality ingredients and MotionEats-style flavor.`,
    price,
    image,
    category,
    isVeg,
    isPopular,
    rating: Number((4.2 + (id.length % 7) / 10).toFixed(1)),
  };
}

function makeRestaurant(
  id,
  name,
  cuisine,
  cuisineId,
  tags,
  description,
  address,
  image,
  menu
) {
  return {
    id,
    name,
    cuisine,
    cuisineId,
    rating: 4.2 + ((id.charCodeAt(1) || 1) % 7) / 10,
    reviewCount: 300 + id.charCodeAt(1) * 35,
    deliveryTime: '20-35 min',
    deliveryFee: 1.99,
    minOrder: 10,
    priceRange: '$$',
    isOpen: true,
    isFeatured: Number(id.slice(1)) <= 8,
    tags,
    image,
    description,
    address,
    menu,
  };
}

export const RESTAURANTS = [
  makeRestaurant(
    'r1',
    'Spice Route',
    'Indian',
    'indian',
    ['Biryani', 'Indian', 'Popular'],
    'Authentic Indian food with rich spices and traditional recipes.',
    '42 Curry Lane',
    images.biryani,
    [
      makeItem('r1-1', 'Chicken Biryani', 15.99, 'Biryani', images.biryani, false, true),
      makeItem('r1-2', 'Mutton Biryani', 18.99, 'Biryani', images.biryani, false, true),
      makeItem('r1-3', 'Veg Biryani', 12.99, 'Biryani', images.biryani, true),
      makeItem('r1-4', 'Butter Chicken', 16.99, 'Mains', images.chicken, false, true),
      makeItem('r1-5', 'Paneer Tikka Masala', 14.99, 'Mains', images.paneer, true),
      makeItem('r1-6', 'Dal Makhani', 11.99, 'Mains', images.paneer, true),
      makeItem('r1-7', 'Garlic Naan', 4.49, 'Breads', images.paneer, true),
      makeItem('r1-8', 'Chicken Tikka', 13.99, 'Starters', images.chicken, false),
      makeItem('r1-9', 'Mango Lassi', 5.49, 'Drinks', images.cafe, true),
      makeItem('r1-10', 'Gulab Jamun', 5.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r2',
    'Burger Lab',
    'American',
    'burger',
    ['Burgers', 'Fast Food', 'Popular'],
    'Handcrafted burgers, crispy fries and refreshing shakes.',
    '18 Grill Street',
    images.burger,
    [
      makeItem('r2-1', 'Classic Smash Burger', 13.99, 'Burgers', images.burger, false, true),
      makeItem('r2-2', 'Cheese Burger', 14.49, 'Burgers', images.burger, false, true),
      makeItem('r2-3', 'BBQ Bacon Burger', 16.99, 'Burgers', images.burger),
      makeItem('r2-4', 'Crispy Chicken Burger', 14.99, 'Burgers', images.chicken, false, true),
      makeItem('r2-5', 'Veggie Burger', 12.99, 'Burgers', images.burger, true),
      makeItem('r2-6', 'Spicy Chicken Burger', 15.49, 'Burgers', images.chicken, false),
      makeItem('r2-7', 'French Fries', 5.99, 'Sides', images.burger, true),
      makeItem('r2-8', 'Cheese Fries', 7.49, 'Sides', images.burger, true),
      makeItem('r2-9', 'Chocolate Shake', 6.99, 'Drinks', images.dessert, true),
      makeItem('r2-10', 'Strawberry Shake', 6.99, 'Drinks', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r3',
    'Green Bowl',
    'Healthy',
    'healthy',
    ['Healthy', 'Vegan', 'Fresh'],
    'Fresh bowls, salads and nutritious meals.',
    '7 Wellness Way',
    images.healthy,
    [
      makeItem('r3-1', 'Buddha Bowl', 14.99, 'Bowls', images.healthy, true, true),
      makeItem('r3-2', 'Avocado Salad', 12.99, 'Salads', images.healthy, true),
      makeItem('r3-3', 'Paneer Power Bowl', 15.49, 'Bowls', images.paneer, true),
      makeItem('r3-4', 'Chicken Power Bowl', 16.99, 'Bowls', images.chicken),
      makeItem('r3-5', 'Quinoa Salad', 13.49, 'Salads', images.healthy, true),
      makeItem('r3-6', 'Greek Salad', 12.49, 'Salads', images.healthy, true),
      makeItem('r3-7', 'Fruit Bowl', 9.99, 'Bowls', images.healthy, true),
      makeItem('r3-8', 'Grilled Chicken Salad', 15.99, 'Salads', images.chicken),
      makeItem('r3-9', 'Green Smoothie', 6.99, 'Drinks', images.healthy, true),
      makeItem('r3-10', 'Protein Wrap', 11.99, 'Wraps', images.healthy, false),
    ]
  ),

  makeRestaurant(
    'r4',
    'Pizza Palace',
    'Italian',
    'pizza',
    ['Pizza', 'Italian', 'Cheesy'],
    'Wood-fired pizzas with fresh toppings and handmade dough.',
    '21 Pizza Avenue',
    images.pizza,
    [
      makeItem('r4-1', 'Margherita Pizza', 13.99, 'Pizza', images.pizza, true, true),
      makeItem('r4-2', 'Pepperoni Pizza', 16.99, 'Pizza', images.pizza, false, true),
      makeItem('r4-3', 'Farmhouse Pizza', 15.49, 'Pizza', images.pizza, true),
      makeItem('r4-4', 'Paneer Pizza', 15.99, 'Pizza', images.pizza, true),
      makeItem('r4-5', 'Chicken Tikka Pizza', 17.49, 'Pizza', images.pizza),
      makeItem('r4-6', 'Four Cheese Pizza', 17.99, 'Pizza', images.pizza, true),
      makeItem('r4-7', 'Garlic Bread', 6.99, 'Sides', images.pizza, true),
      makeItem('r4-8', 'Cheese Garlic Bread', 8.49, 'Sides', images.pizza, true),
      makeItem('r4-9', 'Tiramisu', 7.99, 'Desserts', images.dessert, true),
      makeItem('r4-10', 'Chocolate Brownie', 6.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r5',
    'Wok Express',
    'Chinese',
    'chinese',
    ['Chinese', 'Noodles', 'Asian'],
    'Chinese favorites, noodles, rice and spicy wok dishes.',
    '15 Wok Road',
    images.noodles,
    [
      makeItem('r5-1', 'Hakka Noodles', 11.99, 'Noodles', images.noodles, true, true),
      makeItem('r5-2', 'Chicken Noodles', 13.99, 'Noodles', images.noodles),
      makeItem('r5-3', 'Schezwan Noodles', 12.99, 'Noodles', images.noodles, true),
      makeItem('r5-4', 'Veg Fried Rice', 11.49, 'Rice', images.noodles, true),
      makeItem('r5-5', 'Chicken Fried Rice', 13.49, 'Rice', images.noodles),
      makeItem('r5-6', 'Veg Manchurian', 10.99, 'Starters', images.noodles, true),
      makeItem('r5-7', 'Chicken Manchurian', 13.49, 'Starters', images.chicken),
      makeItem('r5-8', 'Spring Rolls', 8.99, 'Starters', images.noodles, true),
      makeItem('r5-9', 'Chilli Paneer', 12.49, 'Starters', images.paneer, true),
      makeItem('r5-10', 'Momos', 9.99, 'Momos', images.noodles, true),
    ]
  ),

  makeRestaurant(
    'r6',
    'Dosa House',
    'South Indian',
    'south-indian',
    ['Dosa', 'South Indian', 'Vegetarian'],
    'Crispy dosas, idli, vada and South Indian breakfast classics.',
    '12 Temple Road',
    images.dosa,
    [
      makeItem('r6-1', 'Masala Dosa', 9.99, 'Dosa', images.dosa, true, true),
      makeItem('r6-2', 'Plain Dosa', 7.99, 'Dosa', images.dosa, true),
      makeItem('r6-3', 'Cheese Dosa', 10.99, 'Dosa', images.dosa, true),
      makeItem('r6-4', 'Paneer Dosa', 11.99, 'Dosa', images.dosa, true),
      makeItem('r6-5', 'Idli Sambar', 7.49, 'Breakfast', images.dosa, true),
      makeItem('r6-6', 'Medu Vada', 7.99, 'Breakfast', images.dosa, true),
      makeItem('r6-7', 'Uttapam', 8.99, 'Breakfast', images.dosa, true),
      makeItem('r6-8', 'Pongal', 8.49, 'Breakfast', images.dosa, true),
      makeItem('r6-9', 'Filter Coffee', 4.49, 'Drinks', images.cafe, true),
      makeItem('r6-10', 'Kesari Bath', 5.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r7',
    'Pasta Corner',
    'Italian',
    'pizza',
    ['Pasta', 'Italian', 'Comfort Food'],
    'Creamy and tomato-based pasta dishes made fresh to order.',
    '33 Italian Street',
    images.pizza,
    [
      makeItem('r7-1', 'Alfredo Pasta', 13.99, 'Pasta', images.pizza, true, true),
      makeItem('r7-2', 'Arrabbiata Pasta', 12.99, 'Pasta', images.pizza, true),
      makeItem('r7-3', 'Chicken Pasta', 15.49, 'Pasta', images.chicken),
      makeItem('r7-4', 'Pesto Pasta', 14.49, 'Pasta', images.pizza, true),
      makeItem('r7-5', 'Cheesy Macaroni', 11.99, 'Pasta', images.pizza, true),
      makeItem('r7-6', 'Lasagna', 15.99, 'Pasta', images.pizza, true),
      makeItem('r7-7', 'Garlic Bread', 6.99, 'Sides', images.pizza, true),
      makeItem('r7-8', 'Bruschetta', 7.99, 'Starters', images.pizza, true),
      makeItem('r7-9', 'Tiramisu', 7.99, 'Desserts', images.dessert, true),
      makeItem('r7-10', 'Chocolate Mousse', 6.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r8',
    'Momo Junction',
    'Asian',
    'chinese',
    ['Momos', 'Asian', 'Spicy'],
    'Steamed and fried momos with noodles and Asian sides.',
    '8 Market Lane',
    images.noodles,
    [
      makeItem('r8-1', 'Veg Momos', 8.99, 'Momos', images.noodles, true, true),
      makeItem('r8-2', 'Chicken Momos', 10.99, 'Momos', images.chicken, false, true),
      makeItem('r8-3', 'Fried Momos', 10.49, 'Momos', images.noodles, true),
      makeItem('r8-4', 'Tandoori Momos', 11.99, 'Momos', images.chicken),
      makeItem('r8-5', 'Paneer Momos', 10.49, 'Momos', images.paneer, true),
      makeItem('r8-6', 'Chilli Momos', 11.49, 'Momos', images.noodles),
      makeItem('r8-7', 'Schezwan Noodles', 11.99, 'Noodles', images.noodles, true),
      makeItem('r8-8', 'Chilli Potato', 9.49, 'Starters', images.noodles, true),
      makeItem('r8-9', 'Spring Rolls', 8.49, 'Starters', images.noodles, true),
      makeItem('r8-10', 'Iced Tea', 4.99, 'Drinks', images.cafe, true),
    ]
  ),

  makeRestaurant(
    'r9',
    'Biryani Bazaar',
    'Indian',
    'indian',
    ['Biryani', 'Hyderabadi', 'Indian'],
    'A biryani-focused restaurant serving aromatic rice dishes.',
    '25 Charminar Road',
    images.biryani,
    [
      makeItem('r9-1', 'Hyderabadi Chicken Biryani', 16.99, 'Biryani', images.biryani, false, true),
      makeItem('r9-2', 'Hyderabadi Mutton Biryani', 19.99, 'Biryani', images.biryani),
      makeItem('r9-3', 'Egg Biryani', 12.99, 'Biryani', images.biryani, false),
      makeItem('r9-4', 'Veg Biryani', 11.99, 'Biryani', images.biryani, true),
      makeItem('r9-5', 'Chicken 65', 12.99, 'Starters', images.chicken),
      makeItem('r9-6', 'Mirchi Ka Salan', 7.99, 'Sides', images.paneer, true),
      makeItem('r9-7', 'Raita', 4.49, 'Sides', images.healthy, true),
      makeItem('r9-8', 'Chicken Kebab', 13.99, 'Starters', images.chicken),
      makeItem('r9-9', 'Double Ka Meetha', 6.99, 'Desserts', images.dessert, true),
      makeItem('r9-10', 'Mango Lassi', 5.49, 'Drinks', images.cafe, true),
    ]
  ),

  makeRestaurant(
    'r10',
    'Wrap World',
    'Fast Food',
    'wraps',
    ['Wraps', 'Rolls', 'Fast Food'],
    'Loaded wraps, rolls and grilled fillings.',
    '44 Food Street',
    images.chicken,
    [
      makeItem('r10-1', 'Chicken Shawarma Wrap', 11.99, 'Wraps', images.chicken),
      makeItem('r10-2', 'Paneer Wrap', 10.49, 'Wraps', images.paneer, true),
      makeItem('r10-3', 'Chicken Tikka Roll', 12.49, 'Rolls', images.chicken),
      makeItem('r10-4', 'Paneer Kathi Roll', 10.99, 'Rolls', images.paneer, true),
      makeItem('r10-5', 'Veggie Wrap', 9.99, 'Wraps', images.healthy, true),
      makeItem('r10-6', 'Cheese Wrap', 9.49, 'Wraps', images.pizza, true),
      makeItem('r10-7', 'Chicken Caesar Wrap', 12.99, 'Wraps', images.chicken),
      makeItem('r10-8', 'Falafel Wrap', 10.99, 'Wraps', images.healthy, true),
      makeItem('r10-9', 'French Fries', 5.99, 'Sides', images.burger, true),
      makeItem('r10-10', 'Cold Coffee', 5.49, 'Drinks', images.cafe, true),
    ]
  ),

  makeRestaurant(
    'r11',
    'Tandoor Tales',
    'Indian',
    'indian',
    ['Tandoori', 'Indian', 'Kebab'],
    'Smoky tandoori dishes, naan and Indian curries.',
    '19 Tandoor Lane',
    images.chicken,
    [
      makeItem('r11-1', 'Tandoori Chicken', 15.99, 'Tandoori', images.chicken),
      makeItem('r11-2', 'Chicken Tikka', 13.99, 'Tandoori', images.chicken),
      makeItem('r11-3', 'Paneer Tikka', 12.99, 'Tandoori', images.paneer, true),
      makeItem('r11-4', 'Seekh Kebab', 14.99, 'Kebabs', images.chicken),
      makeItem('r11-5', 'Malai Tikka', 14.49, 'Tandoori', images.chicken),
      makeItem('r11-6', 'Butter Naan', 3.99, 'Breads', images.paneer, true),
      makeItem('r11-7', 'Garlic Naan', 4.49, 'Breads', images.paneer, true),
      makeItem('r11-8', 'Kadai Paneer', 13.99, 'Curries', images.paneer, true),
      makeItem('r11-9', 'Butter Chicken', 16.49, 'Curries', images.chicken),
      makeItem('r11-10', 'Jeera Rice', 7.99, 'Rice', images.biryani, true),
    ]
  ),

  makeRestaurant(
    'r12',
    'Pizza Planet',
    'Italian',
    'pizza',
    ['Pizza', 'Italian', 'Family'],
    'Family-sized pizzas and cheesy sides.',
    '55 Main Street',
    images.pizza,
    [
      makeItem('r12-1', 'Farmhouse Pizza', 15.99, 'Pizza', images.pizza, true),
      makeItem('r12-2', 'Pepperoni Pizza', 16.99, 'Pizza', images.pizza),
      makeItem('r12-3', 'BBQ Chicken Pizza', 17.99, 'Pizza', images.chicken),
      makeItem('r12-4', 'Mexican Pizza', 16.49, 'Pizza', images.pizza, true),
      makeItem('r12-5', 'Paneer Pizza', 15.49, 'Pizza', images.paneer, true),
      makeItem('r12-6', 'Corn Cheese Pizza', 14.99, 'Pizza', images.pizza, true),
      makeItem('r12-7', 'Garlic Knots', 6.99, 'Sides', images.pizza, true),
      makeItem('r12-8', 'Cheesy Dip', 4.99, 'Sides', images.pizza, true),
      makeItem('r12-9', 'Brownie', 6.49, 'Desserts', images.dessert, true),
      makeItem('r12-10', 'Lemonade', 4.49, 'Drinks', images.cafe, true),
    ]
  ),

  makeRestaurant(
    'r13',
    'Noodle Nation',
    'Asian',
    'noodles',
    ['Noodles', 'Asian', 'Spicy'],
    'Wok-tossed noodles and Asian comfort food.',
    '9 Noodle Avenue',
    images.noodles,
    [
      makeItem('r13-1', 'Veg Hakka Noodles', 10.99, 'Noodles', images.noodles, true),
      makeItem('r13-2', 'Chicken Hakka Noodles', 13.49, 'Noodles', images.chicken),
      makeItem('r13-3', 'Schezwan Noodles', 12.49, 'Noodles', images.noodles, true),
      makeItem('r13-4', 'Chilli Garlic Noodles', 12.99, 'Noodles', images.noodles, true),
      makeItem('r13-5', 'Singapore Noodles', 13.49, 'Noodles', images.noodles),
      makeItem('r13-6', 'Egg Noodles', 12.49, 'Noodles', images.noodles),
      makeItem('r13-7', 'Veg Manchurian', 10.99, 'Starters', images.noodles, true),
      makeItem('r13-8', 'Chilli Paneer', 12.49, 'Starters', images.paneer, true),
      makeItem('r13-9', 'Momos', 9.99, 'Momos', images.noodles, true),
      makeItem('r13-10', 'Spring Rolls', 8.49, 'Starters', images.noodles, true),
    ]
  ),

  makeRestaurant(
    'r14',
    'Curry Leaf',
    'Indian',
    'indian',
    ['Indian', 'Curry', 'Vegetarian'],
    'North and South Indian curries with rice and breads.',
    '61 Curry Road',
    images.paneer,
    [
      makeItem('r14-1', 'Paneer Butter Masala', 14.49, 'Curries', images.paneer, true),
      makeItem('r14-2', 'Palak Paneer', 13.99, 'Curries', images.paneer, true),
      makeItem('r14-3', 'Chole Bhature', 11.99, 'Mains', images.paneer, true),
      makeItem('r14-4', 'Rajma Rice', 10.99, 'Rice', images.biryani, true),
      makeItem('r14-5', 'Dal Tadka', 10.49, 'Curries', images.paneer, true),
      makeItem('r14-6', 'Veg Thali', 14.99, 'Thali', images.healthy, true),
      makeItem('r14-7', 'Chicken Curry', 15.99, 'Curries', images.chicken),
      makeItem('r14-8', 'Roti', 2.99, 'Breads', images.paneer, true),
      makeItem('r14-9', 'Jeera Rice', 7.49, 'Rice', images.biryani, true),
      makeItem('r14-10', 'Kheer', 5.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r15',
    'Dessert Dreams',
    'Desserts',
    'desserts',
    ['Desserts', 'Cakes', 'Ice Cream'],
    'Cakes, waffles, ice cream and sweet treats.',
    '3 Sugar Street',
    images.dessert,
    [
      makeItem('r15-1', 'Chocolate Cake', 8.99, 'Cakes', images.dessert, true, true),
      makeItem('r15-2', 'Red Velvet Cake', 9.49, 'Cakes', images.dessert, true),
      makeItem('r15-3', 'Cheesecake', 9.49, 'Cakes', images.dessert, true),
      makeItem('r15-4', 'Chocolate Brownie', 6.99, 'Desserts', images.dessert, true),
      makeItem('r15-5', 'Belgian Waffle', 8.99, 'Waffles', images.dessert, true),
      makeItem('r15-6', 'Chocolate Ice Cream', 6.49, 'Ice Cream', images.dessert, true),
      makeItem('r15-7', 'Vanilla Ice Cream', 5.99, 'Ice Cream', images.dessert, true),
      makeItem('r15-8', 'Strawberry Sundae', 7.49, 'Ice Cream', images.dessert, true),
      makeItem('r15-9', 'Gulab Jamun', 5.49, 'Desserts', images.dessert, true),
      makeItem('r15-10', 'Choco Lava Cake', 8.49, 'Cakes', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r16',
    'Cafe Mocha',
    'Cafe',
    'cafe',
    ['Coffee', 'Cafe', 'Breakfast'],
    'Coffee, sandwiches, pastries and cafe favorites.',
    '10 Coffee Lane',
    images.cafe,
    [
      makeItem('r16-1', 'Cappuccino', 5.49, 'Coffee', images.cafe, true),
      makeItem('r16-2', 'Cafe Latte', 5.49, 'Coffee', images.cafe, true),
      makeItem('r16-3', 'Cold Coffee', 5.99, 'Coffee', images.cafe, true),
      makeItem('r16-4', 'Mocha', 5.99, 'Coffee', images.cafe, true),
      makeItem('r16-5', 'Veg Sandwich', 8.99, 'Sandwiches', images.healthy, true),
      makeItem('r16-6', 'Chicken Sandwich', 10.99, 'Sandwiches', images.chicken),
      makeItem('r16-7', 'Club Sandwich', 11.99, 'Sandwiches', images.chicken),
      makeItem('r16-8', 'Blueberry Muffin', 5.49, 'Bakery', images.dessert, true),
      makeItem('r16-9', 'Chocolate Croissant', 5.99, 'Bakery', images.dessert, true),
      makeItem('r16-10', 'Chocolate Cake', 7.99, 'Cakes', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r17',
    'Chicken Hub',
    'Chicken',
    'burger',
    ['Chicken', 'Fried Chicken', 'Fast Food'],
    'Crispy chicken, burgers and loaded sides.',
    '28 Chicken Road',
    images.chicken,
    [
      makeItem('r17-1', 'Fried Chicken Bucket', 17.99, 'Chicken', images.chicken, false, true),
      makeItem('r17-2', 'Chicken Wings', 13.99, 'Chicken', images.chicken),
      makeItem('r17-3', 'Spicy Chicken Burger', 14.99, 'Burgers', images.chicken),
      makeItem('r17-4', 'Chicken Popcorn', 10.99, 'Chicken', images.chicken),
      makeItem('r17-5', 'Chicken Strips', 11.99, 'Chicken', images.chicken),
      makeItem('r17-6', 'Chicken Wrap', 11.49, 'Wraps', images.chicken),
      makeItem('r17-7', 'Loaded Fries', 8.99, 'Sides', images.burger, true),
      makeItem('r17-8', 'Chicken Nuggets', 9.99, 'Chicken', images.chicken),
      makeItem('r17-9', 'Coleslaw', 4.99, 'Sides', images.healthy, true),
      makeItem('r17-10', 'Chocolate Shake', 6.49, 'Drinks', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r18',
    'Pav Bhaji Point',
    'Indian Street Food',
    'indian',
    ['Street Food', 'Mumbai', 'Indian'],
    'Classic Indian street food and Mumbai favorites.',
    '77 Street Food Road',
    images.paneer,
    [
      makeItem('r18-1', 'Pav Bhaji', 8.99, 'Street Food', images.paneer, true, true),
      makeItem('r18-2', 'Cheese Pav Bhaji', 10.49, 'Street Food', images.paneer, true),
      makeItem('r18-3', 'Vada Pav', 6.99, 'Street Food', images.paneer, true),
      makeItem('r18-4', 'Dabeli', 6.99, 'Street Food', images.paneer, true),
      makeItem('r18-5', 'Samosa', 5.99, 'Snacks', images.paneer, true),
      makeItem('r18-6', 'Kachori', 5.99, 'Snacks', images.paneer, true),
      makeItem('r18-7', 'Bhel Puri', 7.49, 'Snacks', images.healthy, true),
      makeItem('r18-8', 'Sev Puri', 7.49, 'Snacks', images.healthy, true),
      makeItem('r18-9', 'Masala Chai', 3.99, 'Drinks', images.cafe, true),
      makeItem('r18-10', 'Falooda', 7.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r19',
    'Taco Town',
    'Mexican',
    'wraps',
    ['Tacos', 'Mexican', 'Spicy'],
    'Tacos, burritos and Mexican comfort food.',
    '14 Fiesta Avenue',
    images.burger,
    [
      makeItem('r19-1', 'Chicken Tacos', 11.99, 'Tacos', images.chicken),
      makeItem('r19-2', 'Paneer Tacos', 10.99, 'Tacos', images.paneer, true),
      makeItem('r19-3', 'Veg Tacos', 9.99, 'Tacos', images.healthy, true),
      makeItem('r19-4', 'Beef Tacos', 13.99, 'Tacos', images.burger),
      makeItem('r19-5', 'Chicken Burrito', 13.49, 'Burritos', images.chicken),
      makeItem('r19-6', 'Veg Burrito', 11.49, 'Burritos', images.healthy, true),
      makeItem('r19-7', 'Nachos', 8.99, 'Sides', images.pizza, true),
      makeItem('r19-8', 'Cheese Nachos', 9.99, 'Sides', images.pizza, true),
      makeItem('r19-9', 'Guacamole', 6.99, 'Sides', images.healthy, true),
      makeItem('r19-10', 'Churros', 6.49, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r20',
    'Idli Express',
    'South Indian',
    'south-indian',
    ['Idli', 'Dosa', 'South Indian'],
    'Quick South Indian breakfasts and snacks.',
    '22 Breakfast Road',
    images.dosa,
    [
      makeItem('r20-1', 'Idli', 6.99, 'Breakfast', images.dosa, true, true),
      makeItem('r20-2', 'Mini Idli', 7.49, 'Breakfast', images.dosa, true),
      makeItem('r20-3', 'Masala Dosa', 9.99, 'Dosa', images.dosa, true),
      makeItem('r20-4', 'Rava Dosa', 10.49, 'Dosa', images.dosa, true),
      makeItem('r20-5', 'Onion Dosa', 9.99, 'Dosa', images.dosa, true),
      makeItem('r20-6', 'Medu Vada', 7.49, 'Breakfast', images.dosa, true),
      makeItem('r20-7', 'Sambar Vada', 8.49, 'Breakfast', images.dosa, true),
      makeItem('r20-8', 'Pongal', 8.99, 'Breakfast', images.dosa, true),
      makeItem('r20-9', 'Filter Coffee', 4.49, 'Drinks', images.cafe, true),
      makeItem('r20-10', 'Mysore Pak', 5.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r21',
    'Rice Bowl Co',
    'Asian',
    'noodles',
    ['Rice Bowls', 'Asian', 'Healthy'],
    'Asian rice bowls with vegetables and grilled proteins.',
    '31 Bowl Street',
    images.healthy,
    [
      makeItem('r21-1', 'Chicken Teriyaki Bowl', 14.99, 'Rice Bowls', images.chicken),
      makeItem('r21-2', 'Paneer Teriyaki Bowl', 13.49, 'Rice Bowls', images.paneer, true),
      makeItem('r21-3', 'Veggie Rice Bowl', 11.99, 'Rice Bowls', images.healthy, true),
      makeItem('r21-4', 'Chicken Fried Rice', 13.49, 'Rice', images.noodles),
      makeItem('r21-5', 'Veg Fried Rice', 11.49, 'Rice', images.noodles, true),
      makeItem('r21-6', 'Egg Fried Rice', 12.49, 'Rice', images.noodles),
      makeItem('r21-7', 'Schezwan Rice', 12.49, 'Rice', images.noodles, true),
      makeItem('r21-8', 'Mushroom Rice', 11.99, 'Rice', images.healthy, true),
      makeItem('r21-9', 'Spring Rolls', 8.49, 'Starters', images.noodles, true),
      makeItem('r21-10', 'Momos', 9.99, 'Momos', images.noodles, true),
    ]
  ),

  makeRestaurant(
    'r22',
    'Kebab Kingdom',
    'Indian',
    'indian',
    ['Kebab', 'Tandoori', 'Grill'],
    'Grilled kebabs, tikkas and Indian sides.',
    '48 Grill Road',
    images.chicken,
    [
      makeItem('r22-1', 'Chicken Seekh Kebab', 14.99, 'Kebabs', images.chicken),
      makeItem('r22-2', 'Mutton Seekh Kebab', 17.99, 'Kebabs', images.chicken),
      makeItem('r22-3', 'Chicken Tikka', 13.99, 'Tandoori', images.chicken),
      makeItem('r22-4', 'Paneer Tikka', 12.99, 'Tandoori', images.paneer, true),
      makeItem('r22-5', 'Malai Chicken', 14.49, 'Tandoori', images.chicken),
      makeItem('r22-6', 'Tangdi Kebab', 15.49, 'Kebabs', images.chicken),
      makeItem('r22-7', 'Tandoori Wings', 13.99, 'Kebabs', images.chicken),
      makeItem('r22-8', 'Rumali Roti', 3.99, 'Breads', images.paneer, true),
      makeItem('r22-9', 'Mint Chutney', 2.99, 'Sides', images.healthy, true),
      makeItem('r22-10', 'Lassi', 4.99, 'Drinks', images.cafe, true),
    ]
  ),

  makeRestaurant(
    'r23',
    'Pasta Street',
    'Italian',
    'pizza',
    ['Pasta', 'Italian', 'Pizza'],
    'Italian pasta, pizza and garlic breads.',
    '16 Pasta Street',
    images.pizza,
    [
      makeItem('r23-1', 'Penne Arrabbiata', 12.99, 'Pasta', images.pizza, true),
      makeItem('r23-2', 'Spaghetti Aglio Olio', 12.49, 'Pasta', images.pizza, true),
      makeItem('r23-3', 'Creamy Alfredo', 13.99, 'Pasta', images.pizza, true),
      makeItem('r23-4', 'Chicken Alfredo', 15.99, 'Pasta', images.chicken),
      makeItem('r23-5', 'Pesto Penne', 13.49, 'Pasta', images.pizza, true),
      makeItem('r23-6', 'Chicken Lasagna', 16.99, 'Pasta', images.chicken),
      makeItem('r23-7', 'Margherita Pizza', 13.99, 'Pizza', images.pizza, true),
      makeItem('r23-8', 'Garlic Bread', 6.49, 'Sides', images.pizza, true),
      makeItem('r23-9', 'Cheesy Bread', 7.49, 'Sides', images.pizza, true),
      makeItem('r23-10', 'Panna Cotta', 7.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r24',
    'Shake Station',
    'Cafe',
    'cafe',
    ['Milkshake', 'Drinks', 'Desserts'],
    'Thick shakes, coffee and sweet snacks.',
    '5 Milkshake Lane',
    images.dessert,
    [
      makeItem('r24-1', 'Chocolate Milkshake', 7.49, 'Milkshakes', images.dessert, true),
      makeItem('r24-2', 'Strawberry Milkshake', 7.49, 'Milkshakes', images.dessert, true),
      makeItem('r24-3', 'Vanilla Milkshake', 6.99, 'Milkshakes', images.dessert, true),
      makeItem('r24-4', 'Oreo Milkshake', 7.99, 'Milkshakes', images.dessert, true),
      makeItem('r24-5', 'Mango Shake', 7.49, 'Milkshakes', images.dessert, true),
      makeItem('r24-6', 'Cold Coffee', 5.99, 'Coffee', images.cafe, true),
      makeItem('r24-7', 'Iced Latte', 5.99, 'Coffee', images.cafe, true),
      makeItem('r24-8', 'Brownie', 6.49, 'Desserts', images.dessert, true),
      makeItem('r24-9', 'Waffle', 8.99, 'Waffles', images.dessert, true),
      makeItem('r24-10', 'Ice Cream Sundae', 8.49, 'Ice Cream', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r25',
    'Samosa Corner',
    'Indian Street Food',
    'indian',
    ['Samosa', 'Snacks', 'Indian'],
    'Crispy Indian snacks, chaats and refreshing drinks.',
    '11 Snack Street',
    images.paneer,
    [
      makeItem('r25-1', 'Samosa', 5.49, 'Snacks', images.paneer, true, true),
      makeItem('r25-2', 'Paneer Samosa', 6.49, 'Snacks', images.paneer, true),
      makeItem('r25-3', 'Aloo Tikki', 6.99, 'Snacks', images.paneer, true),
      makeItem('r25-4', 'Pani Puri', 7.49, 'Chaat', images.healthy, true),
      makeItem('r25-5', 'Dahi Puri', 7.99, 'Chaat', images.healthy, true),
      makeItem('r25-6', 'Bhel Puri', 7.49, 'Chaat', images.healthy, true),
      makeItem('r25-7', 'Kachori', 5.99, 'Snacks', images.paneer, true),
      makeItem('r25-8', 'Bread Pakora', 6.49, 'Snacks', images.paneer, true),
      makeItem('r25-9', 'Masala Chai', 3.99, 'Drinks', images.cafe, true),
      makeItem('r25-10', 'Jalebi', 5.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r26',
    'Fusion Feast',
    'Fusion',
    'indian',
    ['Fusion', 'Indian', 'Popular'],
    'Creative fusion dishes combining Indian and global flavors.',
    '72 Fusion Avenue',
    images.burger,
    [
      makeItem('r26-1', 'Tandoori Paneer Burger', 13.99, 'Burgers', images.paneer, true),
      makeItem('r26-2', 'Butter Chicken Burger', 15.49, 'Burgers', images.chicken),
      makeItem('r26-3', 'Masala Pasta', 13.99, 'Pasta', images.pizza, true),
      makeItem('r26-4', 'Paneer Pizza', 15.49, 'Pizza', images.paneer, true),
      makeItem('r26-5', 'Biryani Arancini', 12.99, 'Starters', images.biryani),
      makeItem('r26-6', 'Tandoori Wrap', 11.99, 'Wraps', images.chicken),
      makeItem('r26-7', 'Masala Fries', 6.99, 'Sides', images.burger, true),
      makeItem('r26-8', 'Chilli Cheese Toast', 7.99, 'Starters', images.pizza, true),
      makeItem('r26-9', 'Mango Cheesecake', 8.99, 'Desserts', images.dessert, true),
      makeItem('r26-10', 'Masala Lemonade', 4.99, 'Drinks', images.cafe, true),
    ]
  ),

  makeRestaurant(
    'r27',
    'Breakfast Club',
    'Breakfast',
    'cafe',
    ['Breakfast', 'Cafe', 'Coffee'],
    'Breakfast plates, sandwiches, pancakes and coffee.',
    '20 Morning Road',
    images.cafe,
    [
      makeItem('r27-1', 'Pancakes', 9.99, 'Breakfast', images.dessert, true, true),
      makeItem('r27-2', 'French Toast', 9.49, 'Breakfast', images.dessert, true),
      makeItem('r27-3', 'Masala Omelette', 8.99, 'Breakfast', images.chicken),
      makeItem('r27-4', 'Cheese Omelette', 9.49, 'Breakfast', images.paneer, true),
      makeItem('r27-5', 'Veg Sandwich', 8.99, 'Sandwiches', images.healthy, true),
      makeItem('r27-6', 'Chicken Sandwich', 10.99, 'Sandwiches', images.chicken),
      makeItem('r27-7', 'Hash Browns', 6.49, 'Sides', images.burger, true),
      makeItem('r27-8', 'Pancake Stack', 11.49, 'Breakfast', images.dessert, true),
      makeItem('r27-9', 'Cappuccino', 5.49, 'Coffee', images.cafe, true),
      makeItem('r27-10', 'Orange Juice', 4.99, 'Drinks', images.healthy, true),
    ]
  ),

  makeRestaurant(
    'r28',
    'Shawarma Stop',
    'Middle Eastern',
    'wraps',
    ['Shawarma', 'Wraps', 'Middle Eastern'],
    'Fresh shawarma, wraps, hummus and grilled specialties.',
    '39 Shawarma Road',
    images.chicken,
    [
      makeItem('r28-1', 'Chicken Shawarma', 11.99, 'Shawarma', images.chicken),
      makeItem('r28-2', 'Paneer Shawarma', 10.99, 'Shawarma', images.paneer, true),
      makeItem('r28-3', 'Chicken Plate', 14.99, 'Plates', images.chicken),
      makeItem('r28-4', 'Falafel Wrap', 10.49, 'Wraps', images.healthy, true),
      makeItem('r28-5', 'Falafel Plate', 12.99, 'Plates', images.healthy, true),
      makeItem('r28-6', 'Hummus', 6.99, 'Sides', images.healthy, true),
      makeItem('r28-7', 'Pita Bread', 3.99, 'Breads', images.paneer, true),
      makeItem('r28-8', 'Garlic Sauce', 2.99, 'Sides', images.healthy, true),
      makeItem('r28-9', 'Loaded Fries', 7.99, 'Sides', images.burger, true),
      makeItem('r28-10', 'Baklava', 6.49, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r29',
    'Nawab Kitchen',
    'Mughlai',
    'indian',
    ['Mughlai', 'Biryani', 'Indian'],
    'Royal Mughlai curries, biryanis and kebabs.',
    '88 Royal Road',
    images.biryani,
    [
      makeItem('r29-1', 'Mughlai Chicken Biryani', 17.99, 'Biryani', images.biryani),
      makeItem('r29-2', 'Mutton Biryani', 19.99, 'Biryani', images.biryani),
      makeItem('r29-3', 'Chicken Korma', 16.49, 'Curries', images.chicken),
      makeItem('r29-4', 'Mutton Rogan Josh', 18.49, 'Curries', images.chicken),
      makeItem('r29-5', 'Paneer Korma', 14.99, 'Curries', images.paneer, true),
      makeItem('r29-6', 'Shahi Paneer', 14.49, 'Curries', images.paneer, true),
      makeItem('r29-7', 'Galouti Kebab', 15.99, 'Kebabs', images.chicken),
      makeItem('r29-8', 'Chicken Seekh Kebab', 14.99, 'Kebabs', images.chicken),
      makeItem('r29-9', 'Naan Basket', 7.99, 'Breads', images.paneer, true),
      makeItem('r29-10', 'Shahi Tukda', 6.99, 'Desserts', images.dessert, true),
    ]
  ),

  makeRestaurant(
    'r30',
    'Food Fusion Cafe',
    'Multi Cuisine',
    'cafe',
    ['Multi Cuisine', 'Popular', 'Cafe'],
    'A large menu featuring burgers, pizza, noodles, Indian food and desserts.',
    '100 Food Court',
    images.burger,
    [
      makeItem('r30-1', 'Classic Burger', 12.99, 'Burgers', images.burger, false, true),
      makeItem('r30-2', 'Margherita Pizza', 13.99, 'Pizza', images.pizza, true, true),
      makeItem('r30-3', 'Chicken Biryani', 15.99, 'Biryani', images.biryani),
      makeItem('r30-4', 'Hakka Noodles', 11.99, 'Noodles', images.noodles, true),
      makeItem('r30-5', 'Chicken Momos', 10.99, 'Momos', images.chicken),
      makeItem('r30-6', 'Masala Dosa', 9.99, 'Dosa', images.dosa, true),
      makeItem('r30-7', 'Paneer Wrap', 10.49, 'Wraps', images.paneer, true),
      makeItem('r30-8', 'Chicken Pasta', 14.99, 'Pasta', images.chicken),
      makeItem('r30-9', 'Chocolate Cake', 7.99, 'Desserts', images.dessert, true),
      makeItem('r30-10', 'Cold Coffee', 5.99, 'Drinks', images.cafe, true),
    ]
  ),
];

export function getRestaurantById(id) {
  return RESTAURANTS.find((r) => r.id === id) || null;
}

export function searchRestaurants(query, cuisineId) {
  let results = [...RESTAURANTS];

  if (cuisineId && cuisineId !== 'all') {
    results = results.filter((r) => r.cuisineId === cuisineId);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    const singular = q.endsWith('s') ? q.slice(0, -1) : q;

    results = results.filter((r) => {
      const restaurantText = [
        r.name,
        r.cuisine,
        r.description,
        ...r.tags,
      ]
        .join(' ')
        .toLowerCase();

      const menuText = (r.menu || [])
        .map((item) =>
          [
            item.name,
            item.description,
            item.category,
          ].join(' ')
        )
        .join(' ')
        .toLowerCase();

      return (
        restaurantText.includes(q) ||
        restaurantText.includes(singular) ||
        menuText.includes(q) ||
        menuText.includes(singular)
      );
    });
  }

  return results;
}