import React from 'react';

const SkeletonLoader = ({ type = 'text', width = '100%', height = '1rem', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className="skeleton rounded"
      style={{
        width: type === 'circle' ? height : width,
        height: height,
        borderRadius: type === 'circle' ? '50%' : '0.5rem',
        marginBottom: type !== 'circle' && index < count - 1 ? '0.5rem' : '0'
      }}
    />
  ));

  return <div>{skeletons}</div>;
};

// Product card skeleton
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-[#8BC34A]/20 fade-in">
    <div className="skeleton w-full h-48" />
    <div className="p-4">
      <div className="skeleton h-6 w-3/4 mb-2" />
      <div className="skeleton h-4 w-full mb-3" />
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-1/3" />
        <div className="skeleton h-10 w-10 rounded-full" />
      </div>
    </div>
  </div>
);

// Menu category skeleton
export const CategorySkeleton = () => (
  <div className="skeleton px-4 py-2 rounded-full" style={{ width: '100px', height: '40px' }} />
);

// Order item skeleton
export const OrderItemSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md p-4 border border-[#8BC34A]/20 fade-in">
    <div className="flex justify-between items-start mb-3">
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-6 w-16 rounded-full" />
    </div>
    <div className="skeleton h-4 w-3/4 mb-2" />
    <div className="skeleton h-4 w-1/4 mb-4" />
    <div className="flex justify-between">
      <div className="skeleton h-10 w-24 rounded-full" />
      <div className="skeleton h-10 w-24 rounded-full" />
    </div>
  </div>
);

export default SkeletonLoader;