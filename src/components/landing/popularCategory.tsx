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
}

export default function PopularCategory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Obtener productos destacados o populares
        const response = await fetch('/api/products?featured=true');
        if (response.ok) {
          const data = await response.json();
          // Tomar solo los primeros 4 productos
          setProducts(data.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section id="categorias" className="px-6 pb-24 bg-pink-50 dark:bg-pink-100">
        <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="relative group">
              <div className="w-full h-40 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="categorias" className="px-6 pb-24 bg-pink-50 dark:bg-pink-100">
        <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
        <div className="max-w-5xl mx-auto text-center py-16">
          <div className="text-6xl mb-4">🛍️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No hay productos disponibles aún
          </h3>
          <p className="text-gray-600">
            Estamos trabajando para traerte los mejores productos hechos a mano. 
            ¡Vuelve pronto!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="categorias" className="px-6 pb-24 bg-pink-50 dark:bg-pink-100">
      <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {products.map((product) => {
          const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
          
          return (
            <Link 
              key={product.id} 
              href={`/products/${product.category}/${product.id}`}
              className="relative group block"
            >
              <div className="relative aspect-square overflow-hidden rounded-md">
                {mainImage ? (
                  <Image
                    src={mainImage.url}
                    alt={mainImage.altText || product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5OX77iPPC90ZXh0PgogIDx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-4xl text-gray-900">📷</span>
                  </div>
                )}
                
                {/* Overlay con información del producto */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <div className="text-white">
                    <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                    <p className="text-xs opacity-90">{product.category}</p>
                    <p className="font-bold text-sm">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}