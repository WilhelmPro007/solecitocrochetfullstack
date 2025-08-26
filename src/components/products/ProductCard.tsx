'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { Product, ProductImage } from '@/hooks/useProducts';

interface ProductCardProps {
  product: Product;
  onFavoriteToggle?: (productId: string) => void;
  isFavorite?: boolean;
  variant?: 'catalog' | 'dashboard';
  onEdit?: (productId: string) => void;
  onToggleActive?: (productId: string, currentStatus: boolean) => void;
  isActive?: boolean;
}

export default function ProductCard({ 
  product, 
  onFavoriteToggle,
  isFavorite = false,
  variant = 'catalog',
  onEdit,
  onToggleActive,
  isActive = true
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const getImageSrc = (image: ProductImage) => {
    // Si la imagen tiene imageData (BLOB), usar la API
    if (image.id) {
      return `/api/images/${image.id}`;
    }
    // Si tiene URL (compatibilidad con sistema anterior), usar la URL
    if (image.url) {
      return image.url;
    }
    return null;
  };

  // Ordenar imágenes por orden y isMain
  const sortedImages = product.images?.sort((a, b) => {
    if (a.isMain) return -1;
    if (b.isMain) return 1;
    return a.order - b.order;
  }) || [];

  const currentImage = sortedImages[currentImageIndex] || sortedImages[0];
  const imageSrc = currentImage ? getImageSrc(currentImage) : null;
  
  const nextImage = () => {
    if (sortedImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
      setImageLoaded(false);
      setImageError(false);
    }
  };

  const prevImage = () => {
    if (sortedImages.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? sortedImages.length - 1 : prev - 1
      );
      setImageLoaded(false);
      setImageError(false);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoaded(false);
    setImageError(false);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFavoriteToggle?.(product.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(product.id);
  };

  const handleToggleActiveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleActive?.(product.id, isActive);
  };

  const cardContent = (
    <div className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 ${!isActive && variant === 'dashboard' ? 'opacity-90 border-red-900 border-4' : ''}`}>
      
      {/* Image Container with Gallery */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {imageSrc && !imageError ? (
          <>
            <Image
              src={imageSrc}
              alt={currentImage?.altText || product.name}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Navigation Arrows - Solo mostrar si hay más de una imagen */}
            {sortedImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-1.5 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-1.5 shadow-md transition-all duration-200 opacity-0 group-hover:opacity-100"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </>
            )}
            
            {/* Image Counter */}
            {sortedImages.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                {currentImageIndex + 1} / {sortedImages.length}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-300">📷</div>
              <div className="text-sm text-gray-400">Sin imagen</div>
            </div>
          </div>
        )}
        
        {/* Loading Skeleton */}
        {!imageLoaded && imageSrc && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {/* Image Thumbnails - Solo mostrar si hay más de una imagen */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Ir a imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {/* Favorite Button */}
        {variant === 'catalog' && onFavoriteToggle && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 left-2 p-2 rounded-full transition-all duration-200 z-20 ${
              isFavorite 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          >
            <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
        
        {/* Featured Badge - Top Right */}
        {product.featured && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-20">
            ⭐ Destacado
          </div>
        )}

        {/* Inactive Badge - Top Left (solo si no hay favorite button) */}
        {variant === 'dashboard' && !isActive && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-20">
            ❌ Inactivo
          </div>
        )}
        
        {/* Stock Badge - Bottom Left */}
        {product.stock === 0 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg z-20">
            Agotado
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 ${!isActive && variant === 'dashboard' ? 'bg-pink-100' : ''}`}>
        {/* Category */}
        <div className="text-xs text-blue-600 font-medium mb-1 capitalize">
          {product.category}
        </div>
        
        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </div>
          
          {variant === 'dashboard' ? (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={handleEditClick}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Editar producto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
              
              {onToggleActive && (
                <button
                  onClick={handleToggleActiveClick}
                  className={`px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                    isActive 
                      ? 'text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300' 
                      : 'text-green-600 hover:bg-green-50 border border-green-200 hover:border-green-300'
                  }`}
                  aria-label={isActive ? 'Desactivar producto' : 'Activar producto'}
                >
                  {isActive ? (
                    <>
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Desactivar
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Activar
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Stock: {product.stock}
            </div>
          )}
        </div>
        
        {/* Status Badge for Dashboard */}
        {variant === 'dashboard' && (
          <div className={`mt-2 text-xs px-2 py-1 rounded-full text-center ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Activo' : 'Inactivo'}
          </div>
        )}
      </div>
    </div>
  );

  // Render as link for catalog, as div for dashboard
  if (variant === 'catalog') {
    return (
      <Link href={`/products/${product.category}/${product.id}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
} 