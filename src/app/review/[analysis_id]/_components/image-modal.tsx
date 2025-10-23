"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, Download } from "lucide-react";

interface ImageData {
  label: string;
  src: string;
  alt: string;
}

interface ImageModalProps {
  images: ImageData[];
}

export function ImageModal({ images }: ImageModalProps) {
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle ESC key press
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && selectedImage) {
        setSelectedImage(null);
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [selectedImage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  // Trigger animation when modal opens
  useEffect(() => {
    if (selectedImage) {
      // Small delay to ensure the modal is mounted before animating
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [selectedImage]);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
    setIsAnimating(false); // Start with false, will be set to true by useEffect
  };

  const handleCloseModal = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setSelectedImage(null);
    }, 200); // Match the animation duration
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  const handleOpenImage = () => {
    if (selectedImage) {
      window.open(selectedImage.src, "_blank");
    }
  };

  const handleDownloadImage = async () => {
    if (selectedImage) {
      try {
        const response = await fetch(selectedImage.src);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedImage.label.replace(/\s+/g, "_").toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading image:", error);
        // Fallback: open in new tab
        window.open(selectedImage.src, "_blank");
      }
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900 sm:mb-6 sm:text-xl">
          Analysis Images
        </h3>

        {/* Mobile: Single column stack */}
        <div className="grid gap-4 sm:hidden">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {image.label}
              </h4>
              <div className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-90">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjE2MCIgcj0iMjQiIGZpbGw9IiM5Q0EzQUYiLz4KPHA8cGF0aCBkPSJNMjAwIDIwMEMyMDAgMTkxLjE2MyAxOTEuODM3IDE4MyAxODAgMTgzQzE2OC4xNjMgMTgzIDE2MCAxOTEuMTYzIDE2MCAyMDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMTYwIiB5PSIyMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==';
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Tablet: 2 columns */}
        <div className="hidden grid-cols-2 gap-4 sm:grid lg:hidden">
          {images.map((image, index) => (
            <div key={index} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">
                {image.label}
              </h4>
              <div className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-90">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgdmlld0JveD0iMCAwIDMyMCAzMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMzIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2MCIgY3k9IjE2MCIgcj0iMjQiIGZpbGw9IiM5Q0EzQUYiLz4KPHA8cGF0aCBkPSJNMjAwIDIwMEMyMDAgMTkxLjE2MyAxOTEuODM3IDE4MyAxODAgMTgzQzE2OC4xNjMgMTgzIDE2MCAxOTEuMTYzIDE2MCAyMDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iMTYwIiB5PSIyMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==';
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Uniform grid layout */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div key={index} className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  {image.label}
                </h4>
                <div className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 transition-opacity hover:opacity-90">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="h-full w-full object-cover"
                    onClick={() => handleImageClick(image)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {selectedImage && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 transition-all duration-200 ease-out ${
            isAnimating ? "bg-opacity-75" : "bg-opacity-0"
          }`}
          onClick={handleOverlayClick}
        >
          {/* Top Right Buttons - Fixed to page */}
          <div
            className={`fixed top-6 right-6 z-50 flex gap-3 transition-all duration-200 ease-out ${
              isAnimating
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0"
            }`}
          >
            <button
              onClick={handleDownloadImage}
              title="Download image"
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-black transition-all duration-200 ease-out hover:shadow-xl active:translate-y-0.5 active:shadow-md"
            >
              <Download className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={handleOpenImage}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-black transition-all duration-200 ease-out hover:shadow-xl active:translate-y-0.5 active:shadow-md"
              title="Open image in new tab"
            >
              <ExternalLink className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={handleCloseModal}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-black transition-all duration-200 ease-out hover:shadow-xl active:translate-y-0.5 active:shadow-md"
              title="Close"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Modal Content */}
          <div
            className={`relative max-h-[90vh] max-w-[90vw] transform transition-all duration-200 ease-out ${
              isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {/* Modal Image */}
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iNDAiIGZpbGw9IiM5Q0EzQUYiLz4KPHA8cGF0aCBkPSJNNDgwIDM4MEM0ODAgMzYyLjMyNyA0NjIuMzI3IDM0NSA0NDAgMzQ1QzQxNy42NzMgMzQ1IDQwMCAzNjIuMzI3IDQwMCAzODAiIGZpbGw9IiM5Q0EzQUYiLz4KPHRleHQgeD0iNDAwIiB5PSI0MjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCI+SW1hZ2Ugbm90IGF2YWlsYWJsZTwvdGV4dD4KPC9zdmc+Cg==';
              }}
            />

            {/* Image Label */}
            {/* <div className="bg-opacity-50 absolute right-0 bottom-0 left-0 rounded-b-lg bg-black p-3 text-white">
              <p className="text-center font-medium">{selectedImage.label}</p>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
}
