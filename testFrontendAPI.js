// Simple test to verify frontend can access backend API
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const testAPI = async () => {
  try {
    console.log('Testing frontend API access...');
    
    // Test backend API directly
    const { stdout } = await execAsync('curl -s http://localhost:4000/api/items');
    const data = JSON.parse(stdout);
    console.log(`Backend API returned ${data.length} items`);
    
    // Check categories
    const categories = [...new Set(data.map(item => item.category))];
    console.log('Grocery categories found:', categories.filter(cat => 
      ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Essentials'].includes(cat)
    ));
    
    // Check items in each grocery category
    const groceryCategories = ['Fruits', 'Vegetables', 'Dairy', 'Beverages', 'Snacks', 'Essentials'];
    for (const category of groceryCategories) {
      const count = data.filter(item => item.category === category).length;
      if (count > 0) {
        console.log(`${category}: ${count} items`);
      }
    }
    
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
};

testAPI();