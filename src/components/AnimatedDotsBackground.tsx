'use client';

import { CSSProperties, useEffect, useRef, useState } from 'react';
import styles from './AnimatedDotsBackground.module.css';

type Dot = {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  minOpacity: number;
  maxOpacity: number;
  blurMin: number;
  blurMax: number;
  scaleMax: number;
};

const desktopBreakpoint = 1280;
const tabletBreakpoint = 768;

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

const createDots = (count: number): Dot[] =>
  Array.from({ length: count }, () => {
    const size = randomBetween(1.8, 5);
    const minOpacity = randomBetween(0.08, 0.22);
    const maxOpacity = Math.min(0.85, minOpacity + randomBetween(0.25, 0.55));
    const blurMin = randomBetween(0, 1.1);
    const blurMax = blurMin + randomBetween(0.8, 2.2);

    return {
      top: randomBetween(0, 100),
      left: randomBetween(0, 100),
      size,
      delay: randomBetween(0, 12),
  duration: randomBetween(6, 12),
      minOpacity,
      maxOpacity,
      blurMin,
      blurMax,
      scaleMax: randomBetween(1.4, 2.1),
    };
  });

const resolveDotCount = () => {
  if (typeof window === 'undefined') {
    return 0;
  }

  const width = window.innerWidth;
  if (width >= desktopBreakpoint) {
    return 320;
  }
  if (width >= tabletBreakpoint) {
    return 260;
  }
  return 210;
};

export default function AnimatedDotsBackground() {
  const [dots, setDots] = useState<Dot[]>([]);
  const resizeFrame = useRef<number | null>(null);

  useEffect(() => {
    const updateDots = () => {
      const count = resolveDotCount();
      setDots(createDots(count));
      resizeFrame.current = null;
    };

    updateDots();

    const handleResize = () => {
      if (resizeFrame.current !== null) {
        cancelAnimationFrame(resizeFrame.current);
      }

      resizeFrame.current = requestAnimationFrame(updateDots);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeFrame.current !== null) {
        cancelAnimationFrame(resizeFrame.current);
      }
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {dots.map((dot, index) => {
        const dotStyle: CSSProperties & Record<string, string | number> = {
          top: `${dot.top}%`,
          left: `${dot.left}%`,
          width: `${dot.size}px`,
          height: `${dot.size}px`,
          animationDelay: `${dot.delay}s`,
          animationDuration: `${dot.duration}s`,
          opacity: dot.minOpacity,
        };

        dotStyle['--opacity-min'] = `${dot.minOpacity}`;
        dotStyle['--opacity-max'] = `${dot.maxOpacity}`;
        dotStyle['--scale-min'] = '1';
        dotStyle['--scale-max'] = `${dot.scaleMax}`;
        dotStyle['--blur-min'] = `${dot.blurMin}px`;
        dotStyle['--blur-max'] = `${dot.blurMax}px`;

        return (
          <span
            key={`dot-${index}`}
            className={styles.dot}
            style={dotStyle}
          />
        );
      })}
    </div>
  );
}
