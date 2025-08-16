'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// app/products/page.tsx

export default function ProductsPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const products = [
    { 
      id: '1', 
      name: 'Bufanda de lana fina', 
      price: '$35.00', 
      image: '/scarf.jpg',
      category: 'accesorios',
      description: 'Suave bufanda tejida a mano con lana de alta calidad'
    },
    { 
      id: '2', 
      name: 'Bolso tejido bohemio', 
      price: '$45.00', 
      image: '/handbag.jpg',
      category: 'bolsos',
      description: 'Elegante bolso con diseño bohemio perfecto para cualquier ocasión'
    },
    { 
      id: '3', 
      name: 'Amigurumi unicornio', 
      price: '$25.00', 
      image: '/unicorn.jpg',
      category: 'juguetes',
      description: 'Adorable unicornio tejido, perfecto como regalo o decoración'
    },
    { 
      id: '4', 
      name: 'Gorro de invierno', 
      price: '$30.00', 
      image: '/hat.jpg',
      category: 'accesorios',
      description: 'Cálido gorro tejido ideal para los días fríos'
    },
    { 
      id: '5', 
      name: 'Manta para bebé', 
      price: '$55.00', 
      image: '/baby-blanket.jpg',
      category: 'bebe',
      description: 'Suave manta tejida especialmente para los más pequeños'
    },
    { 
      id: '6', 
      name: 'Posavasos florales', 
      price: '$18.00', 
      image: '/coasters.jpg',
      category: 'hogar',
      description: 'Set de 4 posavasos con hermosos diseños florales'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todos', icon: '🌸' },
    { id: 'accesorios', name: 'Accesorios', icon: '🧣' },
    { id: 'bolsos', name: 'Bolsos', icon: '👜' },
    { id: 'juguetes', name: 'Juguetes', icon: '🧸' },
    { id: 'bebe', name: 'Bebé', icon: '👶' },
    { id: 'hogar', name: 'Hogar', icon: '🏠' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
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
                    : 'bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-600 border border-pink-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-pink-100 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              {/* Product Image */}
              <div className="relative aspect-square">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                  }}
                />
                
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
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-pink-600">
                    {product.price}
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
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>📱</span>
                    <span>Comprar por WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">🎀</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay productos en esta categoría
            </h3>
            <p className="text-gray-600">
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