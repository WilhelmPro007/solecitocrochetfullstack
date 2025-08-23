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
}

interface ImageFile {
  file: File | null;
  altText: string;
  isMain: boolean;
  preview: string;
}

export default function CreateProductPage() {
  const { isLoading, hasAdminAccess } = useUserRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
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
    careInstructions: ''
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h1>
          <p className="text-gray-900">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Crear Nuevo Producto</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-pink-600">Información Básica</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
                placeholder="Ej: Gorro tejido a mano"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Categoría *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Precio *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
              placeholder="Describe tu producto..."
            />
          </div>

          <div className="mt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-900">Producto destacado</span>
            </label>
          </div>
        </div>

        {/* Sección de Imágenes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-pink-600">Imágenes del Producto</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Subir Imágenes
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
            />
            <p className="text-sm text-gray-700 mt-1">
              Puedes subir múltiples imágenes. La primera será la imagen principal.
            </p>
          </div>

          {/* Vista previa de imágenes */}
          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((img, index) => (
                <div key={index} className="relative border border-gray-200 rounded-lg p-4">
                  <div className="relative aspect-square mb-3">
                    <Image
                      src={img.preview}
                      alt={img.altText}
                      fill
                      className="object-cover rounded-md"
                    />
                    {img.isMain && (
                      <div className="absolute top-2 left-2 bg-pink-600 text-white px-2 py-1 rounded text-xs font-medium">
                        Principal
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    value={img.altText}
                    onChange={(e) => updateImageAltText(index, e.target.value)}
                    placeholder="Texto alternativo"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-2 text-gray-900 placeholder-gray-600"
                  />
                  
                  <div className="flex space-x-2">
                    {!img.isMain && (
                      <button
                        type="button"
                        onClick={() => setMainImage(index)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                      >
                        Hacer principal
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6 text-pink-600">Información Adicional</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Materiales
              </label>
              <input
                type="text"
                name="materials"
                value={form.materials}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
                placeholder="Ej: Lana, algodón, acrílico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Dimensiones
              </label>
              <input
                type="text"
                name="dimensions"
                value={form.dimensions}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
                placeholder="Ej: 25cm x 30cm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Peso
              </label>
              <input
                type="text"
                name="weight"
                value={form.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
                placeholder="Ej: 200g"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Instrucciones de Cuidado
            </label>
            <textarea
              name="careInstructions"
              value={form.careInstructions}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-600"
              placeholder="Ej: Lavar a mano con agua fría..."
            />
          </div>
        </div>

        {/* Error y Botones */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creando producto...' : uploadingImages ? 'Subiendo imágenes...' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
} 