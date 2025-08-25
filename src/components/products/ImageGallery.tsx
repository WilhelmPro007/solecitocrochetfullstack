'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
  order: number;
  imageData?: Uint8Array;
  mimeType?: string;
  filename?: string;
  fileSize?: number;
}

interface ImageGalleryProps {
  images: ProductImage[];
  onImageReorder?: (images: ProductImage[]) => void;
  onImageDelete?: (imageId: string) => void;
  onImageSetMain?: (imageId: string) => void;
  onImageUpdate?: (imageId: string, updates: Partial<ProductImage>) => void;
  editable?: boolean;
  className?: string;
}

export default function ImageGallery({
  images,
  onImageReorder,
  onImageDelete,
  onImageSetMain,

  editable = false,
  className = ''
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // Ordenar imágenes por orden y isMain
  const sortedImages = [...images].sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return a.order - b.order;
  });

  const currentImage = sortedImages[selectedImageIndex] || sortedImages[0];

  const getImageSrc = (image: ProductImage) => {
    if (image.id) {
      return `/api/images/${image.id}`;
    }
    if (image.url) {
      return image.url;
    }
    return null;
  };

  const nextImage = () => {
    if (sortedImages.length > 1) {
      setSelectedImageIndex((prev) => (prev + 1) % sortedImages.length);
    }
  };

  const prevImage = () => {
    if (sortedImages.length > 1) {
      setSelectedImageIndex((prev) => 
        prev === 0 ? sortedImages.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (dragIndex === null || dragIndex === dropIndex) return;

    const newImages = [...sortedImages];
    const draggedImage = newImages[dragIndex];
    
    // Remover imagen arrastrada
    newImages.splice(dragIndex, 1);
    
    // Insertar en nueva posición
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Actualizar orden
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      order: index,
      isMain: index === 0 ? true : false
    }));

    onImageReorder?.(updatedImages);
    setDragIndex(null);
  };

  const handleDeleteImage = (imageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      onImageDelete?.(imageId);
      
      // Si eliminamos la imagen actual, ir a la primera
      if (selectedImageIndex >= sortedImages.length - 1) {
        setSelectedImageIndex(0);
      }
    }
  };

  const handleSetMain = (imageId: string) => {
    onImageSetMain?.(imageId);
  };

  if (sortedImages.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-2 text-gray-300">📷</div>
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Image Display */}
      <div className={`relative bg-gray-50 rounded-lg overflow-hidden ${className}`}>
        {currentImage && (
          <>
            <Image
              src={getImageSrc(currentImage) || ''}
              alt={currentImage.altText || 'Producto'}
              width={400}
              height={400}
              className="w-full h-auto object-cover cursor-pointer"
              onClick={openModal}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
            />
            
            {/* Navigation Arrows */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition-all duration-200"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 shadow-md transition-all duration-200"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {sortedImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {selectedImageIndex + 1} / {sortedImages.length}
              </div>
            )}
            
            {/* Main Image Badge */}
            {currentImage.isMain && (
              <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Principal
              </div>
            )}
          </>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {sortedImages.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sortedImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative flex-shrink-0 cursor-pointer group ${
                  index === selectedImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
                draggable={editable}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                onClick={() => goToImage(index)}
              >
                <Image
                  src={getImageSrc(image) || ''}
                  alt={image.altText || `Imagen ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  sizes="80px"
                />
                
                {/* Main Image Indicator */}
                {image.isMain && (
                  <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded-full">
                    <StarIcon className="w-3 h-3" />
                  </div>
                )}
                
                {/* Edit Overlay */}
                {editable && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetMain(image.id);
                        }}
                        className={`p-1 rounded-full ${
                          image.isMain 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-white/80 text-gray-700 hover:bg-blue-500 hover:text-white'
                        } transition-colors`}
                        title={image.isMain ? 'Ya es imagen principal' : 'Establecer como principal'}
                      >
                        <StarIcon className="w-3 h-3" />
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        className="p-1 rounded-full bg-white/80 text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                        title="Eliminar imagen"
                      >
                        <TrashIcon className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            
            {/* Main Image */}
            {currentImage && (
              <Image
                src={getImageSrc(currentImage) || ''}
                alt={currentImage.altText || 'Producto'}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
              />
            )}
            
            {/* Navigation in Modal */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
            
            {/* Image Info */}
            {currentImage && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {currentImage.altText || `Imagen ${selectedImageIndex + 1}`}
                    </p>
                    {currentImage.filename && (
                      <p className="text-sm text-gray-300">{currentImage.filename}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {selectedImageIndex + 1} de {sortedImages.length}
                    </p>
                    {currentImage.isMain && (
                      <p className="text-sm text-blue-300">⭐ Imagen Principal</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
} 