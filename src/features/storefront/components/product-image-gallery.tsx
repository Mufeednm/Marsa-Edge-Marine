"use client";

import { useRef, useState, type ReactElement, type TouchEvent } from "react";
import { ProductImage } from "@/features/storefront/components/product-image";

const minimumSwipeDistance = 48;

export function ProductImageGallery({
  alt,
  images,
}: {
  alt: string;
  images: string[];
}): ReactElement {
  const galleryImages = Array.from(new Set(images));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const hasMultipleImages = galleryImages.length > 1;
  const currentIndex = Math.min(selectedIndex, Math.max(galleryImages.length - 1, 0));
  const selectedImage = galleryImages[currentIndex] ?? galleryImages[0] ?? null;

  function showImage(index: number): void {
    setSelectedIndex((index + galleryImages.length) % galleryImages.length);
  }

  function showPreviousImage(): void {
    showImage(currentIndex - 1);
  }

  function showNextImage(): void {
    showImage(currentIndex + 1);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>): void {
    const touch = event.touches[0];
    if (!touch) {
      return;
    }
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>): void {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;
    if (!start || !touch) {
      return;
    }

    const horizontalDistance = touch.clientX - start.x;
    const verticalDistance = touch.clientY - start.y;
    if (
      Math.abs(horizontalDistance) < minimumSwipeDistance ||
      Math.abs(horizontalDistance) <= Math.abs(verticalDistance)
    ) {
      return;
    }

    if (horizontalDistance < 0) {
      showNextImage();
      return;
    }
    showPreviousImage();
  }

  return (
    <div
      aria-label={
        hasMultipleImages
          ? "Product image gallery. Swipe left or right to change image."
          : undefined
      }
      className="relative h-full touch-pan-y"
      onTouchEnd={hasMultipleImages ? handleTouchEnd : undefined}
      onTouchStart={hasMultipleImages ? handleTouchStart : undefined}
    >
      <ProductImage
        alt={alt}
        className="mx-auto h-full min-h-[310px] w-full object-contain"
        height={900}
        imageUrl={selectedImage}
        key={selectedImage}
        priority
        width={900}
      />

      {hasMultipleImages ? (
        <>
          <button
            aria-label="Show previous product image"
            className="absolute top-1/2 left-0 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-[#0a2540] shadow-sm transition hover:bg-white hover:text-[#0e7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490]"
            onClick={showPreviousImage}
            type="button"
          >
            <ChevronLeft />
          </button>
          <button
            aria-label="Show next product image"
            className="absolute top-1/2 right-0 z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white/95 text-[#0a2540] shadow-sm transition hover:bg-white hover:text-[#0e7490] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490]"
            onClick={showNextImage}
            type="button"
          >
            <ChevronRight />
          </button>
          <p
            aria-live="polite"
            className="absolute top-0 right-0 rounded-full bg-[#0a2540]/85 px-3 py-1.5 text-xs font-bold text-white"
          >
            Image {currentIndex + 1} of {galleryImages.length}
          </p>
          <div className="absolute bottom-0 left-1/2 flex max-w-[calc(100%-6rem)] -translate-x-1/2 gap-2 rounded-2xl bg-white/90 p-2 shadow-sm">
            {galleryImages.map((image, index) => (
              <button
                aria-label={`Show product image ${index + 1} of ${galleryImages.length}`}
                aria-pressed={currentIndex === index}
                className={`size-11 shrink-0 overflow-hidden rounded-xl border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0e7490] ${
                  currentIndex === index
                    ? "border-[#0e7490]"
                    : "border-transparent hover:border-slate-300"
                }`}
                key={image}
                onClick={() => showImage(index)}
                type="button"
              >
                <ProductImage
                  alt=""
                  className="h-full w-full object-cover"
                  height={48}
                  imageUrl={image}
                  width={48}
                />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ChevronLeft(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronRight(): ReactElement {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
