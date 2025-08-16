'use client';

import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  featured: boolean;
  materials: string;
  dimensions: string;
  weight: string;
  careInstructions: string;
  images: ProductImageForm[];
}

interface ProductImageForm {
  url: string;
  altText: string;
}

export default function CreateProductPage() {
  const { session, isLoading, hasAdminAccess } = useUserRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: 'accesorios',
    stock: '0',
    featured: false,
    materials: '',
    dimensions: '',
    weight: '',
    careInstructions: '',
    images: [{ url: '', altText: '' }]
  });

  const categories = [
    { value: 'accesorios', label: 'Accesorios', icon: '🧣' },
    { value: 'bolsos', label: 'Bolsos', icon: '👜' },
    { value: 'juguetes', label: 'Juguetes', icon: '🧸' },
    { value: 'bebe', label: 'Bebé', icon: '👶' },
    { value: 'hogar', label: 'Hogar', icon: '🏠' },
    { value: 'ropa', label: 'Ropa', icon: '👗' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (index: number, field: 'url' | 'altText', value: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const addImage = () => {
    setForm(prev => ({
      ...prev,
      images: [...prev.images, { url: '', altText: '' }]
    }));
  };

  const removeImage = (index: number) => {
    if (form.images.length > 1) {
      setForm(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filtrar imágenes vacías
      const validImages = form.images.filter(img => img.url.trim() !== '');
      
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          images: validImages
        })
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/products');
      } else {
        setError(data.error || 'Error al crear producto');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
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
          <p className="text-gray-600">Cargando...</p>
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
          <p className="text-gray-600">
            Solo los administradores pueden acceder a esta página
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Crear Nuevo Producto ➕
          </h1>
          <p className="text-gray-600">
            Agrega un nuevo producto al catálogo de Solecito Crochet
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg border border-pink-100 shadow-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-pink-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Información Básica
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={form.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                  placeholder="Describe tu producto..."
                />
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-pink-600 shadow-sm focus:border-pink-300 focus:ring focus:ring-pink-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Marcar como producto destacado
                  </span>
                </label>
              </div>
            </div>

            {/* Additional Details */}
            <div className="border-b border-pink-100 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Detalles Adicionales
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-2">
                    Materiales
                  </label>
                  <input
                    type="text"
                    id="materials"
                    name="materials"
                    value={form.materials}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                    placeholder="Ej: Algodón 100%, Lana merino..."
                  />
                </div>

                <div>
                  <label htmlFor="dimensions" className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensiones
                  </label>
                  <input
                    type="text"
                    id="dimensions"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                    placeholder="Ej: 20cm x 15cm x 10cm"
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                    Peso
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={form.weight}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                    placeholder="Ej: 150g"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="careInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Instrucciones de Cuidado
                </label>
                <textarea
                  id="careInstructions"
                  name="careInstructions"
                  value={form.careInstructions}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                  placeholder="Ej: Lavar a mano con agua fría, secar a la sombra..."
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Imágenes del Producto
              </h3>
              
              <div className="space-y-4">
                {form.images.map((image, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-md">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL de Imagen {index + 1} {index === 0 && '(Principal)'}
                      </label>
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                        placeholder="https://ejemplo.com/imagen.jpg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto Alternativo
                      </label>
                      <input
                        type="text"
                        value={image.altText}
                        onChange={(e) => handleImageChange(index, 'altText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                        placeholder="Descripción de la imagen"
                      />
                    </div>

                    {/* Preview */}
                    {image.url && (
                      <div className="w-20 h-20 relative">
                        <Image
                          src={image.url}
                          alt={image.altText || 'Preview'}
                          fill
                          className="object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    {form.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addImage}
                className="mt-4 inline-flex items-center space-x-2 text-pink-600 hover:text-pink-800 font-medium"
              >
                <span>➕</span>
                <span>Agregar otra imagen</span>
              </button>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  </span>
                ) : (
                  'Crear Producto'
                )}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 