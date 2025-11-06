import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import Item from './modals/item.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const updateAllItemImages = async () => {
  await connectDB();
  
  try {
    console.log('Fetching all items...');
    const items = await Item.find({});
    console.log(`Found ${items.length} items`);
    
    // Get all image files from the uploads directory
    const imagesDir = path.join(process.cwd(), 'uploads', 'images');
    const imageFiles = fs.readdirSync(imagesDir);
    console.log(`Found ${imageFiles.length} image files`);
    
    let updatedCount = 0;
    
    // Process each item
    for (const item of items) {
      // Skip items that already have images (except the two we know about)
      if (item.imageUrl && item.imageUrl !== '' && 
          !item.imageUrl.includes('dash-board-polish.webp') && 
          !item.imageUrl.includes('car-perfume.jpg')) {
        console.log(`Skipping ${item.name} - already has image URL`);
        continue;
      }
      
      // Create a filename based on the item name
      let imageName = item.name.replace(/[^a-zA-Z0-9\s]/g, ''); // Remove special characters
      imageName = imageName.replace(/\s+/g, ' '); // Replace multiple spaces with single space
      imageName = imageName.trim(); // Remove leading/trailing spaces
      
      // Try different extensions
      const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
      let foundImage = false;
      
      for (const ext of extensions) {
        const fileName = `${imageName}${ext}`;
        if (imageFiles.includes(fileName)) {
          const imageUrl = `/uploads/images/${fileName}`;
          console.log(`Found image for ${item.name}: ${fileName}`);
          
          // Update the item
          await Item.findByIdAndUpdate(item._id, { imageUrl });
          console.log(`Updated ${item.name} with image URL: ${imageUrl}`);
          updatedCount++;
          foundImage = true;
          break;
        }
      }
      
      // Special handling for items with special names
      if (!foundImage) {
        // Handle special cases
        const specialCases = {
          '5-Hour Energy': '5-Hr Energy Shot Berry.webp',
          'Airheads Watermelon Drink': 'Airheads Watermelon Drink.webp',
          'Alcan Aluminium Foil 12 inch': 'Alcan Aluminium Foil 12 inch.webp',
          'Dare Juicee Sour Bears': 'Dare Juicee Sour Bears .webp',
          'Jarritos Fruit Punch': 'Jarritos Fruit Punch .webp',
          'Kettle Chips Backyard BBQ': 'Kettle Chips Backyard BBQ.webp',
          'Keychain Set': 'Keychain Set\.webp',
          'Miss Vickie\'s Jalapeño': 'Miss Vickie\'s Jalapeño.webp',
          'Mogu Mogu Grape': 'Mogu Mogu Grape.webp',
          'Monster Energy Ultra': 'Monster Energy Ultra.webp',
          'Minute Maid Juice': 'Minute Maid Juice.webp',
          'Red Rain Energy Drink': 'Red Rain Energy Drink.webp',
          'Rockstar Energy Drink': 'Rockstar_Energy_drink.webp',
          'Sauce Packets': 'Sauce Packets .webp',
          'Snow Joe (Soft Serve + Slushy Combo)': 'Snow Joe (Soft Serve + Slushy Combo).webp',
          'Takis Fuego': 'Takis Fuego.webp',
          'Car Perfume': 'Car-Air-Freshener.webp',
          'Tire Cleaner': 'Tire-Cleaner.webp',
          'Wiper Fluid': 'Wiper-Fluid.webp'
        };
        
        if (specialCases[item.name]) {
          const fileName = specialCases[item.name];
          if (imageFiles.includes(fileName)) {
            const imageUrl = `/uploads/images/${fileName}`;
            console.log(`Found special case image for ${item.name}: ${fileName}`);
            
            // Update the item
            await Item.findByIdAndUpdate(item._id, { imageUrl });
            console.log(`Updated ${item.name} with image URL: ${imageUrl}`);
            updatedCount++;
            foundImage = true;
          }
        }
      }
      
      if (!foundImage) {
        console.log(`No image found for ${item.name}`);
      }
    }
    
    console.log(`\nSuccessfully updated ${updatedCount} items with images`);
    
    // Verify the updates
    console.log('\nVerifying updates...');
    const itemsWithImages = await Item.find({ 
      imageUrl: { $exists: true, $ne: null, $ne: "" } 
    });
    console.log(`Total items with images: ${itemsWithImages.length}`);
    
    itemsWithImages.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}: ${item.imageUrl}`);
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating item images:', error);
    mongoose.connection.close();
  }
};

updateAllItemImages();