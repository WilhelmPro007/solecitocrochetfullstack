import { useState, useEffect, useCallback } from 'react';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  isActive: boolean;
  isCustom: boolean;
  productCount: number;
  totalValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  icon: string;
  description: string;
  isActive: boolean;
}

// Interfaz simplificada para formularios
export interface SimpleCategory {
  value: string;
  label: string;
  icon: string;
  color: string;
}

interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string;
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryFormData) => Promise<Category | null>;
  updateCategory: (slug: string, data: CategoryFormData) => Promise<Category | null>;
  deleteCategory: (slug: string) => Promise<boolean>;
  getCategoryBySlug: (slug: string) => Promise<Category | null>;
  getSimpleCategories: () => SimpleCategory[];
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/categories');
      const data = await response.json();
      
      if (response.ok) {
        setCategories(data.categories || []);
      } else {
        setError(data.error || 'Error al cargar categorías');
        setCategories([]);
      }
    } catch (error) {
      console.error('Error en fetchCategories:', error);
      setError('Error de conexión');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CategoryFormData): Promise<Category | null> => {
    try {
      setError('');
      
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Actualizar la lista de categorías
        await fetchCategories();
        return result.category;
      } else {
        setError(result.error || 'Error al crear categoría');
        return null;
      }
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Error de conexión');
      return null;
    }
  }, [fetchCategories]);

  const updateCategory = useCallback(async (slug: string, data: CategoryFormData): Promise<Category | null> => {
    try {
      setError('');
      
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        // Actualizar la lista de categorías
        await fetchCategories();
        return result.category;
      } else {
        setError(result.error || 'Error al actualizar categoría');
        return null;
      }
    } catch (error) {
      console.error('Error updating category:', error);
      setError('Error de conexión');
      return null;
    }
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (slug: string): Promise<boolean> => {
    try {
      setError('');
      
      const response = await fetch(`/api/categories/${slug}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        // Actualizar la lista de categorías
        await fetchCategories();
        return true;
      } else {
        setError(result.error || 'Error al eliminar categoría');
        return false;
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Error de conexión');
      return false;
    }
  }, [fetchCategories]);

  const getCategoryBySlug = useCallback(async (slug: string): Promise<Category | null> => {
    try {
      const response = await fetch(`/api/categories/${slug}`);
      const data = await response.json();
      
      if (response.ok) {
        return data.category;
      } else {
        setError(data.error || 'Error al obtener categoría');
        return null;
      }
    } catch (error) {
      console.error('Error getting category:', error);
      setError('Error de conexión');
      return null;
    }
  }, []);

  // Función para obtener categorías en formato simplificado para formularios
  const getSimpleCategories = useCallback((): SimpleCategory[] => {
    const colorClasses = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-yellow-100 text-yellow-800',
      'bg-pink-100 text-pink-800',
      'bg-green-100 text-green-800',
      'bg-red-100 text-red-800',
      'bg-indigo-100 text-indigo-800',
      'bg-orange-100 text-orange-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800',
      'bg-rose-100 text-rose-800',
      'bg-amber-100 text-amber-800'
    ];

    return categories.map((category, index) => ({
      value: category.slug,
      label: category.name,
      icon: category.icon,
      color: colorClasses[index % colorClasses.length]
    }));
  }, [categories]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug,
    getSimpleCategories
  };
} 