import React, { useState, useEffect } from 'react';
import apiClient from './utils/apiClient';

const TestMenu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching menu items from:', apiClient.defaults.baseURL);
        const response = await apiClient.get('/api/items');
        console.log('API Response:', response);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div className="p-4">Loading menu items...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Menu Test Results</h2>
      <p>Total items: {items.length}</p>
      <div className="mt-4">
        {items.slice(0, 5).map(item => (
          <div key={item._id} className="border p-2 mb-2">
            <h3 className="font-semibold">{item.name}</h3>
            <p>Category: {item.category}</p>
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestMenu;