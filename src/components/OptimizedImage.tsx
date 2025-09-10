'use client';

import { useState, useRef, useEffect } from 'react';
import { Film } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  aspectRatio?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  aspectRatio,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalHeight !== 0) {
      setIsLoaded(true);
      onLoad?.();
    }
  }, [src, onLoad]);

  // Detect mobile after component mounts to avoid hydration mismatch
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center w-full h-full ${className}`}
        style={{ aspectRatio }}
      >
        <Film className="w-8 h-8 text-gray-500" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full" style={{ aspectRatio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover ${className} ${isMobile ? 'transition-opacity duration-200' : 'transition-opacity duration-300'}`}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
        style={{ 
          opacity: isLoaded ? 1 : 0.7,
          filter: isMobile ? 'none' : (isLoaded ? 'none' : 'blur(1px)')
        }}
      />
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20 ${isMobile ? '' : 'animate-pulse'} pointer-events-none`} />
      )}
    </div>
  );
}
