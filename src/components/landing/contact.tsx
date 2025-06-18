import React from 'react';
import Link from 'next/link';

export default function Contact() {
  return (
    <>
    
    <section id="contacto" className="px-6 pb-24 text-center">
        <h2 className="text-2xl font-semibold mb-6">Contáctanos</h2>
        <p className="text-gray-600 dark:text-gray-500 max-w-md mx-auto mb-8">
          ¿Tienes preguntas o necesitas ayuda con tu pedido? Escríbenos o contáctanos por WhatsApp.
        </p>

        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

          {/* Formulario de contacto */}
          <form className="bg-white dark:bg-gray-100 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-300">
            <div className="mb-4">
              <label htmlFor="name" className="block text-left text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Tu nombre completo"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-left text-sm font-medium text-gray-700 dark:text-gray-600 mb-1">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Escribe tu mensaje..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-pink-600 text-white text-sm font-medium py-2 hover:bg-pink-700 transition-colors"
            >
              Enviar mensaje
            </button>
          </form>

          {/* Botón de WhatsApp */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-lg font-medium mb-4">¿Prefieres WhatsApp?</h3>
            <Link
              href="https://wa.me/1234567890"  // ← Reemplaza con tu número real
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-full transition-colors shadow-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-white"
              >
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.11.553 4.104 1.556 5.85L0 24l6.264-1.645a11.984 11.984 0 005.736 1.445c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.333c-5.16 0-9.333-4.173-9.333-9.333S6.84 2.667 12 2.667 21.333 6.84 21.333 12 17.16 21.333 12 21.333z" />
                <path d="M16.24 11.47a.667.667 0 00-.387-.205c-.062-.01-.256-.12-.442-.26a.65.65 0 00-.22-.147.54.54 0 00-.273-.073c-.11 0-.21.02-.3.059-.107.053-.357.173-.687.267-.33.093-.39.12-.533-.12-.147-.247-.58-.473-.847-.473-.11 0-.247.01-.39.03a.667.667 0 00-.447.313c-.087.12-.347.42-.513.613-.167.193-.334.333-.493.373-.16.04-.313.053-.46.053-.293 0-.62-.12-.953-.36a2.02 2.02 0 01-.68-.68c-.24-.333-.36-.66-.36-.953 0-.147.013-.293.04-.46.04-.153.093-.307.153-.487.06-.18.113-.353.073-.513-.04-.16-.28-.393-.52-.54a.667.667 0 00-.313-.08c-.16 0-.313.04-.447.12-.133.08-.36.347-.473.513-.113.167-.22.167-.393.113-.173-.053-.733-.267-.993-.347-.26-.08-.16-.173.033-.233.193-.06.413-.12.587-.12.153 0 .287.013.4.04.113.027.22.06.32.093.093.033.193.047.293.047.167 0 .24-.067.34-.167.1-.1.393-.36.68-.62.287-.26.293-.413.32-.453.027-.04.053-.093.08-.147.027-.053.013-.107-.013-.16-.027-.053-.253-.613-.347-.853-.093-.24-.187-.187-.26-.187-.067 0-.133.013-.2.027-.067.013-.28.093-.42.28a1.15 1.15 0 00-.28.42c-.04.133-.06.287-.06.447 0 .293.107.573.32 1.02.207.44.447.887.5.987.053.1.44.667.993 1.127.553.46 1.013.613 1.16.66.147.047 2.387.747 2.72.853.333.107.56.073.773.02.213-.053 1.347-.493 1.533-.973.193-.48.193-.853.167-.913-.027-.06-.093-.15-.193-.233z" />
              </svg>
              Chatea con nosotros
            </Link>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-600">
              Responderemos lo antes posible 💬
            </p>
          </div>
        </div>
      </section>
      
    </>
  );
}