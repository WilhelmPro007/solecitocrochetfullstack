'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';

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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="catalog"
                onFavoriteToggle={toggleFavorite}
                isFavorite={favorites.includes(product.id)}
              />
            ))}
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