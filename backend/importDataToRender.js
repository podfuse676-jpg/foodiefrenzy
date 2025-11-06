import mongoose from 'mongoose';
import Item from './modals/item.js';

// Connect to MongoDB using the same URI as in your .env file
const MONGODB_URI = 'mongodb+srv://podfuse676_db_user:yashuprenny1231@cluster0.86ejws0.mongodb.net/foodiefrenzy?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample menu items data (same as in importSimpleData.js)
const menuItems = [
  {
    name: "Breakfast Burrito",
    description: "Scrambled eggs, cheese, potatoes, and your choice of bacon or sausage wrapped in a warm tortilla.",
    category: "Breakfast",
    price: 9.99,
    rating: 4.7,
    imageUrl: "/uploads/BreakfastBurrito.png"
  },
  {
    name: "Avocado Toast",
    description: "Toasted artisan bread topped with mashed avocado, cherry tomatoes, and a sprinkle of red pepper flakes.",
    category: "Breakfast",
    price: 8.99,
    rating: 4.5,
    imageUrl: "/uploads/AvocadoToast.png"
  },
  {
    name: "Chicken Caesar Salad",
    description: "Crisp romaine lettuce, grilled chicken, parmesan cheese, and croutons tossed in Caesar dressing.",
    category: "Lunch",
    price: 12.99,
    rating: 4.6,
    imageUrl: "/uploads/ChickenCaesarSalad.png"
  },
  {
    name: "Club Sandwich",
    description: "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread.",
    category: "Lunch",
    price: 11.99,
    rating: 4.4,
    imageUrl: "/uploads/ClubSandwich.png"
  },
  {
    name: "Grilled Ribeye Steak",
    description: "12oz ribeye steak grilled to perfection, served with roasted vegetables and mashed potatoes.",
    category: "Dinner",
    price: 24.99,
    rating: 4.8,
    imageUrl: "/uploads/GrilledRibeyeSteak.png"
  },
  {
    name: "Salmon Fillet",
    description: "Pan-seared salmon fillet with lemon butter sauce, served with asparagus and wild rice.",
    category: "Dinner",
    price: 22.99,
    rating: 4.7,
    imageUrl: "/uploads/SalmonFillet.png"
  },
  {
    name: "Tacos al Pastor",
    description: "Tacos with marinated pork, pineapple, and cilantro.",
    category: "Mexican",
    price: 11.99,
    rating: 4.6,
    imageUrl: "/uploads/TacosalPastor.png"
  },
  {
    name: "Chicken Quesadilla",
    description: "Grilled quesadilla filled with chicken, cheese, and salsa.",
    category: "Mexican",
    price: 10.99,
    rating: 4.4,
    imageUrl: "/uploads/ChickenQuesadilla.png"
  },
  {
    name: "Spaghetti Carbonara",
    description: "Classic pasta with eggs, cheese, pancetta, and pepper.",
    category: "Italian",
    price: 14.99,
    rating: 4.7,
    imageUrl: "/uploads/SpaghettiCarbonara.png"
  },
  {
    name: "Margherita Pizza",
    description: "Pizza topped with tomato sauce, mozzarella, and basil.",
    category: "Italian",
    price: 13.99,
    rating: 4.8,
    imageUrl: "/uploads/MargheritaPizza.png"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone.",
    category: "Desserts",
    price: 6.99,
    rating: 4.7,
    imageUrl: "/uploads/TiramisuCake.png"
  },
  {
    name: "Iced Latte",
    description: "Cool and refreshing espresso-based iced latte.",
    category: "Drinks",
    price: 4.99,
    rating: 4.0,
    imageUrl: "/uploads/IcedLatte.png"
  }
];

// Function to import menu items
const importMenuItems = async () => {
  try {
    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');
    
    // Insert new items
    const result = await Item.insertMany(menuItems);
    console.log(`Successfully imported ${result.length} menu items`);
    
    // Display the imported items
    const items = await Item.find({});
    console.log('Imported items:');
    items.forEach(item => {
      console.log(`- ${item.name} (${item.category}) - $${item.price}`);
    });
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Error importing menu items:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

// Run the import function
importMenuItems();