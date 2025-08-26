import React, { useState, useEffect } from 'react';
import { Category, CategoryFormData } from '@/hooks/useCategories';

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function CategoryForm({
  category,
  onSubmit,
  onCancel,
  isSubmitting = false
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    icon: '🎀',
    description: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Partial<CategoryFormData>>({});

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description || '',
        isActive: category.isActive
      });
    }
  }, [category]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo
    if (errors[name as keyof CategoryFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    
    setFormData(prev => ({
      ...prev,
      name,
      slug
    }));

    // Limpiar errores
    if (errors.name || errors.slug) {
      setErrors(prev => ({
        ...prev,
        name: undefined,
        slug: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CategoryFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'El slug es requerido';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
    }

    if (!formData.icon) {
      newErrors.icon = 'El icono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const iconOptions = [
    '🎀', '🧣', '👜', '🧸', '👶', '🏠', '👗', '🐰', '🛏️', '🧺', '🏺', '🪑', '🟫',
    '🌸', '🌺', '🌷', '🌹', '🌻', '🌼', '💐', '🎁', '🎈', '🎉', '✨', '💎', '🔮',
    '🦄', '🌈', '⭐', '🌟', '💫', '🔥', '💧', '🌍', '🌙', '☀️', '🍀', '🌿', '🌱'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <span className="mr-2">📝</span>
          {category ? 'Editar Categoría' : 'Crear Nueva Categoría'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la Categoría <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 ${
                errors.name ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Ej: Accesorios para Bebé"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 ${
                errors.slug ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="ej-accesorios-bebe"
            />
            {errors.slug && (
              <p className="text-sm text-red-600">{errors.slug}</p>
            )}
            <p className="text-xs text-gray-500">
              El slug se genera automáticamente desde el nombre
            </p>
          </div>

          {/* Icono */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Icono <span className="text-red-500">*</span>
            </label>
            <select
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 transition-all duration-200 ${
                errors.icon ? 'border-red-300' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {iconOptions.map((icon) => (
                <option key={icon} value={icon}>
                  {icon} {icon === formData.icon ? 'Seleccionado' : ''}
                </option>
              ))}
            </select>
            {errors.icon && (
              <p className="text-sm text-red-600">{errors.icon}</p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Estado
            </label>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-sm text-gray-700">
                {formData.isActive ? '✅ Activa' : '❌ Inactiva'}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Las categorías inactivas no serán visibles para los clientes
            </p>
          </div>
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 hover:border-gray-400 resize-none"
            placeholder="Describe la categoría para ayudar a los clientes a entender qué productos incluye..."
          />
          <p className="text-xs text-gray-500">
            Opcional: Ayuda a los clientes a entender mejor la categoría
          </p>
        </div>

        {/* Vista previa */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
            <span className="mr-2">👁️</span>
            Vista Previa
          </h3>
          <div className="bg-white rounded-lg p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{formData.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{formData.name || 'Nombre de la categoría'}</h4>
                <p className="text-sm text-gray-500 font-mono">{formData.slug || 'slug-de-la-categoria'}</p>
                {formData.description && (
                  <p className="text-sm text-gray-600 mt-1">{formData.description}</p>
                )}
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                  ✨ Categoría Personalizada
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Información sobre categorías personalizadas */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-green-800 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Información sobre Categorías Personalizadas
          </h3>
          <div className="text-sm text-green-700 space-y-2">
            <p>• Las categorías personalizadas se guardan en la base de datos</p>
            <p>• Puedes editarlas y eliminarlas desde el dashboard</p>
            <p>• Los productos pueden ser asignados a estas categorías</p>
            <p>• Las categorías predefinidas no se pueden modificar</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {category ? 'Actualizando...' : 'Creando...'}
              </span>
            ) : (
              <span className="flex items-center">
                <span className="mr-2">✨</span>
                {category ? 'Actualizar Categoría' : 'Crear Categoría'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 