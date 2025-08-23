'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  images: ProductImage[];
  featured: boolean;
  popularity?: {
    popularityScore: number;
    totalClicks: number;
    weeklyClicks: number;
    monthlyClicks: number;
  };
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
}

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      // Usar el endpoint de productos populares
      const response = await fetch('/api/products/popular?limit=6');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = (product: Product) => {
    const message = `¡Hola! Me interesa este producto de Solecito Crochet:\n\n🎀 ${product.name}\n💰 $${product.price}\n📝 ${product.description}\n\n¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getPopularityBadge = (product: Product) => {
    if (!product.popularity) return null;
    
    const { popularityScore, totalClicks } = product.popularity;
    
    if (popularityScore > 10) {
      return (
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          🔥 Muy Popular
        </span>
      );
    } else if (popularityScore > 5) {
      return (
        <span className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          ⭐ Popular
        </span>
      );
    } else if (totalClicks > 0) {
      return (
        <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          👀 Visto {totalClicks} veces
        </span>
      );
    }
    
    return null;
  };

  const getCategoryIcon = (category: string) => {
    const categoryIcons: { [key: string]: string } = {
      accesorios: '🧣',
      bolsos: '👜',
      juguetes: '🧸',
      bebe: '👶',
      hogar: '🏠',
      ropa: '👗'
    };
    return categoryIcons[category] || '🎀';
  };

  if (loading) {
    return (
      <section id="productos" className="px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los productos más especiales de nuestra colección, seleccionados especialmente para ti
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-300 animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="productos" className="px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre los productos más especiales de nuestra colección, seleccionados especialmente para ti
          </p>
        </div>
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🎀</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Próximamente productos destacados
          </h3>
          <p className="text-gray-900 mb-6">
            Estamos preparando una hermosa selección de productos especiales para ti
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>🛍️</span>
            <span>Ver Todos los Productos</span>
          </Link>
        </div>
      </section>
    );
  }

  // Separar productos destacados de los regulares
  const featuredProducts = products.filter(p => p.featured);
  const regularProducts = products.filter(p => !p.featured);

  return (
    <section id="productos" className="px-6 pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre los productos más especiales de nuestra colección, seleccionados especialmente para ti
        </p>
      </div>
      
      {/* Productos Destacados */}
      {featuredProducts.length > 0 && (
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <span className="mr-2">⭐</span>
              Productos Destacados
            </h3>
            <p className="text-gray-600">Nuestros productos más especiales y populares</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {featuredProducts.map((product) => {
              const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
              
              return (
                <div key={product.id} className="bg-white dark:bg-gray-100 rounded-xl overflow-hidden shadow-lg border-2 border-yellow-200 hover:shadow-xl transition-all duration-300 group relative">
                  {/* Badge de Destacado */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      ⭐ Destacado
                    </span>
                  </div>
                  
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    {mainImage ? (
                      <Image
                        src={mainImage.url}
                        alt={mainImage.altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl text-gray-900">📷</span>
                      </div>
                    )}
                    
                    {/* Popularity Badge */}
                    {getPopularityBadge(product) && (
                      <div className="absolute top-4 right-4">
                        {getPopularityBadge(product)}
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute bottom-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center space-x-1">
                        <span>{getCategoryIcon(product.category)}</span>
                        <span>{product.category}</span>
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-pink-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-bold text-pink-600">
                        ${product.price}
                      </span>
                      
                      {/* Popularity Stats */}
                      {product.popularity && (
                        <div className="text-right text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{product.popularity.totalClicks}</span>
                          </div>
                          {product.popularity.popularityScore > 0 && (
                            <div className="flex items-center gap-1">
                              <span>🔥</span>
                              <span>{product.popularity.popularityScore.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Link
                        href={`/products/${product.category}/${product.id}`}
                        className="block w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center text-sm shadow-lg hover:shadow-xl"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        onClick={() => shareOnWhatsApp(product)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm shadow-lg hover:shadow-xl"
                      >
                        <span>📱</span>
                        <span>Comprar por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Productos Populares Regulares */}
      {regularProducts.length > 0 && (
        <div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <span className="mr-2">🔥</span>
              Productos Populares
            </h3>
            <p className="text-gray-600">Otros productos que también te pueden interesar</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {regularProducts.map((product) => {
              const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
              
              return (
                <div key={product.id} className="bg-white dark:bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-300 hover:shadow-md transition-shadow group">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    {mainImage ? (
                      <Image
                        src={mainImage.url}
                        alt={mainImage.altText || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l5ZT0iMTQiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl text-gray-900">📷</span>
                      </div>
                    )}
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {getPopularityBadge(product)}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-700 transition-colors">
                      {product.name}
                    </h3>
                    
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-pink-600">
                        ${product.price}
                      </span>
                      
                      {/* Popularity Stats */}
                      {product.popularity && (
                        <div className="text-right text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <span>👁️</span>
                            <span>{product.popularity.totalClicks}</span>
                          </div>
                          {product.popularity.popularityScore > 0 && (
                            <div className="flex items-center gap-1">
                              <span>🔥</span>
                              <span>{product.popularity.popularityScore.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/products/${product.category}/${product.id}`}
                        className="block w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium py-2 px-4 rounded-md transition-colors text-center text-sm"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        onClick={() => shareOnWhatsApp(product)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2 text-sm"
                      >
                        <span>📱</span>
                        <span>Comprar por WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA para ver más productos */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <span>🛍️</span>
          <span>Ver Todos los Productos</span>
        </Link>
      </div>
    </section>
  );
}