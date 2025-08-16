import React from 'react';

export default function LandingHero() {
  return (
    <>
      <section className="px-6 pt-16 pb-24 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          Hecho con amor, <br />a mano y con lana.
        </h1>
        <p className="mt-6 text-lg text-gray-900 dark:text-gray-900 max-w-xl mx-auto">
          Encuentra piezas únicas hechas en crochet por artesanos talentosos. 
          Cada producto es único, como tú.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button className="rounded-md bg-pink-600 text-white text-sm font-medium px-6 py-3 hover:bg-pink-700 transition-colors">
            Ver productos
          </button>
          <button className="rounded-md border border-gray-300 dark:border-gray-400 text-sm font-medium px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-200 transition-colors">
            Conoce más
          </button>
        </div>
      </section>
    </>
  );
}