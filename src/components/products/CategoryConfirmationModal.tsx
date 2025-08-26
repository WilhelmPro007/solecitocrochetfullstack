import React from 'react';
import { Category } from '@/hooks/useCategories';

interface CategoryConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category: Category | null;
  action: 'delete' | 'deactivate' | 'activate';
}

export default function CategoryConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  category,
  action
}: CategoryConfirmationModalProps) {
  if (!isOpen || !category) return null;

  const getActionConfig = () => {
    switch (action) {
      case 'delete':
        return {
          title: 'Eliminar Categoría',
          message: `¿Estás seguro de que quieres eliminar la categoría "${category.name}"?`,
          warning: category.productCount > 0 
            ? `⚠️ Esta categoría tiene ${category.productCount} producto(s) activo(s). No se puede eliminar hasta que se muevan o desactiven todos los productos.`
            : '⚠️ Esta acción no se puede deshacer.',
          confirmText: 'Eliminar Categoría',
          confirmColor: 'bg-red-600 hover:bg-red-700',
          icon: '🗑️'
        };
      case 'deactivate':
        return {
          title: 'Desactivar Categoría',
          message: `¿Estás seguro de que quieres desactivar la categoría "${category.name}"?`,
          warning: 'Los productos de esta categoría no serán visibles para los clientes.',
          confirmText: 'Desactivar',
          confirmColor: 'bg-yellow-600 hover:bg-yellow-700',
          icon: '⏸️'
        };
      case 'activate':
        return {
          title: 'Activar Categoría',
          message: `¿Estás seguro de que quieres activar la categoría "${category.name}"?`,
          warning: 'Los productos de esta categoría serán visibles para los clientes.',
          confirmText: 'Activar',
          confirmColor: 'bg-green-600 hover:bg-green-700',
          icon: '▶️'
        };
      default:
        return {
          title: 'Confirmar Acción',
          message: '¿Estás seguro de que quieres realizar esta acción?',
          warning: '',
          confirmText: 'Confirmar',
          confirmColor: 'bg-blue-600 hover:bg-blue-700',
          icon: '❓'
        };
    }
  };

  const config = getActionConfig();

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{config.icon}</span>
              <h2 className="text-xl font-semibold text-gray-900">
                {config.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                {config.message}
              </p>
              
              {/* Información de la categoría */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500 font-mono">{category.slug}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Productos:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {category.productCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Estado:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      category.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {category.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Advertencia */}
              {config.warning && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {config.warning}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-colors ${config.confirmColor}`}
                disabled={action === 'delete' && category.productCount > 0}
              >
                {config.confirmText}
              </button>
            </div>

            {/* Mensaje adicional para eliminación */}
            {action === 'delete' && category.productCount > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 text-center">
                  💡 Primero mueve o desactiva todos los productos de esta categoría
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 