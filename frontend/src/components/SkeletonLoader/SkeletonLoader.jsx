import React from 'react';
import { motion } from 'framer-motion';

// Product Card Skeleton Component
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-[#8BC34A]/20 overflow-hidden animate-pulse">
      <div className="bg-gray-200 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-8 bg-gray-200 rounded-full w-8"></div>
        </div>
      </div>
    </div>
  );
};

// Category Tab Skeleton Component
export const CategorySkeleton = () => {
  return (
    <div className="px-4 py-2 rounded-full bg-gray-200 animate-pulse"></div>
  );
};

// Main Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FFF6] via-[#FFFFFF] to-[#F9FFF6] py-8 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-200 rounded-full w-16 h-16 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded-lg mb-4 animate-pulse mx-auto max-w-md"></div>
            <div className="h-6 bg-gray-200 rounded-lg animate-pulse mx-auto max-w-lg"></div>
          </div>

          {/* FAQ Items Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.1 * index
                }}
              >
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA Skeleton */}
          <div className="mt-12 bg-gray-200 rounded-2xl p-8 animate-pulse">
            <div className="h-8 bg-gray-300 rounded-lg mb-4 max-w-md mx-auto"></div>
            <div className="h-6 bg-gray-300 rounded-lg mb-6 max-w-lg mx-auto"></div>
            <div className="h-12 bg-gray-300 rounded-full max-w-xs mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;