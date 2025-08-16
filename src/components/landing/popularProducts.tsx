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
}

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
  order: number;
}

export default function PopularProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts();
  }, []);

  const fetchPopularProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=6');
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

  if (loading) {
  return (
      <section id="productos" className="px-6 pb-24">
        <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-300 animate-pulse">
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
        <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🎀</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Próximamente productos destacados
          </h3>
          <p className="text-gray-900 mb-6">
            Estamos preparando una hermosa selección de productos para ti
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            <span>🛍️</span>
            <span>Ver Todos los Productos</span>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="px-6 pb-24">
      <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => {
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
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl text-gray-900">📷</span>
                  </div>
                )}
                
                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                      ⭐ Destacado
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-sm text-gray-900 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-pink-600 dark:text-pink-700">
                    ${product.price}
                  </span>
                  <span className="text-xs text-gray-900 capitalize">
                    {product.category}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link
                    href={`/products/${product.category}/${product.id}`}
                    className="block w-full text-center bg-pink-100 hover:bg-pink-200 text-pink-700 dark:text-pink-800 text-sm font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Ver Detalles
                  </Link>
                  <button
                    onClick={() => shareOnWhatsApp(product)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
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

      {/* View All Products Button */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
        >
          <span>🛍️</span>
          <span>Ver Todos los Productos</span>
        </Link>
      </div>
    </section>
  );
}