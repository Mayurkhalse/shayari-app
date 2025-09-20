import React from 'react';

const SkeletonLoader = ({ type = 'default', className = '' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const getSkeletonClasses = () => {
    switch (type) {
      case 'text':
        return `${baseClasses} h-4`;
      case 'title':
        return `${baseClasses} h-6 w-3/4`;
      case 'avatar':
        return `${baseClasses} w-10 h-10 rounded-full`;
      case 'button':
        return `${baseClasses} h-10 w-24`;
      case 'card':
        return `${baseClasses} h-32 w-full`;
      case 'shayari':
        return `${baseClasses} h-24 w-full`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={`${getSkeletonClasses()} ${className}`}></div>
  );
};

export const ShayariCardSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center space-x-3 mb-4">
      <SkeletonLoader type="avatar" />
      <div className="space-y-2">
        <SkeletonLoader type="text" className="w-20" />
        <SkeletonLoader type="text" className="w-16" />
      </div>
    </div>
    
    <div className="space-y-2 mb-4">
      <SkeletonLoader type="shayari" />
      <SkeletonLoader type="text" className="w-3/4" />
    </div>
    
    <div className="flex items-center space-x-6 pt-2 border-t border-gray-50">
      <SkeletonLoader type="button" className="w-16" />
      <SkeletonLoader type="button" className="w-20" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-6">
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <SkeletonLoader type="avatar" className="w-16 h-16" />
          <div className="space-y-2">
            <SkeletonLoader type="title" />
            <SkeletonLoader type="text" className="w-32" />
            <div className="flex space-x-4">
              <SkeletonLoader type="button" className="w-20" />
              <SkeletonLoader type="button" className="w-24" />
            </div>
          </div>
        </div>
        <SkeletonLoader type="button" className="w-24" />
      </div>
    </div>
  </div>
);

export const HomePageSkeleton = () => (
  <div className="space-y-4">
    <div className="mb-6">
      <SkeletonLoader type="title" className="w-48" />
      <SkeletonLoader type="text" className="w-64 mt-2" />
    </div>
    
    {[...Array(3)].map((_, index) => (
      <ShayariCardSkeleton key={index} />
    ))}
  </div>
);

export default SkeletonLoader;
