import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewList = ({ itemId, apiClient }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/reviews/item/${itemId}`);
        setReviews(response.data.reviews);
      } catch (err) {
        setError('Failed to load reviews');
        console.error('Error fetching reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchReviews();
    }
  }, [itemId, apiClient]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-800 font-cinzel">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
        <p className="font-cinzel">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-800 font-cinzel">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-dancingscript text-gray-800 mb-4">
        Customer Reviews
      </h3>
      
      {reviews.map((review) => (
        <div 
          key={review._id} 
          className="bg-white p-4 rounded-2xl border border-[#8BC34A]/30"
        >
          {/* Review Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-cinzel font-bold text-gray-800">
                {review.title}
              </h4>
              <p className="text-gray-800/70 text-sm font-cinzel">
                by {review.user?.username || review.user?.email || 'Customer'} •{' '}
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    } text-sm`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-800 font-cinzel text-sm">
                {review.rating}.0
              </span>
            </div>
          </div>
          
          {/* Review Comment */}
          <p className="text-gray-800 font-cinzel mb-3">
            {review.comment}
          </p>
          
          {/* Verified Purchase Badge */}
          {review.verifiedPurchase && (
            <div className="inline-block bg-[#8BC34A]/20 text-[#8BC34A] px-2 py-1 rounded-full text-xs font-cinzel">
              Verified Purchase
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;