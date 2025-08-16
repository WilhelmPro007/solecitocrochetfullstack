'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// app/products/page.tsx

export default function ProductsPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    category: string;
    stock: number;
    isActive: boolean;
    featured: boolean;
    images: ProductImage[];
  }

  interface ProductImage {
    id: string;
    url: string;
    altText?: string;
    isMain: boolean;
    order: number;
  }

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('active', 'true'); // Solo productos activos
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      
      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Error fetching products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', name: 'Todos', icon: '🌸' },
    { id: 'accesorios', name: 'Accesorios', icon: '🧣' },
    { id: 'bolsos', name: 'Bolsos', icon: '👜' },
    { id: 'juguetes', name: 'Juguetes', icon: '🧸' },
    { id: 'bebe', name: 'Bebé', icon: '👶' },
    { id: 'hogar', name: 'Hogar', icon: '🏠' },
  ];



  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const shareOnWhatsApp = (product: typeof products[0]) => {
    const message = `¡Hola! Me interesa este producto de Solecito Crochet:\n\n🎀 ${product.name}\n💰 ${product.price}\n📝 ${product.description}\n\n¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestro Catálogo 🎀
          </h1>
          <p className="text-gray-900 text-lg max-w-2xl mx-auto">
            Descubre nuestra hermosa colección de productos tejidos a mano con amor y dedicación
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-pink-400 text-white shadow-md'
                    : 'bg-white text-gray-900 hover:bg-pink-50 hover:text-pink-600 border border-pink-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-pink-100 shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-gray-200 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
              
              return (
                <div key={product.id} className="bg-white rounded-lg border border-pink-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="relative aspect-square">
                    {mainImage ? (
                      <Image 
                        src={mainImage.url} 
                        alt={mainImage.altText || product.name} 
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-4xl text-gray-900">📷</span>
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                      title={favorites.includes(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <span className="text-lg">
                        {favorites.includes(product.id) ? '💖' : '🤍'}
                      </span>
                    </button>

                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          ⭐ Destacado
                        </span>
                      </div>
                    )}

                    {/* Stock Badge */}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Agotado
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-900 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-pink-600">
                        ${product.price}
                      </span>
                      <span className="text-xs text-gray-900">
                        Stock: {product.stock}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/products/${product.category}/${product.id}`}
                        className="block w-full bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium py-2 px-4 rounded-md transition-colors text-center"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        onClick={() => shareOnWhatsApp(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>📱</span>
                        <span>{product.stock === 0 ? 'Sin Stock' : 'Comprar por WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎀</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay productos en esta categoría
            </h3>
            <p className="text-gray-900">
              Prueba seleccionando una categoría diferente
            </p>
            </div>
        )}

        {/* Favorites Count */}
        {favorites.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg">
            <Link href="/favorites" className="flex items-center space-x-2">
              <span>💖</span>
              <span>{favorites.length} favoritos</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}