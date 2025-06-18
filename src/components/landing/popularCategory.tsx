import React from 'react';
import Image from 'next/image';

export default function PopularCategory() {
  return (
    <>
      <section id="categorias" className="px-6 pb-24 bg-pink-50 dark:bg-pink-100">
        <h2 className="text-2xl font-semibold text-center mb-10">Categorías Populares</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {[
            { name: "Amigurumis", image: "/amigurumi.jpg" },
            { name: "Mantas", image: "/blanket.jpg" },
            { name: "Bolsos", image: "/bag.jpg" },
            { name: "Toallas", image: "/towel.jpg" },
          ].map((category, index) => (
            <div key={index} className="relative group">
              <Image
                src={category.image}
                alt={category.name}
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black/30 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-medium">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}