'use client';

import Link from 'next/link';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mis Favoritos 💖
          </h1>
          <p className="text-gray-900 text-lg max-w-2xl mx-auto">
            Aquí encontrarás todos los productos que has marcado como favoritos
          </p>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🎀</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aún no tienes favoritos
          </h3>
          <p className="text-gray-900 mb-6">
            Explora nuestro catálogo y guarda los productos que más te gusten
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            <span>🛍️</span>
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 