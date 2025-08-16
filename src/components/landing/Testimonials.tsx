import React from 'react';

export default function Testimonials() {
  return (
    <>

      <section className="px-6 pb-24 bg-gray-50 dark:bg-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-10">Lo que dicen nuestros clientes</h2>
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <blockquote className="text-gray-900 italic">
            “Me encantó mi compra, la atención fue muy cálida y la prenda llegó perfecta, con detalles únicos.”
            <p className="mt-2 font-semibold">— María S., Cliente recurrente</p>
          </blockquote>
          <blockquote className="text-gray-900 italic">
            “Cada producto es una obra de arte. Compré un amigurumi y es aún mejor de lo que esperaba.”
            <p className="mt-2 font-semibold">— Laura R., Amante del handmade</p>
          </blockquote>
        </div>
      </section>
      
    </>
  );
}