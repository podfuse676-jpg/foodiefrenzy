import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const ReviewForm = ({ item, orderId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (rating === 0) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title for your review');
      setLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError('Please enter your review comment');
      setLoading(false);
      return;
    }

    if (!orderId) {
      setError('Order information is missing');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        itemId: item._id || item.id,
        orderId,
        rating,
        title,
        comment
      });
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-[#8BC34A]/30 shadow-lg">
      <h3 className="text-2xl font-dancingscript text-gray-800 mb-4 text-center">
        Review {item.name}
      </h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Rating Selection */}
        <div className="mb-6">
          <label className="block text-gray-800 font-cinzel mb-2">
            Your Rating
          </label>
          <div className="flex justify-center">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i} className="cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className={`w-8 h-8 mx-1 transition-colors ${
                      ratingValue <= (hover || rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
          {rating > 0 && (
            <p className="text-center text-gray-800 mt-2 font-cinzel">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          )}
        </div>
        
        {/* Title Input */}
        <div className="mb-4">
          <label className="block text-gray-800 font-cinzel mb-2">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full px-4 py-2 border border-[#8BC34A]/30 rounded-lg focus:outline-none focus:border-[#8BC34A] font-cinzel"
            maxLength={100}
          />
        </div>
        
        {/* Comment Textarea */}
        <div className="mb-6">
          <label className="block text-gray-800 font-cinzel mb-2">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product"
            rows={4}
            className="w-full px-4 py-2 border border-[#8BC34A]/30 rounded-lg focus:outline-none focus:border-[#8BC34A] font-cinzel"
            maxLength={1000}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-cinzel hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-[#8BC34A] to-[#7CB342] text-white py-2 px-4 rounded-lg font-cinzel hover:from-[#7CB342] hover:to-[#8BC34A] transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;