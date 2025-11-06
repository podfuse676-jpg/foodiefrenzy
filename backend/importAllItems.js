import mongoose from 'mongoose';
import Item from './modals/item.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample menu items with all categories
const menuItems = [
  // Breakfast items
  { name: "Eggs Benedict", description: "Poached eggs and Canadian bacon on English muffins, topped with hollandaise sauce.", category: "Breakfast", price: 12.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/EggsBenedict.png" },
  { name: "Avocado Toast", description: "Toasted artisan bread topped with mashed avocado, cherry tomatoes, and a poached egg.", category: "Breakfast", price: 10.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/AvocadoToast.png" },
  { name: "Pancakes with Maple Syrup", description: "Fluffy buttermilk pancakes served with pure maple syrup and butter.", category: "Breakfast", price: 9.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/PancakeswithMapleSyrup.png" },
  { name: "Fruit Smoothie Bowl", description: "Blended açaí with banana, topped with granola, fresh berries, and honey.", category: "Breakfast", price: 11.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/FruitSmoothieBowl.png" },
  { name: "French Toast", description: "Thick-cut brioche bread dipped in cinnamon-vanilla batter, grilled and topped with powdered sugar.", category: "Breakfast", price: 10.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/FrenchToast.png" },
  { name: "Bagel with Lox", description: "Toasted bagel with cream cheese, smoked salmon, capers, red onion, and dill.", category: "Breakfast", price: 13.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/BagelwithLox.png" },
  { name: "Granola Parfait", description: "Layers of Greek yogurt, house-made granola, fresh berries, and honey.", category: "Breakfast", price: 8.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/GranolaParfait.png" },
  { name: "Breakfast Burrito", description: "Scrambled eggs, cheese, potatoes, and your choice of bacon or sausage wrapped in a warm tortilla.", category: "Breakfast", price: 9.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/BreakfastBurrito.png" },
  
  // Lunch items
  { name: "Chicken Caesar Salad", description: "Crisp romaine lettuce, grilled chicken, parmesan cheese, and croutons tossed in Caesar dressing.", category: "Lunch", price: 12.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/ChickenCaesarSalad.png" },
  { name: "Club Sandwich", description: "Triple-decker sandwich with turkey, bacon, lettuce, tomato, and mayo on toasted bread.", category: "Lunch", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/ClubSandwich.png" },
  { name: "Veggie Wrap", description: "Hummus, avocado, cucumber, bell peppers, and mixed greens in a spinach tortilla.", category: "Lunch", price: 10.99, rating: 4.3, hearts: 0, imageUrl: "/uploads/VeggieWrap.png" },
  { name: "Grilled Cheese Sandwich", description: "Melted cheddar and Swiss cheese on buttery grilled sourdough bread.", category: "Lunch", price: 8.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/GrilledCheeseSandwich.png" },
  { name: "Grilled Salmon Bowl", description: "Grilled salmon over brown rice with roasted vegetables and lemon-dill sauce.", category: "Lunch", price: 15.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/GrilledSalmonBowl.png" },
  { name: "Spicy Beef Tacos", description: "Three corn tortillas filled with seasoned beef, pico de gallo, and avocado crema.", category: "Lunch", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/SpicyBeefTacos.png" },
  { name: "Sushi Combo", description: "Assortment of fresh nigiri and maki rolls served with wasabi, ginger, and soy sauce.", category: "Lunch", price: 16.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/SushiCombo.png" },
  { name: "Red Chicken Curry", description: "Tender chicken in a spicy coconut curry sauce with vegetables, served with jasmine rice.", category: "Lunch", price: 13.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/RedChickenCurry.png" },
  { name: "Turkey Panini", description: "Sliced turkey, provolone, pesto, and roasted red peppers on pressed ciabatta bread.", category: "Lunch", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/TurkeyPanini.png" },
  { name: "Quinoa Salad", description: "Quinoa with roasted vegetables, feta cheese, and lemon-herb vinaigrette.", category: "Lunch", price: 10.99, rating: 4.3, hearts: 0, imageUrl: "/uploads/QuinoaSalad.png" },
  { name: "Pasta Salad", description: "Rotini pasta with cherry tomatoes, mozzarella, olives, and Italian dressing.", category: "Lunch", price: 9.99, rating: 4.2, hearts: 0, imageUrl: "/uploads/PastaSalad.png" },
  { name: "Fish Tacos", description: "Grilled fish in corn tortillas with cabbage slaw, pico de gallo, and lime crema.", category: "Lunch", price: 13.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/FishTacos.png" },
  
  // Dinner items
  { name: "Grilled Ribeye Steak", description: "12oz ribeye steak grilled to perfection, served with roasted vegetables and mashed potatoes.", category: "Dinner", price: 24.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/GrilledRibeyeSteak.png" },
  { name: "Salmon Fillet", description: "Pan-seared salmon fillet with lemon butter sauce, served with asparagus and wild rice.", category: "Dinner", price: 22.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/SalmonFillet.png" },
  { name: "Pasta Primavera", description: "Fettuccine pasta with seasonal vegetables in a light cream sauce.", category: "Dinner", price: 16.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/PastaPrimavera.png" },
  { name: "Chicken Parmesan", description: "Breaded chicken breast topped with marinara sauce and melted mozzarella, served with spaghetti.", category: "Dinner", price: 18.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/ChickenParmesan.png" },
  { name: "Pesto Pasta with Shrimp", description: "Linguine tossed in basil pesto with grilled shrimp and cherry tomatoes.", category: "Dinner", price: 19.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/PestoPastaWithShrimp.png" },
  { name: "Garlic Butter Lamb Chops", description: "Grilled lamb chops with garlic butter, served with roasted potatoes and mint sauce.", category: "Dinner", price: 26.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/GarlicButterLambChops.png" },
  { name: "Vegetarian Stuffed Peppers", description: "Bell peppers stuffed with quinoa, black beans, corn, and cheese, topped with enchilada sauce.", category: "Dinner", price: 17.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/VegetarianStuffedPeppers.png" },
  { name: "Beef Bourguignon", description: "Slow-cooked beef stew with red wine, mushrooms, and pearl onions, served with crusty bread.", category: "Dinner", price: 21.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/BeefBourguignon.png" },
  { name: "Vegetable Stir Fry", description: "Mixed vegetables stir-fried in a savory sauce, served over steamed rice.", category: "Dinner", price: 15.99, rating: 4.3, hearts: 0, imageUrl: "/uploads/VegetableStirFry.png" },
  { name: "Shrimp Scampi", description: "Sautéed shrimp in garlic butter and white wine sauce, served over linguine.", category: "Dinner", price: 20.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/ShrimpScampi.png" },
  { name: "Lamb Chops", description: "Herb-crusted lamb chops with rosemary-infused demi-glace, served with mashed potatoes.", category: "Dinner", price: 25.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/LambChops.png" },
  
  // Mexican items
  { name: "Tacos al Pastor", description: "Marinated pork tacos with pineapple, onion, and cilantro on corn tortillas.", category: "Mexican", price: 13.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/TacosalPastor.png" },
  { name: "Chicken Quesadilla", description: "Flour tortilla filled with grilled chicken, melted cheese, and peppers, served with salsa and sour cream.", category: "Mexican", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/ChickenQuesadilla.png" },
  { name: "Enchiladas", description: "Corn tortillas filled with cheese and topped with red sauce, served with rice and beans.", category: "Mexican", price: 14.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Enchiladas.png" },
  { name: "Fajitas", description: "Sizzling plate of grilled chicken or beef with peppers and onions, served with tortillas and toppings.", category: "Mexican", price: 16.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/Fajitas.png" },
  { name: "Chiles Rellenos", description: "Poblano peppers stuffed with cheese, battered and fried, topped with tomato sauce.", category: "Mexican", price: 15.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/ChilesRellenos.png" },
  { name: "Mole Poblano", description: "Chicken in a rich chocolate-chili sauce, served with rice and tortillas.", category: "Mexican", price: 17.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/MolePoblano.png" },
  { name: "Pozole Rojo", description: "Traditional Mexican soup with hominy and pork in a red chili broth.", category: "Mexican", price: 14.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/PozoleRojo.png" },
  { name: "Churros", description: "Fried dough pastry dusted with cinnamon sugar, served with chocolate dipping sauce.", category: "Mexican", price: 8.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/Churros.png" },
  { name: "Nachos", description: "Tortilla chips topped with melted cheese, beans, jalapeños, guacamole, and sour cream.", category: "Mexican", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/Nachos.png" },
  { name: "Burrito", description: "Large flour tortilla filled with rice, beans, cheese, and your choice of meat.", category: "Mexican", price: 13.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Burrito.png" },
  { name: "Tamales", description: "Corn masa filled with seasoned meat, steamed in corn husks.", category: "Mexican", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/Tamales.png" },
  { name: "Chilaquiles", description: "Fried tortilla chips simmered in salsa, topped with cheese, cream, and eggs.", category: "Mexican", price: 11.99, rating: 4.4, hearts: 0, imageUrl: "/uploads/Chilaquiles.png" },
  
  // Indian items
  { name: "Kebab", description: "Grilled skewers of marinated meat and vegetables, served with mint chutney.", category: "Indian", price: 14.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Kebab.png" },
  { name: "Chicken Tikka", description: "Tandoori-roasted chicken pieces marinated in yogurt and spices.", category: "Indian", price: 15.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/ChickenTikka.png" },
  { name: "Desi Chowmein", description: "Indian-style stir-fried noodles with vegetables and spices.", category: "Indian", price: 13.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/DesiChowmein.png" },
  { name: "Chicken Chargha", description: "Whole chicken marinated in spices and deep-fried, Pakistani style.", category: "Indian", price: 18.99, rating: 4.8, hearts: 0, imageUrl: "/uploads/ChickenChargha.png" },
  { name: "Paneer Tikka", description: "Cubes of cottage cheese marinated in spices and grilled in a tandoor.", category: "Indian", price: 14.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/PannerTikka.png" },
  { name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potatoes, served with sambar and chutney.", category: "Indian", price: 12.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/MasalaDosa.png" },
  { name: "Palak Paneer", description: "Cottage cheese cubes in a creamy spinach sauce, served with naan.", category: "Indian", price: 15.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/PalakPaneer.png" },
  { name: "Gulab Jamun", description: "Deep-fried milk solids soaked in sugar syrup, a classic Indian dessert.", category: "Indian", price: 7.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/GulabJamun.png" },
  
  // Desserts
  { name: "Baklava", description: "Layers of phyllo pastry filled with chopped nuts and sweetened with honey syrup.", category: "Dessert", price: 8.99, rating: 4.7, hearts: 0, imageUrl: "/uploads/Baklava.png" },
  { name: "Gelato", description: "Italian-style ice cream in various flavors, denser and richer than regular ice cream.", category: "Dessert", price: 6.99, rating: 4.6, hearts: 0, imageUrl: "/uploads/Gelato.png" },
  { name: "Caramel Macchiato", description: "Espresso with steamed milk, vanilla syrup, and caramel drizzle.", category: "Beverage", price: 5.99, rating: 4.5, hearts: 0, imageUrl: "/uploads/CaramelMacchiato.png" }
];

// Import all items
const importItems = async () => {
  try {
    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing items');
    
    // Insert new items
    const result = await Item.insertMany(menuItems);
    console.log(`Successfully imported ${result.length} menu items`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing items:', error);
    mongoose.connection.close();
    process.exit(1);
  }
};

importItems();