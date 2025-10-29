import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewStats = ({ itemId, apiClient }) => {
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/reviews/stats/${itemId}`);
        setStats(response.data);
      } catch (err) {
        setError('Failed to load review statistics');
        console.error('Error fetching review stats:', err);
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchStats();
    }
  }, [itemId, apiClient]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#8BC34A]/30">
        <p className="text-gray-800 font-cinzel text-center">Loading review statistics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#8BC34A]/30">
        <p className="text-gray-800 font-cinzel text-center text-red-500">{error}</p>
      </div>
    );
  }

  const { averageRating, totalReviews, ratingDistribution } = stats;

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#8BC34A]/30">
      <h3 className="text-xl font-dancingscript text-gray-800 mb-4 text-center">
        Product Rating
      </h3>
      
      {/* Overall Rating */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-5xl font-dancingscript text-[#8BC34A] mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`${
                i < Math.floor(averageRating) ? 'text-yellow-400' : 'text-gray-300'
              } text-xl`}
            />
          ))}
        </div>
        <p className="text-gray-800/70 font-cinzel">
          {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </p>
      </div>
      
      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((stars) => (
          <div key={stars} className="flex items-center">
            <div className="w-10 text-gray-800 font-cinzel text-sm">
              {stars} star
            </div>
            <div className="flex-1 mx-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: totalReviews > 0 
                      ? `${(ratingDistribution[stars] / totalReviews) * 100}%` 
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
            <div className="w-8 text-gray-800 font-cinzel text-sm text-right">
              {ratingDistribution[stars]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewStats;