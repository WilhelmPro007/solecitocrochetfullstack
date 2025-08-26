'use client';

import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useCategories, Category, CategoryFormData } from '@/hooks/useCategories';
import CategoryCard from '@/components/products/CategoryCard';
import CategoryForm from '@/components/products/CategoryForm';
import CategoryConfirmationModal from '@/components/products/CategoryConfirmationModal';
import CategoryStats from '@/components/products/CategoryStats';

export default function CategoriesManagementPage() {
  const { isLoading, hasAdminAccess } = useUserRole();
  const { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategories();

  // Estados del formulario
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados del modal de confirmación
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [categoryToAction, setCategoryToAction] = useState<Category | null>(null);
  const [actionType, setActionType] = useState<'delete' | 'deactivate' | 'activate'>('delete');

  // Estados de feedback
  const [success, setSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Estados de vista
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'year'>('month');

  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      setIsSubmitting(true);
      setFormError('');
      
      const result = await createCategory(data);
      if (result) {
        setSuccess('Categoría creada exitosamente');
        setShowForm(false);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setFormError('Error al crear la categoría');
      }
    } catch (error) {
      setFormError('Error al crear la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    
    try {
      setIsSubmitting(true);
      setFormError('');
      
      const result = await updateCategory(editingCategory.slug, data);
      if (result) {
        setSuccess('Categoría actualizada exitosamente');
        setShowForm(false);
        resetForm();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setFormError('Error al actualizar la categoría');
      }
    } catch (error) {
      setFormError('Error al actualizar la categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToAction(category);
    setActionType('delete');
    setShowConfirmationModal(true);
  };

  const handleConfirmAction = async () => {
    if (!categoryToAction) return;

    try {
      let success = false;
      
      switch (actionType) {
        case 'delete':
          success = await deleteCategory(categoryToAction.slug);
          if (success) {
            setSuccess('Categoría eliminada exitosamente');
          }
          break;
        // Aquí se pueden agregar más acciones en el futuro
      }

      if (success) {
        setShowConfirmationModal(false);
        setCategoryToAction(null);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const resetForm = () => {
    setEditingCategory(null);
    setFormError('');
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
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
            Gestión de Categorías 📂
          </h1>
          <p className="text-gray-900">
            Administra las categorías de productos de Solecito Crochet
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <button
            onClick={openCreateForm}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <span>➕</span>
            <span>Nueva Categoría</span>
          </button>
        </div>
      </div>

      {/* Formulario de categoría */}
      {showForm && (
        <div className="mb-8">
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
            onCancel={closeForm}
            isSubmitting={isSubmitting}
          />
        </div>
      )}

      {/* Mensajes de feedback */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center space-x-2">
            <span>✅</span>
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center space-x-2">
            <span>❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center space-x-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        </div>
      )}

      {/* Selector de vista */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">📋</span>
              Lista de Categorías
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === 'stats'
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
              }`}
            >
              <span className="mr-2">📊</span>
              Estadísticas
            </button>
          </div>

          {viewMode === 'stats' && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Período:</span>
              <select
                value={statsPeriod}
                onChange={(e) => setStatsPeriod(e.target.value as 'week' | 'month' | 'year')}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="year">Este Año</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Contenido según la vista seleccionada */}
      {viewMode === 'list' ? (
        /* Vista de lista de categorías */
        <>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
                <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-900">Cargando categorías...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📂</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay categorías creadas
              </h3>
              <p className="text-gray-900 mb-6">
                Crea tu primera categoría para organizar los productos
              </p>
              <button
                onClick={openCreateForm}
                className="inline-flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                <span>➕</span>
                <span>Crear Primera Categoría</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  variant="dashboard"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        /* Vista de estadísticas */
        <CategoryStats period={statsPeriod} />
      )}

      {/* Modal de confirmación */}
      <CategoryConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          setCategoryToAction(null);
        }}
        onConfirm={handleConfirmAction}
        category={categoryToAction}
        action={actionType}
      />
    </>
  );
} 