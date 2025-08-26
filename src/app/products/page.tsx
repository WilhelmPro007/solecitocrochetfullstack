'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import { Product, ProductImage } from '@/hooks/useProducts';

interface Category {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  slug?: string; // Added slug for consistency with other parts of the code
}

interface CategoriesResponse {
  categories: Category[];
  totalProducts: number;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
  offset: number;
}

interface ProductsResponse {
  products: Product[];
  pagination: PaginationInfo;
}

export default function ProductsPage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [itemsPerPage, setItemsPerPage] = useState<number>(16);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    // Solo cargar categorías una vez al montar el componente
    fetchCategories();
  }, []); // Array vacío = solo se ejecuta una vez

  useEffect(() => {
    // Resetear a la primera página cuando cambie la categoría
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    // Cargar productos cuando cambien los parámetros de búsqueda
    fetchProducts();
  }, [selectedCategory, currentPage, itemsPerPage, sortBy, sortOrder]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      // Obtener categorías con contador de productos
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data: CategoriesResponse = await response.json();
        // Validar que data.categories sea un array
        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
          setTotalProducts(data.totalProducts || 0);
        } else {
          console.error('Error: categories no es un array:', data);
          setCategories([]);
          setTotalProducts(0);
        }
      } else {
        console.error('Error en la respuesta de la API:', response.status);
        setCategories([]);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
      setTotalProducts(0);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('active', 'true');
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);
      
      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        
        // Validar que la respuesta tenga la estructura esperada
        if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
          setTotalPages(data.pagination?.totalPages || 1);
          setTotalProducts(data.pagination?.totalProducts || 0);
        } else if (Array.isArray(data)) {
          // Fallback para respuestas antiguas (sin paginación)
          console.warn('API devolvió respuesta sin paginación, usando fallback');
          setProducts(data);
          setTotalPages(1);
          setTotalProducts(data.length);
        } else {
          console.error('Respuesta de API inválida:', data);
          setProducts([]);
          setTotalPages(1);
          setTotalProducts(0);
        }
      } else {
        console.error('Error fetching products:', response.status, response.statusText);
        setProducts([]);
        setTotalPages(1);
        setTotalProducts(0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getCurrentCategoryName = () => {
    if (selectedCategory === 'all') return 'Todos los Productos';
    const category = categories.find(cat => (cat.slug || cat.id) === selectedCategory);
    return category?.name || 'Categoría';
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleItemsPerPageChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getSortDisplayName = (sortValue: string) => {
    switch (sortValue) {
      case 'price-asc': return 'Precio: Menor a Mayor';
      case 'price-desc': return 'Precio: Mayor a Menor';
      case 'name-asc': return 'Nombre: A-Z';
      case 'name-desc': return 'Nombre: Z-A';
      case 'newest': return 'Más Recientes';
      default: return 'Orden predeterminado';
    }
  };

  const getSortParams = (sortValue: string) => {
    switch (sortValue) {
      case 'price-asc': return { sortBy: 'price', sortOrder: 'asc' };
      case 'price-desc': return { sortBy: 'price', sortOrder: 'desc' };
      case 'name-asc': return { sortBy: 'name', sortOrder: 'asc' };
      case 'name-desc': return { sortBy: 'name', sortOrder: 'desc' };
      case 'newest': return { sortBy: 'createdAt', sortOrder: 'desc' };
      default: return { sortBy: 'createdAt', sortOrder: 'desc' };
    }
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nuestro Catálogo 🎀
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de Categorías */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">📂</span>
                Categorías
              </h2>
              
              <div className="space-y-2">
                {/* Categoría "Todos" */}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                    selectedCategory === 'all'
                      ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🌸</span>
                    <span className="font-medium">Todos los Productos</span>
                  </div>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                    {totalProducts}
                  </span>
                </button>

                {/* Loading de categorías */}
                {categoriesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-full px-4 py-3 rounded-lg bg-gray-100 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-gray-200 rounded"></div>
                            <div className="w-20 h-4 bg-gray-200 rounded"></div>
                          </div>
                          <div className="w-8 h-4 bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Categorías específicas */
                  Array.isArray(categories) && categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug || category.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                        selectedCategory === (category.slug || category.id)
                          ? 'bg-pink-100 text-pink-700 border-2 border-pink-300'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                        {category.productCount}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:w-3/4">
            {/* Breadcrumbs y Controles */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Breadcrumbs */}
                <div className="text-sm text-gray-600">
                  <span className="hover:text-pink-600 cursor-pointer">Inicio</span>
                  <span className="mx-2">›</span>
                  <span className="text-pink-600 font-medium">{getCurrentCategoryName()}</span>
                </div>

                {/* Controles de Ordenamiento y Visualización */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Ordenamiento */}
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const { sortBy: newSortBy, sortOrder: newSortOrder } = getSortParams(e.target.value);
                      setSortBy(newSortBy);
                      setSortOrder(newSortOrder);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="createdAt-desc">Más Recientes</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                  </select>

                  {/* Productos por página */}
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    <option value={12}>Mostrar 12</option>
                    <option value={16}>Mostrar 16</option>
                    <option value={24}>Mostrar 24</option>
                    <option value={32}>Mostrar 32</option>
                  </select>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Mostrando {products.length} resultado{products.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && ` en ${getCurrentCategoryName()}`}
                  {selectedCategory === 'all' && ` de ${totalProducts} total`}
                  {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
                </p>
              </div>
            </div>

            {/* Grid de Productos */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="bg-white rounded-lg border border-pink-100 shadow-lg overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded mb-4 w-1/2"></div>
                      <div className="space-y-2">
                        <div className="h-8 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(products) && products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      variant="catalog"
                      onFavoriteToggle={toggleFavorite}
                      isFavorite={favorites.includes(product.id)}
                    />
                  ))}
                </div>

                {/* Controles de Paginación */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-2 bg-white rounded-lg shadow-sm border border-gray-200 p-2">
                      {/* Botón Anterior */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={!currentPage || currentPage <= 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Anterior
                      </button>

                      {/* Números de página */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === pageNum
                                ? 'bg-pink-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Botón Siguiente */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={!currentPage || currentPage >= totalPages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente →
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <span className="text-6xl mb-4 block">🎀</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {Array.isArray(products) ? 'No hay productos en esta categoría' : 'Error al cargar productos'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {Array.isArray(products) 
                    ? 'Prueba seleccionando una categoría diferente'
                    : 'Hubo un problema al cargar los productos. Por favor, recarga la página.'
                  }
                </p>
                <button
                  onClick={() => {
                    if (Array.isArray(products)) {
                      setSelectedCategory('all');
                    } else {
                      fetchProducts();
                    }
                  }}
                  className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <span>🌸</span>
                  <span>{Array.isArray(products) ? 'Ver Todos los Productos' : 'Reintentar'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Favorites Count */}
        {favorites.length > 0 && (
          <div className="fixed bottom-6 right-6 bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg">
            <Link href="/favorites" className="flex items-center space-x-2">
              <span>💖</span>
              <span>{favorites.length} favoritos</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}