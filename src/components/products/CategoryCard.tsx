import React from 'react';
import { Category } from '@/hooks/useCategories';

interface CategoryCardProps {
  category: Category;
  variant?: 'dashboard' | 'landing';
  onEdit?: (category: Category) => void;
  onDelete?: (category: Category) => void;
  onViewProducts?: (category: Category) => void;
}

export default function CategoryCard({ 
  category, 
  variant = 'dashboard',
  onEdit,
  onDelete,
  onViewProducts
}: CategoryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-NI', {
      style: 'currency',
      currency: 'NIO'
    }).format(amount);
  };

  if (variant === 'landing') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 group">
        <div className="p-6 text-center">
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
            {category.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 mb-4">
              {category.description}
            </p>
          )}
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <span className="mr-1">📦</span>
              {category.productCount} producto{category.productCount !== 1 ? 's' : ''}
            </span>
            {category.totalValue && category.totalValue > 0 && (
              <span className="flex items-center">
                <span className="mr-1">💰</span>
                {formatCurrency(category.totalValue)}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header con icono y estado */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 font-mono">
                {category.slug}
              </p>
              {category.isCustom && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  ✨ Personalizada
                </span>
              )}
            </div>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            category.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {category.isActive ? '✅ Activa' : '❌ Inactiva'}
          </span>
        </div>
        
        {category.description && (
          <p className="text-sm text-gray-600 mb-4">
            {category.description}
          </p>
        )}
      </div>

      {/* Estadísticas */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {category.productCount}
            </div>
            <div className="text-xs text-gray-500">
              Productos
            </div>
          </div>
          {category.totalValue && category.totalValue > 0 ? (
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(category.totalValue)}
              </div>
              <div className="text-xs text-gray-500">
                Valor Total
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-400">
                -
              </div>
              <div className="text-xs text-gray-500">
                Sin Productos
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="px-6 py-4 bg-white">
        <div className="flex space-x-2">
          {onViewProducts && (
            <button
              onClick={() => onViewProducts(category)}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-1">👁️</span>
              Ver Productos
            </button>
          )}
          
          {onEdit && (
            <button
              onClick={() => onEdit(category)}
              className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-1">✏️</span>
              Editar
            </button>
          )}
          
          {onDelete && (
            <button
              onClick={() => onDelete(category)}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center"
            >
              <span className="mr-1">🗑️</span>
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Footer con fechas */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Creada: {new Date(category.createdAt).toLocaleDateString('es-NI')}</span>
          <span>Actualizada: {new Date(category.updatedAt).toLocaleDateString('es-NI')}</span>
        </div>
      </div>
    </div>
  );
} 