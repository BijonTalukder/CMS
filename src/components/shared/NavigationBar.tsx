"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface DynamicNavBarProps {
  title: string;
  onBackClick?: () => void;
  onNextClick?: () => void;
  className?: string;
  // Optional overrides
  forceShowBack?: boolean;
  forceShowNext?: boolean;
  customBackPath?: string;
  customNextPath?: string;
}

export default function DynamicNavBar({
  title,
  onBackClick,
  onNextClick,
  className = "",
  forceShowBack,
  forceShowNext,
  customBackPath,
  customNextPath
}: DynamicNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Check if back path exists
  const getBackPath = () => {
    if (customBackPath) return customBackPath;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 1) {
      // Remove last segment to go back one level
      pathSegments.pop();
      return '/' + pathSegments.join('/');
    }
    // If at root level, no back path
    return null;
  };

  // Check if next path exists (this logic can be customized based on your app)
  const getNextPath = () => {
    if (customNextPath) return customNextPath;
    
    const pathSegments = pathname.split('/').filter(Boolean);
    const currentSegment = pathSegments[pathSegments.length - 1];
    
    // Example: If current path has numeric ID, assume next ID exists
    if (currentSegment && !isNaN(Number(currentSegment))) {
      const nextId = Number(currentSegment) + 1;
      pathSegments[pathSegments.length - 1] = nextId.toString();
      return '/' + pathSegments.join('/');
    }
    
    // You can add more logic here based on your app's structure
    // For now, return null if no next path can be determined
    return null;
  };

  const backPath = getBackPath();
  const nextPath = getNextPath();

  // Determine if buttons should be shown
  const showBackButton = forceShowBack || (backPath !== null);
  const showNextButton = forceShowNext || (nextPath !== null);

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else if (backPath) {
      router.push(backPath);
    } else {
      // Fallback to browser back
      router.back();
    }
  };

  const handleNextClick = () => {
    if (onNextClick) {
      onNextClick();
    } else if (nextPath) {
      router.push(nextPath);
    }
  };

  return (
    <div className={`sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Back Button - Only show if back path exists */}
        {showBackButton && (
          <button
            onClick={handleBackClick}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Title - Dynamic width based on available buttons */}
        <h1 className={`text-lg font-semibold text-gray-900 ${
          showBackButton && showNextButton 
            ? 'flex-1 text-center' 
            : showBackButton 
              ? 'flex-1 text-center mr-10' 
              : showNextButton 
                ? 'flex-1 text-center ml-10'
                : 'flex-1 text-center'
        }`}>
          {title}
        </h1>

        {/* Next Button - Only show if next path exists */}
        {showNextButton && (
          <button
            onClick={handleNextClick}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go next"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

