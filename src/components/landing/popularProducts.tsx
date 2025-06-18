import React from 'react';
import Image from 'next/image';

export default function PopularProducts() {
  return (
    <>
      <section id="productos" className="px-6 pb-24">
        <h2 className="text-2xl font-semibold text-center mb-10">Productos Destacados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Bufanda de lana fina", price: "$35.00", image: "/scarf.jpg" },
            { name: "Bolso tejido bohemio", price: "$45.00", image: "/handbag.jpg" },
            { name: "Amigurumi unicornio", price: "$25.00", image: "/unicorn.jpg" },
          ].map((product, index) => (
            <div key={index} className="bg-white dark:bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-300 hover:shadow-md transition-shadow">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-green-600 dark:text-green-700 mt-1">{product.price}</p>
                <button className="mt-3 w-full rounded-md bg-pink-600 text-white text-sm font-medium py-2 hover:bg-pink-700 transition-colors">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}