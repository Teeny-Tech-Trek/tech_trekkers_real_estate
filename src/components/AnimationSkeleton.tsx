import React from 'react';

interface AnimationSkeletonProps {
  className?: string;
  animationType?: 'card' | 'text' | 'image' | 'full';
  count?: number;
}

const AnimationSkeleton = ({
  className = '',
  animationType = 'card',
  count = 1,
}: AnimationSkeletonProps) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 animate-pulse rounded';

  if (animationType === 'card') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className={`${baseClasses} h-48 w-full`}
          />
        ))}
      </div>
    );
  }

  if (animationType === 'text') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className={`${baseClasses} h-4 w-3/4`} />
        <div className={`${baseClasses} h-4 w-1/2`} />
        <div className={`${baseClasses} h-4 w-5/6`} />
      </div>
    );
  }

  if (animationType === 'image') {
    return (
      <div
        className={`${baseClasses} h-64 w-full ${className}`}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className={`${baseClasses} h-12 w-1/2`} />
      <div className={`${baseClasses} h-64 w-full`} />
      <div className={`space-y-2`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={`${baseClasses} h-4 w-full`} />
        ))}
      </div>
    </div>
  );
};

export default AnimationSkeleton;
