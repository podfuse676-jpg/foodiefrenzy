import React, { useState, useEffect } from 'react';
import apiClient from './utils/apiClient';

const TestAPI = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        console.log('Fetching items from:', apiClient.defaults.baseURL);
        const response = await apiClient.get('/api/items');
        console.log('Response:', response.data);
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>API Test Results</h2>
      <p>Found {items.length} items</p>
      {items.slice(0, 3).map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>Category: {item.category}</p>
          {item.imageUrl && (
            <div>
              <p>Image URL: {item.imageUrl}</p>
              <img src={item.imageUrl} alt={item.name} style={{ width: '100px', height: '100px' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TestAPI;