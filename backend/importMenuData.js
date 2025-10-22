import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Item from './modals/item.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/foodiefrenzy')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Function to read the dummy data file
const readDummyData = async () => {
  try {
    // Path to the frontend assets directory where OmhDD.js is located
    const frontendPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'OmhDD.js');
    
    // Read the file content
    const fileContent = fs.readFileSync(frontendPath, 'utf8');
    
    // Extract the dummyMenuData object using regex
    const dummyDataMatch = fileContent.match(/export const dummyMenuData = ({[\s\S]*?});/);
    
    if (!dummyDataMatch) {
      console.error('Could not find dummyMenuData in the file');
      process.exit(1);
    }
    
    // Create a temporary file to evaluate the data
    const tempFilePath = path.join(__dirname, 'temp-dummy-data.js');
    fs.writeFileSync(tempFilePath, `
      import BreakfastBurrito from "../frontend/src/assets/BreakfastBurrito.png";
      import AvocadoToast from "../frontend/src/assets/AvocadoToast.png";
      import PancakeswithMapleSyrup from "../frontend/src/assets/PancakeswithMapleSyrup.png";
      import FruitSmoothieBowl from "../frontend/src/assets/FruitSmoothieBowl.png";
      import FrenchToast from '../frontend/src/assets/FrenchToast.png';
      import EggsBenedict from "../frontend/src/assets/EggsBenedict.png";
      import BagelwithLox from "../frontend/src/assets/BagelwithLox.png";
      import GranolaParfait from "../frontend/src/assets/GranolaParfait.png";
      import ChickenCaesarSalad from "../frontend/src/assets/ChickenCaesarSalad.png";
      import ClubSandwich from "../frontend/src/assets/ClubSandwich.png";
      import VeggieWrap from "../frontend/src/assets/VeggieWrap.png";
      import GrilledCheeseSandwich from "../frontend/src/assets/GrilledCheeseSandwich.png";
      import TurkeyPanini from "../frontend/src/assets/TurkeyPanini.png";
      import QuinoaSalad from "../frontend/src/assets/QuinoaSalad.png";
      import PastaSalad from "../frontend/src/assets/PastaSalad.png";
      import FishTacos from "../frontend/src/assets/FishTacos.png";
      import GrilledRibeyeSteak from "../frontend/src/assets/GrilledRibeyeSteak.png";
      import SalmonFillet from "../frontend/src/assets/SalmonFillet.png";
      import RoastChicken from "../frontend/src/assets/RoastChicken.png";
      import PastaPrimavera from "../frontend/src/assets/PastaPrimavera.png";
      import BeefBourguignon from "../frontend/src/assets/BeefBourguignon.png";
      import VegetableStirFry from "../frontend/src/assets/VegetableStirFry.png";
      import ShrimpScampi from "../frontend/src/assets/ShrimpScampi.png";
      import LambChops from "../frontend/src/assets/LambChops.png";
      import TacosalPastor from "../frontend/src/assets/TacosalPastor.png";
      import ChickenQuesadilla from "../frontend/src/assets/ChickenQuesadilla.png";
      import Enchiladas from "../frontend/src/assets/Enchiladas.png";
      import Fajitas from "../frontend/src/assets/Fajitas.png";
      import Nachos from "../frontend/src/assets/Nachos.png";
      import Burrito from "../frontend/src/assets/Burrito.png";
      import Tamales from "../frontend/src/assets/Tamales.png";
      import Chilaquiles from "../frontend/src/assets/Chilaquiles.png";
      import Lasagna from "../frontend/src/assets/Lasagna.png";
      import SpaghettiCarbonara from "../frontend/src/assets/SpaghettiCarbonara.png";
      import Risotto from "../frontend/src/assets/Risotto.png";
      import MargheritaPizza from "../frontend/src/assets/MargheritaPizza.png";
      import FettuccineAlferdo from "../frontend/src/assets/FettuccineAlferdo.png";
      import PestoPasta from "../frontend/src/assets/PestoPasta.png";
      import Gnocchi from "../frontend/src/assets/Gnocchi.png";
      import OssoBuco from "../frontend/src/assets/OssoBuco.png";
      import Gelato from "../frontend/src/assets/Gelato.png";
      import Cannoli from "../frontend/src/assets/Cannoli.png";
      import TiramisuCake from "../frontend/src/assets/TiramisuCake.png";
      import PannaCotta from "../frontend/src/assets/PannaCotta.png";
      import CheeseCake from "../frontend/src/assets/Cheesecake.png";
      import ChocolateMousse from "../frontend/src/assets/ChocolateMousse.png";
      import Profiteroles from "../frontend/src/assets/Profiteroles.png";
      import RicottaPie from "../frontend/src/assets/RicottaPie.png";
      import IcedLatte from "../frontend/src/assets/IcedLatte.png";
      import Mojito from "../frontend/src/assets/Mojito.png";
      import Smoothie from "../frontend/src/assets/Smoothie.png";
      import IcedTea from "../frontend/src/assets/IcedTea.png";
      import Cappuccino from "../frontend/src/assets/Cappuccino.png";
      import Lemonade from "../frontend/src/assets/Lemonade.png";
      import Espresso from "../frontend/src/assets/Espresso.png";
      import Margarita from "../frontend/src/assets/Margarita.png";
      
      export const dummyMenuData = ${dummyDataMatch[1]};
      
      export default dummyMenuData;
    `);
    
    // Import the data
    const { default: dummyData } = await import('./temp-dummy-data.js');
    
    // Clean up the temp file
    fs.unlinkSync(tempFilePath);
    
    return dummyData;
  } catch (error) {
    console.error('Error reading dummy data:', error);
    process.exit(1);
  }
};

// Function to transform the data for MongoDB
const transformData = (dummyData) => {
  const transformedData = [];
  
  // Process each category
  Object.entries(dummyData).forEach(([category, items]) => {
    items.forEach(item => {
      // Create a new item with the required fields
      const newItem = {
        name: item.name,
        price: item.price,
        description: item.description,
        category: category,
        rating: item.rating || 4.0,
        // Use the filename as the imageUrl
        imageUrl: `http://localhost:4000/uploads/${item.image.split('/').pop()}`,
      };
      
      transformedData.push(newItem);
    });
  });
  
  return transformedData;
};

// Function to import data to MongoDB
const importData = async () => {
  try {
    // Read the dummy data
    const dummyData = await readDummyData();
    
    // Transform the data
    const transformedData = transformData(dummyData);
    
    // Clear existing items
    await Item.deleteMany({});
    
    // Insert the new items
    await Item.insertMany(transformedData);
    
    console.log(`Successfully imported ${transformedData.length} menu items`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
importData();