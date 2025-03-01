import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

type ImageContainerProps = {
  src: string;
  previewSrc: string;
  alt: string;
}

const getContainerStyles = (hasImage: boolean, isLoaded: boolean) => {
  let styles = 'relative w-full';

  if (!hasImage || !isLoaded) {
    styles += ' aspect-square bg-gray-300 flex flex-col items-center justify-center';
  }

  return styles;
};

export const ImageContainer = ({ src, previewSrc, alt }: ImageContainerProps) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [loaded, setLoaded] = useState(false);

  const hasImage = currentSrc !== '';

  const handleLoad = useCallback((e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setDimensions({ width, height });
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    if (currentSrc !== previewSrc) {
      setCurrentSrc(previewSrc);
      return;
    }

    setCurrentSrc('');
  }, [currentSrc, previewSrc]);

  useEffect(() => {
    if (loaded || currentSrc === '') {
      return;
    }

    const timer = setTimeout(() => {
      if (currentSrc === previewSrc || previewSrc === '') {
        setCurrentSrc('');
        return;
      }

      if (currentSrc !== previewSrc) {
        setCurrentSrc(previewSrc);
        return;
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [loaded, currentSrc, src, previewSrc]);

  return (
    <div className={getContainerStyles(hasImage, loaded)}>
      {hasImage && (
        <Image
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className="block w-full h-auto object-cover"
          width={dimensions.width}
          height={dimensions.height}
          priority
        />
      )}

      {!hasImage && <span className="font-semibold">image not found</span>}
      {hasImage && !loaded && <span className="font-semibold">loading</span>}
    </div>
  );
};
