'use client';

import { useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { useCategories } from '@/hooks/useCategories';
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
}

interface ImageFile {
  file: File | null;
  altText: string;
  isMain: boolean;
  preview: string;
}

export default function CreateProductPage() {
  const { isLoading, hasAdminAccess } = useUserRole();
  const { categories, loading: categoriesLoading, getSimpleCategories } = useCategories();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '0',
    featured: false,
    materials: '',
    dimensions: '',
    weight: '',
    careInstructions: ''
  });

  // Obtener categorías simplificadas para el formulario
  const simpleCategories = getSimpleCategories();

  // Establecer la primera categoría como valor por defecto cuando se cargan
  if (simpleCategories.length > 0 && !form.category) {
    setForm(prev => ({ ...prev, category: simpleCategories[0].value }));
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setImages(prev => [...prev, {
            file,
            altText: form.name || 'Imagen del producto',
            isMain: prev.length === 0, // Primera imagen es principal
            preview: reader.result as string
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };



  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // Si eliminamos la imagen principal, hacer principal la primera
      if (prev[index]?.isMain && newImages.length > 0) {
        newImages[0].isMain = true;
      }
      return newImages;
    });
  };

  const setMainImage = (index: number) => {
    setImages(prev => prev.map((img, i) => ({
      ...img,
      isMain: i === index
    })));
  };

  const updateImageAltText = (index: number, altText: string) => {
    setImages(prev => prev.map((img, i) => 
      i === index ? { ...img, altText } : img
    ));
  };

  const uploadImages = async (productId: string) => {
    const imageResults = [];
    
    for (const [index, imageData] of images.entries()) {
      if (!imageData.file) continue;
      
      const formData = new FormData();
      formData.append('file', imageData.file);
      formData.append('type', 'product');
      formData.append('productId', productId);
      formData.append('altText', imageData.altText);
      formData.append('isMain', imageData.isMain.toString());
      
      try {
        const response = await fetch('/api/images', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          imageResults.push(result);
        }
      } catch (error) {
        console.error(`Error uploading image ${index}:`, error);
      }
    }
    
    return imageResults;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Crear el producto primero
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...form,
          images: [] // Sin imágenes por ahora
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Si hay imágenes, subirlas
        if (images.length > 0) {
          setUploadingImages(true);
          await uploadImages(data.id);
        }
        
        router.push('/dashboard/products');
      } else {
        setError(data.error || 'Error al crear producto');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  if (isLoading || categoriesLoading) {
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-900">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  // Verificar si hay categorías disponibles
  if (simpleCategories.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <span className="text-6xl mb-4 block">📂</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay categorías disponibles
          </h3>
          <p className="text-gray-900 mb-6">
            Primero necesitas crear al menos una categoría para poder crear productos
          </p>
          <button
            onClick={() => router.push('/dashboard/categories')}
            className="inline-flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            <span>📂</span>
            <span>Ir a Categorías</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Crear Nuevo Producto</h1>
          <p className="text-lg text-gray-600">Completa la información para agregar un nuevo producto a tu catálogo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">📝</span>
                Información Básica
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del Producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Ej: Gorro tejido a mano con diseño floral"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 transition-all duration-200 hover:border-gray-400"
                  >
                    {simpleCategories.length > 0 ? (
                      simpleCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No hay categorías disponibles
                      </option>
                    )}
                  </select>
                  {simpleCategories.length === 0 && (
                    <p className="text-sm text-amber-600">
                      💡 Primero crea una categoría en el dashboard de categorías
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Precio <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Disponible
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Descripción del Producto
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Describe detalladamente tu producto, incluyendo características especiales, colores disponibles, y cualquier detalle importante que los clientes deban saber..."
                />
              </div>

              {/* Checkbox de Producto Destacado */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={form.featured}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all duration-200 ${
                      form.featured 
                        ? 'bg-yellow-500 border-yellow-500' 
                        : 'border-gray-300 group-hover:border-yellow-400'
                    }`}>
                      {form.featured && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-900">Producto Destacado</span>
                    <p className="text-sm text-gray-600 mt-1">
                      Los productos destacados aparecerán en la página principal y tendrán prioridad en las búsquedas. 
                      Ideal para productos especiales, nuevos lanzamientos o favoritos de los clientes.
                    </p>
                    {form.featured && (
                      <div className="mt-2 flex items-center text-yellow-700 text-sm">
                        <span className="mr-2">⭐</span>
                        <span>Este producto aparecerá en la landing page como destacado</span>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Sección de Imágenes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">📸</span>
                Imágenes del Producto
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subir Imágenes
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-6xl mb-4">📁</div>
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Haz clic para seleccionar imágenes
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      PNG, JPG, GIF hasta 10MB. La primera imagen será la imagen principal.
                    </p>
                    <button
                      type="button"
                      className="bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
                    >
                      Seleccionar Imágenes
                    </button>
                  </label>
                </div>
              </div>

              {/* Vista previa de imágenes */}
              {images.length > 0 && (
                <div className="space-y-6">
                  {/* Imagen Principal */}
                  {images.find(img => img.isMain) && (
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-pink-800 mb-4 flex items-center">
                        <span className="mr-2">🌟</span>
                        Imagen Principal
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.filter(img => img.isMain).map((img, index) => (
                          <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
                            <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                              <Image
                                src={img.preview}
                                alt={img.altText}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                Principal
                              </div>
                            </div>
                            
                            <input
                              type="text"
                              value={img.altText}
                              onChange={(e) => updateImageAltText(images.indexOf(img), e.target.value)}
                              placeholder="Texto alternativo para SEO"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            />
                            
                            <button
                              type="button"
                              onClick={() => removeImage(images.indexOf(img))}
                              className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Imágenes Secundarias */}
                  {images.filter(img => !img.isMain).length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                        <span className="mr-2">📷</span>
                        Imágenes Secundarias
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {images.filter(img => !img.isMain).map((img) => {
                          const actualIndex = images.indexOf(img);
                          return (
                            <div key={actualIndex} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                              <div className="relative aspect-square mb-4 rounded-lg overflow-hidden">
                                <Image
                                  src={img.preview}
                                  alt={img.altText}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-2 right-2 bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                  {actualIndex + 1}
                                </div>
                              </div>
                              
                              <input
                                type="text"
                                value={img.altText}
                                onChange={(e) => updateImageAltText(actualIndex, e.target.value)}
                                placeholder="Texto alternativo para SEO"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                              />
                              
                              <div className="flex space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setMainImage(actualIndex)}
                                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                  Hacer Principal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeImage(actualIndex)}
                                  className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                  Eliminar
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Información de ayuda */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-600 text-xl">💡</span>
                      <div>
                        <p className="text-sm font-medium text-blue-800 mb-1">Consejos para las imágenes:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• La primera imagen será la imagen principal del producto</li>
                          <li>• Usa imágenes de alta calidad (mínimo 800x800px)</li>
                          <li>• Incluye diferentes ángulos del producto</li>
                          <li>• Asegúrate de que el texto alternativo sea descriptivo</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <span className="mr-2">ℹ️</span>
                Información Adicional
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Materiales Utilizados
                  </label>
                  <input
                    type="text"
                    name="materials"
                    value={form.materials}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Ej: Lana 100% acrílica, algodón premium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Dimensiones
                  </label>
                  <input
                    type="text"
                    name="dimensions"
                    value={form.dimensions}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Ej: 25cm x 30cm x 5cm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Peso Aproximado
                  </label>
                  <input
                    type="text"
                    name="weight"
                    value={form.weight}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400"
                    placeholder="Ej: 200g, 0.5kg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Instrucciones de Cuidado
                </label>
                <textarea
                  name="careInstructions"
                  value={form.careInstructions}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 resize-none"
                  placeholder="Ej: Lavar a mano con agua fría, no usar secadora, planchar a temperatura baja..."
                />
              </div>
            </div>
          </div>

          {/* Error y Botones */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-red-600 text-xl">⚠️</span>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full sm:w-auto px-8 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg hover:from-pink-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando producto...
                </span>
              ) : uploadingImages ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo imágenes...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="mr-2">✨</span>
                  Crear Producto
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 