'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  featured: boolean;
  images: ProductImage[];
}

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

  const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
  const imageSrc = mainImage ? getImageSrc(mainImage) : null;
  
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
    <div className={`group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-200 ${!isActive && variant === 'dashboard' ? 'opacity-60' : ''}`}>
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={mainImage?.altText || product.name}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-300">📷</div>
              <span className="text-xs text-gray-400">Sin imagen</span>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {!imageLoaded && !imageError && imageSrc && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              ⭐ Destacado
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              Agotado
            </span>
          )}
          {!isActive && variant === 'dashboard' && (
            <span className="bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
              Inactivo
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {variant === 'catalog' && onFavoriteToggle && (
            <button
              onClick={handleFavoriteClick}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-white hover:scale-110"
              title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <span className="text-lg">
                {isFavorite ? '❤️' : '🤍'}
              </span>
            </button>
          )}
          
          {variant === 'dashboard' && (
            <div className="flex flex-col gap-1">
              {onEdit && (
                <button
                  onClick={handleEditClick}
                  className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:bg-blue-600 hover:scale-110"
                  title="Editar producto"
                >
                  <span className="text-xs">✏️</span>
                </button>
              )}
              {onToggleActive && (
                <button
                  onClick={handleToggleActiveClick}
                  className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110 ${
                    isActive 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                  title={isActive ? 'Desactivar producto' : 'Activar producto'}
                >
                  <span className="text-xs">
                    {isActive ? '👁️‍🗨️' : '👁️'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hover overlay for better interaction feedback */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Category */}
        <div className="space-y-1">
          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-pink-700 transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 capitalize font-medium">
            {product.category}
          </p>
        </div>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price and Stock */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {variant === 'dashboard' && (
              <span className="text-xs text-gray-500">
                Stock: {product.stock}
              </span>
            )}
          </div>
          
          {variant === 'catalog' && (
            <div className="flex items-center space-x-2">
              {product.stock > 0 ? (
                <span className="text-xs text-green-600 font-medium">
                  Disponible
                </span>
              ) : (
                <span className="text-xs text-red-600 font-medium">
                  Agotado
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions for Dashboard */}
        {variant === 'dashboard' && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-500">
              <span>ID: {product.id.slice(0, 8)}...</span>
              <span className={`font-medium ${isActive ? 'text-green-600' : 'text-red-600'}`}>
                {isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Subtle bottom gradient for depth */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );

  if (variant === 'catalog') {
    return (
      <Link 
        href={`/products/${product.category}/${product.id}`}
        className="block transform transition-transform duration-200 hover:scale-[1.02]"
      >
        {cardContent}
      </Link>
    );
  }

  return cardContent;
} 