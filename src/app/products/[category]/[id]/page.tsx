'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import ImageGallery from '@/components/products/ImageGallery';

interface Product {
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

interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
  order: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();
      
      if (response.ok) {
        setProduct(data);
        // Track view
        trackClick('view');
      } else {
        setError(data.error || 'Producto no encontrado');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const trackClick = async (clickType: string) => {
    try {
      await fetch(`/api/products/${params.id}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clickType }),
      });
    } catch (error) {
      console.error('Error tracking click:', error);
    }
  };

  const shareOnWhatsApp = () => {
    if (!product) return;
    
    trackClick('whatsapp');
    
    const message = `¡Hola! Me interesa este producto de Solecito Crochet:\n\n🎀 ${product.name}\n💰 $${product.price}\n📝 ${product.description}\n\n¿Podrías darme más información?`;
    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    trackClick('favorite');
    // Aquí podrías agregar la lógica para guardar en localStorage o base de datos
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-200 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-900">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <span className="text-6xl mb-4 block">😞</span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Producto no encontrado
          </h3>
          <p className="text-gray-900 mb-6">
            {error || 'El producto que buscas no existe o ha sido eliminado'}
          </p>
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-pink-400 hover:bg-pink-500 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            <span>🛍️</span>
            <span>Ver Catálogo</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{product.name} - Solecito Crochet</title>
        <meta name="description" content={product.description || `${product.name} - Producto tejido a mano con amor en Solecito Crochet. Precio: $${product.price}`} />
        <meta name="keywords" content={`crochet, tejido, ${product.category}, ${product.name}, artesanal, hecho a mano`} />
        <meta property="og:title" content={`${product.name} - Solecito Crochet`} />
        <meta property="og:description" content={product.description || `${product.name} - Producto tejido a mano con amor`} />
        <meta property="og:image" content={product.images[0]?.url || '/default-product.jpg'} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price.toString()} />
        <meta property="product:price:currency" content="USD" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.name} - Solecito Crochet`} />
        <meta name="twitter:description" content={product.description || `${product.name} - Producto tejido a mano con amor`} />
        <meta name="twitter:image" content={product.images[0]?.url || '/default-product.jpg'} />
        <link rel="canonical" href={`https://solecitocrochet.com/products/${product.category}/${product.id}`} />
        
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": product.name,
              "description": product.description,
              "image": product.images.map(img => img.url),
              "brand": {
                "@type": "Brand",
                "name": "Solecito Crochet"
              },
              "category": product.category,
              "offers": {
                "@type": "Offer",
                "url": `https://solecitocrochet.com/products/${product.category}/${product.id}`,
                "priceCurrency": "USD",
                "price": product.price,
                "priceValidUntil": "2025-12-31",
                "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                "seller": {
                  "@type": "Organization",
                  "name": "Solecito Crochet"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "24"
              }
            })
          }}
        />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-900 hover:text-pink-600 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <span className="text-gray-900">›</span>
              </li>
              <li>
                <Link href="/products" className="text-gray-900 hover:text-pink-600 transition-colors">
                  Catálogo
                </Link>
              </li>
              <li>
                <span className="text-gray-900">›</span>
              </li>
              <li>
                <Link 
                  href={`/products?category=${product.category}`} 
                  className="text-gray-900 hover:text-pink-600 transition-colors capitalize"
                >
                  {product.category}
                </Link>
              </li>
              <li>
                <span className="text-gray-900">›</span>
              </li>
              <li className="text-gray-900 font-medium truncate">
                {product.name}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Image Gallery */}
              <div className="relative">
                <ImageGallery
                  images={product.images}
                  className="w-full"
                />
                
                {/* Favorite Button */}
                <button
                  onClick={toggleFavorite}
                  className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow z-10"
                  title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                  <span className="text-xl">
                    {isFavorite ? '💖' : '🤍'}
                  </span>
                </button>

                {/* Featured Badge */}
                {product.featured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                      ⭐ Destacado
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>
                  <span className="text-3xl font-bold text-pink-600">
                    ${product.price}
                  </span>
                </div>
                
                {product.description && (
                  <p className="text-gray-900 text-lg leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-pink-100">
                  <span className="text-sm font-medium text-gray-900">Categoría</span>
                  <p className="text-gray-900 capitalize">{product.category}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-pink-100">
                  <span className="text-sm font-medium text-gray-900">Stock</span>
                  <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                  </p>
                </div>

                {product.materials && (
                  <div className="bg-white p-4 rounded-lg border border-pink-100">
                    <span className="text-sm font-medium text-gray-900">Materiales</span>
                    <p className="text-gray-900">{product.materials}</p>
                  </div>
                )}

                {product.dimensions && (
                  <div className="bg-white p-4 rounded-lg border border-pink-100">
                    <span className="text-sm font-medium text-gray-900">Dimensiones</span>
                    <p className="text-gray-900">{product.dimensions}</p>
                  </div>
                )}

                {product.weight && (
                  <div className="bg-white p-4 rounded-lg border border-pink-100">
                    <span className="text-sm font-medium text-gray-900">Peso</span>
                    <p className="text-gray-900">{product.weight}</p>
                  </div>
                )}
              </div>

              {/* Care Instructions */}
              {product.careInstructions && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    💡 Instrucciones de Cuidado
                  </h3>
                  <p className="text-blue-800 text-sm">
                    {product.careInstructions}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={shareOnWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-3"
                >
                  <span className="text-xl">📱</span>
                  <span>Comprar por WhatsApp</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={toggleFavorite}
                    className={`font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                      isFavorite
                        ? 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    <span>{isFavorite ? '💖' : '🤍'}</span>
                    <span>{isFavorite ? 'En Favoritos' : 'Agregar a Favoritos'}</span>
                  </button>
                  
                  <Link
                    href="/products"
                    className="bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>🛍️</span>
                    <span>Ver Más Productos</span>
                  </Link>
                </div>
              </div>

              {/* Share Info */}
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <h3 className="text-sm font-medium text-pink-900 mb-2">
                  💕 Hecho con Amor
                </h3>
                <p className="text-pink-800 text-sm">
                  Todos nuestros productos son tejidos a mano con dedicación y cariño. 
                  Cada pieza es única y especial, perfecta para ti o como regalo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}