import { useState } from "react";

interface ImageSliderProps {
  images?: string[];
  alt?: string;
  aspectRatio?: string;
  showThumbnails?: boolean;
}

export default function ImageSlider({
  images = [],
  alt = "Product image",
  aspectRatio = "aspect-square",
  showThumbnails = false,
}: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages = images.filter((img) => typeof img === "string" && img.trim().length > 0);

  if (validImages.length === 0) {
    return (
      <div
        className={`w-full ${aspectRatio} bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border border-gray-200`}
      >
        <svg
          className="w-12 h-12 mb-2 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-xs">No image available</span>
      </div>
    );
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIndex(idx);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div
        className={`relative w-full ${aspectRatio} bg-gray-50 rounded-lg overflow-hidden border border-gray-200 group select-none`}
      >
        <img
          src={validImages[currentIndex]}
          alt={`${alt} - view ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        />

        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 shadow"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition opacity-80 hover:opacity-100 shadow"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/40 backdrop-blur-xs">
              {validImages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => goToSlide(idx, e)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex
                      ? "bg-white w-4"
                      : "bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>

            <span className="absolute top-2 right-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
              {currentIndex + 1} / {validImages.length}
            </span>
          </>
        )}
      </div>

      {showThumbnails && validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => goToSlide(idx, e)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition ${
                idx === currentIndex
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
