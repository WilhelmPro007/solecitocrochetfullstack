// Configuración centralizada de categorías predefinidas
export interface CategoryConfig {
  name: string;
  icon: string;
  description: string;
}

export const PREDEFINED_CATEGORIES: { [key: string]: CategoryConfig } = {
  'accesorios': { 
    name: 'Accesorios', 
    icon: '🧣', 
    description: 'Gorros, bufandas, guantes y otros accesorios tejidos' 
  },
  'bolsos': { 
    name: 'Bolsos', 
    icon: '👜', 
    description: 'Bolsos, mochilas y carteras tejidas a mano' 
  },
  'juguetes': { 
    name: 'Juguetes', 
    icon: '🧸', 
    description: 'Juguetes tejidos y amigurumis para niños' 
  },
  'bebe': { 
    name: 'Bebé', 
    icon: '👶', 
    description: 'Ropa y accesorios especiales para bebés' 
  },
  'hogar': { 
    name: 'Hogar', 
    icon: '🏠', 
    description: 'Elementos decorativos y útiles para el hogar' 
  },
  'ropa': { 
    name: 'Ropa', 
    icon: '👗', 
    description: 'Prendas de vestir tejidas a mano' 
  },
  'amigurumis': { 
    name: 'Amigurumis', 
    icon: '🐰', 
    description: 'Muñecos tejidos con técnica amigurumi' 
  },
  'mantas': { 
    name: 'Mantas', 
    icon: '🛏️', 
    description: 'Mantas y cobijas tejidas a mano' 
  },
  'toallas': { 
    name: 'Toallas', 
    icon: '🧺', 
    description: 'Toallas y paños de cocina tejidos' 
  },
  'decoracion': { 
    name: 'Decoración', 
    icon: '🏺', 
    description: 'Elementos decorativos para el hogar' 
  },
  'cojines': { 
    name: 'Cojines', 
    icon: '🪑', 
    description: 'Cojines y almohadones tejidos' 
  },
  'alfombras': { 
    name: 'Alfombras', 
    icon: '🟫', 
    description: 'Alfombras y tapetes tejidos a mano' 
  }
};

/**
 * Obtiene la configuración de una categoría predefinida por su slug
 * @param categorySlug - El slug de la categoría
 * @returns La configuración de la categoría o una configuración por defecto
 */
export function getCategoryConfig(categorySlug: string): CategoryConfig {
  return PREDEFINED_CATEGORIES[categorySlug] || {
    name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    icon: '🎀',
    description: 'Categoría personalizada'
  };
}

/**
 * Obtiene todas las categorías predefinidas disponibles
 * @returns Array de configuraciones de categorías
 */
export function getAllPredefinedCategories(): Array<{ slug: string } & CategoryConfig> {
  return Object.entries(PREDEFINED_CATEGORIES).map(([slug, config]) => ({
    slug,
    ...config
  }));
}

/**
 * Verifica si una categoría es predefinida
 * @param categorySlug - El slug de la categoría
 * @returns true si es predefinida, false si es personalizada
 */
export function isPredefinedCategory(categorySlug: string): boolean {
  return categorySlug in PREDEFINED_CATEGORIES;
} 