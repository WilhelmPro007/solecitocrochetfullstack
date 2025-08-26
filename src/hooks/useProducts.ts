import { useState, useEffect, useCallback } from 'react';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  isActive: boolean;
  featured: boolean;
  materials?: string;
  dimensions?: string;
  weight?: string;
  careInstructions?: string;
  images: ProductImage[];
  creator?: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
  order: number;
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string;
  fetchProducts: () => Promise<void>;
  updateProductStatus: (productId: string, isActive: boolean) => Promise<void>;
}

export function useProducts(filter: string = 'all'): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filter !== 'all') {
        params.append('active', filter);
      }
      
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      console.log('API Response:', data); // Debug
      
      if (response.ok) {
        // La API devuelve { products: [...], pagination: {...} }
        if (data && data.products && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          // Fallback para compatibilidad
          setProducts(data);
        } else {
          console.error('La API devolvió un formato inesperado:', data);
          setProducts([]);
          setError('Formato de datos inválido');
        }
      } else {
        setError(data.error || 'Error al cargar productos');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error en fetchProducts:', error);
      setError('Error de conexión');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const updateProductStatus = useCallback(async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive })
      });

      if (response.ok) {
        // Actualizar el producto localmente
        setProducts(prevProducts => 
          prevProducts.map(product => 
            product.id === productId 
              ? { ...product, isActive }
              : product
          )
        );
        return;
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    updateProductStatus
  };
} 