import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../../utils/apiConfig';

const TestImages = () => {
  const url = apiConfig.baseURL;
  const [testImages, setTestImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fallback SVG as data URI
  const fallbackSvg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZXN0IEltYWdlPC90ZXh0Pjwvc3ZnPg==';
  
  useEffect(() => {
    const fetchTestImages = async () => {
      try {
        setLoading(true);
        // Try to fetch some items to test image URLs
        const token = localStorage.getItem('adminToken');
        const response = await axios.get(`${url}/api/items/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Get first few items with images
        const itemsWithImages = response.data.items
          .filter(item => item.imageUrl)
          .slice(0, 3);
          
        setTestImages(itemsWithImages);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching test images:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestImages();
  }, [url]);
  
  if (loading) return <div>Loading test images...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 bg-gray-800 text-white">
      <h2>Test Images</h2>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p>Working image:</p>
          <img 
            src="https://via.placeholder.com/40" 
            alt="Test" 
            className="w-10 h-10 object-cover rounded-lg"
          />
        </div>
        <div>
          <p>Fallback SVG:</p>
          <img 
            src={fallbackSvg}
            alt="Fallback" 
            className="w-10 h-10 object-cover rounded-lg"
          />
        </div>
        <div>
          <p>Broken image (should show fallback):</p>
          <img 
            src="https://this-domain-definitely-does-not-exist-12345.com/broken-image.jpg"
            alt="Broken" 
            className="w-10 h-10 object-cover rounded-lg"
            onError={(e) => {
              console.log('Broken image error handled');
              e.target.src = fallbackSvg;
            }}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h3>Actual Item Images:</h3>
        <div className="grid grid-cols-3 gap-4">
          {testImages.map((item, index) => {
            const imageUrl = item.imageUrl;
            const fullImageUrl = imageUrl 
              ? (imageUrl.startsWith('http') ? imageUrl : `${url}${imageUrl}`)
              : fallbackSvg;
              
            console.log('Test image URL:', { imageUrl, fullImageUrl });
            
            return (
              <div key={index} className="border p-2">
                <p className="text-sm">{item.name}</p>
                <img 
                  src={fullImageUrl}
                  alt={item.name} 
                  className="w-10 h-10 object-cover rounded-lg"
                  onError={(e) => {
                    console.log('Item image error:', e.target.src);
                    e.target.src = fallbackSvg;
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TestImages;