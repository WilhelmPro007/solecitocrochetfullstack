// app/products/page.tsx

export default function ProductsPage() {
  const products = [
    { id: '1', name: 'Bufanda de lana fina', price: '$35.00', image: '/scarf.jpg' },
    { id: '2', name: 'Bolso tejido bohemio', price: '$45.00', image: '/handbag.jpg' },
    { id: '3', name: 'Amigurumi unicornio', price: '$25.00', image: '/unicorn.jpg' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Nuestro Catálogo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded shadow overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-lg font-medium">{product.name}</h2>
              <p className="text-green-600 mt-1">{product.price}</p>
              <button className="mt-2 w-full bg-pink-600 text-white py-1 rounded hover:bg-pink-700">
                Ver detalles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}