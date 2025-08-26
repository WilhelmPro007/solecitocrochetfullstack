'use client';

import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useProducts, Product } from '@/hooks/useProducts';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import ConfirmationModal from '@/components/products/ConfirmationModal';

// Las interfaces están definidas en el hook useProducts

export default function ProductsManagementPage() {
  const { isLoading, hasAdminAccess } = useUserRole();
  const [filter, setFilter] = useState('all');
  const [success, setSuccess] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deactivateAction, setDeactivateAction] = useState<'activate' | 'deactivate'>('deactivate');
  
  const { products, loading, error, fetchProducts, updateProductStatus } = useProducts(filter);

  const openDeactivateModal = (product: Product, action: 'activate' | 'deactivate') => {
    setSelectedProduct(product);
    setDeactivateAction(action);
    setShowDeactivateModal(true);
  };

  const closeDeactivateModal = () => {
    setShowDeactivateModal(false);
    setSelectedProduct(null);
  };

  const confirmToggleActive = async () => {
    if (!selectedProduct) return;
    
    try {
      await updateProductStatus(selectedProduct.id, !selectedProduct.isActive);
      setSuccess(`Producto ${selectedProduct.isActive ? 'desactivado' : 'activado'} exitosamente`);
      setTimeout(() => setSuccess(''), 3000);
      closeDeactivateModal();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-900">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <span className="text-6xl mb-4 block">🔒</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Acceso Denegado
          </h3>
          <p className="text-gray-900">
            Solo los administradores pueden acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestión de Productos 🛍️
            </h1>
            <p className="text-gray-900">
              Administra el catálogo de productos de Solecito Crochet
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <button
              onClick={() => {
                if (!Array.isArray(products)) return;
                const inactiveProducts = products.filter(p => !p.isActive);
                if (inactiveProducts.length > 0) {
                  // Mostrar modal para activar productos inactivos
                  setSelectedProduct(inactiveProducts[0]);
                  setDeactivateAction('activate');
                  setShowDeactivateModal(true);
                }
              }}
              disabled={!Array.isArray(products) || products.filter(p => !p.isActive).length === 0}
              className="inline-flex items-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
              title={!Array.isArray(products) || products.filter(p => !p.isActive).length === 0 ? 'No hay productos inactivos' : 'Activar productos inactivos'}
            >
              <span>✅</span>
              <span>Activar Inactivos ({Array.isArray(products) ? products.filter(p => !p.isActive).length : 0})</span>
            </button>
            <Link
              href="/dashboard/products/create"
              className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              <span>➕</span>
              <span>Nuevo Producto</span>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'all', name: 'Todos', icon: '🌸' },
              { id: 'true', name: 'Activos', icon: '✅' },
              { id: 'false', name: 'Inactivos', icon: '❌' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-pink-400 text-white shadow-md'
                    : 'bg-white text-gray-900 hover:bg-pink-50 hover:text-pink-600 border border-pink-200'
                }`}
              >
                <span>{filterOption.icon}</span>
                <span>{filterOption.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
              <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-900">Cargando productos...</p>
          </div>
        ) : !Array.isArray(products) ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">⚠️</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Error en los datos
            </h3>
            <p className="text-gray-900 mb-6">
              Los productos no se cargaron correctamente
            </p>
            <button
              onClick={fetchProducts}
              className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              <span>🔄</span>
              <span>Reintentar</span>
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl mb-4 block">📦</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay productos
            </h3>
            <p className="text-gray-900 mb-6">
              Comienza creando tu primer producto
            </p>
            <Link
              href="/dashboard/products/create"
              className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-md transition-colors"
            >
              <span>➕</span>
              <span>Crear Producto</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(products) && products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                variant="dashboard"
                onEdit={(id) => window.location.href = `/dashboard/products/edit/${id}`}
                onToggleActive={(id, status) => openDeactivateModal(product, status ? 'deactivate' : 'activate')}
                isActive={product.isActive}
              />
            ))}
          </div>
        )}

        {/* Modal de Confirmación */}
        <ConfirmationModal
          isOpen={showDeactivateModal}
          onClose={closeDeactivateModal}
          onConfirm={confirmToggleActive}
          title={
            deactivateAction === 'deactivate' 
              ? 'Desactivar Producto' 
              : 'Activar Producto'
          }
          message={
            deactivateAction === 'deactivate'
              ? `¿Estás seguro de que quieres desactivar "${selectedProduct?.name}"? Este producto no será visible para los clientes.`
              : `¿Estás seguro de que quieres activar "${selectedProduct?.name}"? Este producto será visible para los clientes.`
          }
          confirmText={
            deactivateAction === 'deactivate' ? 'Desactivar' : 'Activar'
          }
          cancelText="Cancelar"
          type={deactivateAction === 'deactivate' ? 'warning' : 'info'}
        />
    </>
  );
} 