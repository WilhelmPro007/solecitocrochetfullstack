# 🚀 Ejemplos de SDK - Solecito Crochet API

## 📋 Descripción General

Esta documentación proporciona ejemplos prácticos de implementación de la API de Solecito Crochet en diferentes lenguajes y frameworks. Cada ejemplo incluye casos de uso comunes y mejores prácticas.

---

## 🔧 JavaScript/TypeScript

### Cliente API Básico

```typescript
class SolecitoCrochetAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = 'https://api.solecitocrochet.com') {
    this.baseUrl = baseUrl;
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login fallido');
    }

    const data = await response.json();
    this.token = data.session.accessToken;
  }

  async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, String(value));
    });

    const response = await fetch(`${this.baseUrl}/api/products?${params}`, {
      headers: this.token ? { Authorization: `Bearer ${this.token}` } : {}
    });

    if (!response.ok) {
      throw new Error('Error obteniendo productos');
    }

    return response.json();
  }
}
```

### Hook de React

```typescript
import { useState, useEffect } from 'react';

export function useProducts(filters: ProductFilters = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts(filters);
        setProducts(response.products);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  return { products, loading, error };
}
```

---

## 🐍 Python

### Cliente API con Requests

```python
import requests
from typing import Dict, Any, Optional

class SolecitoCrochetAPI:
    def __init__(self, base_url: str = "https://api.solecitocrochet.com"):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()

    def login(self, email: str, password: str) -> None:
        response = self.session.post(
            f"{self.base_url}/api/auth/signin",
            json={"email": email, "password": password}
        )
        
        if response.status_code != 200:
            raise Exception("Login fallido")
        
        data = response.json()
        self.token = data["session"]["accessToken"]
        self.session.headers.update({"Authorization": f"Bearer {self.token}"})

    def get_products(self, filters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        if filters is None:
            filters = {}
        
        response = self.session.get(
            f"{self.base_url}/api/products",
            params=filters
        )
        
        if response.status_code != 200:
            raise Exception("Error obteniendo productos")
        
        return response.json()
```

---

## 📱 React Native

### Cliente API Móvil

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

class MobileAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = 'https://api.solecitocrochet.com';
    this.loadToken();
  }

  private async loadToken(): Promise<void> {
    this.token = await AsyncStorage.getItem('auth_token');
  }

  async login(email: string, password: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error('Login fallido');
    }

    const data = await response.json();
    this.token = data.session.accessToken;
    await AsyncStorage.setItem('auth_token', this.token);
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }
}
```

---

## 🌐 PHP

### Cliente API con cURL

```php
class SolecitoCrochetAPI {
    private $baseUrl;
    private $token;

    public function __construct($baseUrl = 'https://api.solecitocrochet.com') {
        $this->baseUrl = $baseUrl;
    }

    public function login($email, $password) {
        $data = json_encode([
            'email' => $email,
            'password' => $password
        ]);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->baseUrl . '/api/auth/signin');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('Login fallido');
        }

        $result = json_decode($response, true);
        $this->token = $result['session']['accessToken'];
    }

    public function getProducts($filters = []) {
        $query = http_build_query($filters);
        $url = $this->baseUrl . '/api/products?' . $query;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        curl_close($ch);

        return json_decode($response, true);
    }
}
```

---

## 🎯 Casos de Uso Comunes

### 1. E-commerce Frontend

```typescript
// Componente de catálogo de productos
function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    page: 1,
    limit: 12
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.getProducts(filters);
        setProducts(response.products);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  if (loading) return <div>Cargando productos...</div>;

  return (
    <div>
      <CategoryFilter onCategoryChange={handleCategoryChange} />
      <ProductGrid products={products} />
      <Pagination 
        currentPage={filters.page}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

### 2. Dashboard Administrativo

```typescript
// Panel de gestión de productos
function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleCreateProduct = async (productData: CreateProductData) => {
    try {
      const newProduct = await api.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      toast.success('Producto creado exitosamente');
    } catch (error) {
      toast.error('Error creando producto');
    }
  };

  const handleUpdateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const updatedProduct = await api.updateProduct(id, updates);
      setProducts(prev => 
        prev.map(p => p.id === id ? updatedProduct : p)
      );
      toast.success('Producto actualizado exitosamente');
    } catch (error) {
      toast.error('Error actualizando producto');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await api.deleteProduct(id);
        setProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Producto eliminado exitosamente');
      } catch (error) {
        toast.error('Error eliminando producto');
      }
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} />
      <ProductTable 
        products={products}
        onEdit={setSelectedProduct}
        onDelete={handleDeleteProduct}
      />
      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onUpdate={handleUpdateProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
```

### 3. Sistema de Tracking

```typescript
// Tracking de interacciones de usuario
function ProductTracker({ productId }: { productId: string }) {
  const trackInteraction = async (clickType: ClickType) => {
    try {
      await api.trackProductInteraction(productId, {
        clickType,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  };

  const handleWhatsAppClick = () => {
    trackInteraction('whatsapp');
    // Abrir WhatsApp
    window.open(`https://wa.me/1234567890?text=Hola, me interesa este producto`);
  };

  const handleFavoriteClick = () => {
    trackInteraction('favorite');
    // Toggle favorito
  };

  return (
    <div className="product-actions">
      <button onClick={() => trackInteraction('view')}>
        Ver Detalles
      </button>
      <button onClick={handleFavoriteClick}>
        ❤️ Favorito
      </button>
      <button onClick={handleWhatsAppClick}>
        📱 WhatsApp
      </button>
    </div>
  );
}
```

---

## 🔒 Manejo de Autenticación

### Middleware de Protección

```typescript
// middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Lógica adicional del middleware
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Verificar permisos específicos
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'ADMIN' || token?.role === 'SUPERADMIN';
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

### Hook de Autenticación

```typescript
export function useAuth() {
  const { data: session, status } = useSession();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return result;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
  };

  return {
    session,
    status,
    login,
    logout,
    isAuthenticated: !!session,
    user: session?.user,
    isLoading: status === 'loading'
  };
}
```

---

## 📊 Gestión de Estado

### Context de Productos

```typescript
interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  createProduct: (data: CreateProductData) => Promise<void>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (filters: ProductFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts(filters);
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (data: CreateProductData) => {
    try {
      const newProduct = await api.createProduct(data);
      setProducts(prev => [newProduct, ...prev]);
    } catch (err) {
      throw err;
    }
  };

  const value: ProductContextType = {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts debe usarse dentro de ProductProvider');
  }
  return context;
}
```

---

## 🧪 Testing

### Tests de Componentes

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Amigurumi Conejito',
    price: 29.99,
    category: 'amigurumis',
    images: [
      {
        id: 'img1',
        url: '/api/images/img1',
        altText: 'Vista frontal',
        isMain: true
      }
    ]
  };

  it('renderiza correctamente el producto', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Amigurumi Conejito')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
    expect(screen.getByText('amigurumis')).toBeInTheDocument();
  });

  it('muestra la imagen principal', () => {
    render(<ProductCard product={mockProduct} />);
    
    const image = screen.getByAltText('Vista frontal');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/api/images/img1');
  });

  it('maneja clicks en botones de acción', async () => {
    const mockTrackInteraction = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        onTrackInteraction={mockTrackInteraction}
      />
    );

    const whatsappButton = screen.getByText('📱 WhatsApp');
    fireEvent.click(whatsappButton);

    await waitFor(() => {
      expect(mockTrackInteraction).toHaveBeenCalledWith('1', 'whatsapp');
    });
  });
});
```

---

## 🚀 Optimización y Performance

### Lazy Loading de Imágenes

```typescript
function ProductImage({ src, alt, ...props }: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setError(true);

  if (error) {
    return <div className="image-error">Error cargando imagen</div>;
  }

  return (
    <div className="image-container">
      {!isLoaded && <div className="image-skeleton" />}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`product-image ${isLoaded ? 'loaded' : 'loading'}`}
        {...props}
      />
    </div>
  );
}
```

### Cache con React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => api.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductData) => api.createProduct(data),
    onSuccess: () => {
      // Invalidar cache de productos
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
```

---

## 📚 Recursos Adicionales

### Documentación Relacionada
- [Referencia de la API](./API_REFERENCE.md) - Documentación completa de endpoints
- [Guía del Desarrollador](./DEVELOPER_GUIDE.md) - Guía técnica completa
- [README Principal](./README.md) - Visión general del proyecto

### Herramientas Recomendadas
- **React Query**: Para gestión de estado del servidor
- **Zustand**: Para estado local simple
- **React Hook Form**: Para formularios
- **Zod**: Para validación de esquemas

---

*Ejemplos de SDK - Solecito Crochet API v1.0.0*

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Estado**: ✅ **PRODUCCIÓN READY**
