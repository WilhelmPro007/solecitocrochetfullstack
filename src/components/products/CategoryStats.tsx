import React, { useState, useEffect } from 'react';

interface CategoryStats {
  overview: {
    totalProducts: number;
    totalCategories: number;
    productsInPeriod: number;
    previousPeriodProducts: number;
    growthRate: number;
    period: string;
  };
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    productCount: number;
    totalValue: number;
    averagePrice: number;
    featuredCount: number;
    featuredPercentage: number;
  }>;
  topCategories: Array<{
    name: string;
    icon: string;
    productCount: number;
    totalValue: number;
  }>;
  expensiveCategories: Array<{
    name: string;
    icon: string;
    averagePrice: number;
    productCount: number;
  }>;
  cheapCategories: Array<{
    name: string;
    icon: string;
    averagePrice: number;
    productCount: number;
  }>;
  featuredByCategory: Array<{
    name: string;
    icon: string;
    featuredCount: number;
  }>;
}

interface CategoryStatsProps {
  period?: 'week' | 'month' | 'year';
}

export default function CategoryStats({ period = 'month' }: CategoryStatsProps) {
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/categories/stats?period=${period}`);
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      } else {
        setError(data.error || 'Error al cargar estadísticas');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: 'NIO'
    }).format(amount);
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case 'week': return 'esta semana';
      case 'year': return 'este año';
      default: return 'este mes';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
          <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="text-gray-900">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalProducts}</p>
            </div>
            <span className="text-3xl">📦</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.totalCategories}</p>
            </div>
            <span className="text-3xl">📂</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos {getPeriodLabel(period)}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.overview.productsInPeriod}</p>
            </div>
            <span className="text-3xl">📅</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Crecimiento</p>
              <p className={`text-2xl font-bold ${
                stats.overview.growthRate > 0 ? 'text-green-600' : 
                stats.overview.growthRate < 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {stats.overview.growthRate > 0 ? '+' : ''}{stats.overview.growthRate}%
              </p>
            </div>
            <span className="text-3xl">
              {stats.overview.growthRate > 0 ? '📈' : 
               stats.overview.growthRate < 0 ? '📉' : '➡️'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Top Categorías por Productos
          </h3>
          <div className="space-y-3">
            {stats.topCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.productCount} productos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.totalValue)}
                  </p>
                  <p className="text-xs text-gray-500">Valor total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💎</span>
            Categorías con Productos Más Caros
          </h3>
          <div className="space-y-3">
            {stats.expensiveCategories.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.productCount} productos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.averagePrice)}
                  </p>
                  <p className="text-xs text-gray-500">Precio promedio</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productos Destacados por Categoría */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">⭐</span>
          Productos Destacados por Categoría
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.featuredByCategory.map((category) => (
            <div key={category.name} className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{category.icon}</span>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{category.featuredCount}</p>
                <p className="text-sm text-gray-600">productos destacados</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla Detallada de Categorías */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-pink-500 to-rose-500">
          <h3 className="text-lg font-semibold text-white">Análisis Detallado por Categoría</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Productos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Promedio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destacados
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Destacados
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500 font-mono">{category.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {category.productCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(category.averagePrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {category.featuredCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {category.featuredPercentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 