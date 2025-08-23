'use client';

import { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';

import Image from 'next/image';

interface CategoryImage {
  id: string;
  name: string;
  altText: string | null;
  order: number;
  imageUrl: string;
  isActive: boolean;
}

export default function CategoriesManagementPage() {
  const { isLoading, hasAdminAccess } = useUserRole();
  const [categories, setCategories] = useState<CategoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  useEffect(() => {
    if (hasAdminAccess) {
      fetchCategories();
    }
  }, [hasAdminAccess]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories/images');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (categoryName: string, file: File) => {
    if (!file) return;

    setUploadingFile(categoryName);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'category');
      formData.append('categoryName', categoryName);
      formData.append('altText', categoryName);

      const response = await fetch('/api/images', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchCategories(); // Refrescar la lista
        alert('Imagen subida exitosamente');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploadingFile(null);
    }
  };

  const predefinedCategories = [
    { name: 'amigurumis', displayName: 'Amigurumis' },
    { name: 'mantas', displayName: 'Mantas' },
    { name: 'bolsos', displayName: 'Bolsos' },
    { name: 'toallas', displayName: 'Toallas' },
    { name: 'accesorios', displayName: 'Accesorios' },
    { name: 'ropa', displayName: 'Ropa' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestión de Categorías</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Imágenes de Categorías</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {predefinedCategories.map((category) => {
                  const existingCategory = categories.find(c => c.name === category.name);
                  
                  return (
                    <div key={category.name} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-3">{category.displayName}</h3>
                      
                      {/* Vista previa de la imagen */}
                      <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        {existingCategory ? (
                          <Image
                            src={existingCategory.imageUrl}
                            alt={existingCategory.altText || category.displayName}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2Y5ZmJmZiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5Y2E5YjIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5TaW4gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4=';
                            }}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-4xl">📷</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Input para subir imagen */}
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(category.name, file);
                            }
                          }}
                          disabled={uploadingFile === category.name}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
                        />
                        
                        {uploadingFile === category.name && (
                          <div className="flex items-center text-sm text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2"></div>
                            Subiendo imagen...
                          </div>
                        )}
                        
                        {existingCategory && (
                          <p className="text-sm text-green-600">
                            ✓ Imagen configurada
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    </div>
  );
} 