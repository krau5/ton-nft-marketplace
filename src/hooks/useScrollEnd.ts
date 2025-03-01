import { useEffect } from 'react';

type Props = {
  threshold?: number;
};

/**
 * Triggers a callback, when user scrolls to the end of the window.
 * Threshold is customizable in order to tweak the UX.
 * */
export const useScrollEnd = (
  callback: () => void,
  { threshold = 100 }: Props = {}
): void => {
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        callback();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, threshold]);
};
