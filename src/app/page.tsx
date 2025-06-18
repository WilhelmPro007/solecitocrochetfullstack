// src/app/page.tsx

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-50 text-gray-900 dark:text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-300 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Crochet Store Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold text-lg">Manos de Lana</span>
        </div>
        <nav className="space-x-6 text-sm font-medium hidden md:flex">
        <Link href="/" className="hover:text-gray-500">Inicio</Link>
        <Link href="/products" className="hover:text-gray-500">Catálogo</Link>
        <Link href="#testimonios" className="hover:text-gray-500">Testimonios</Link>
        <Link href="#contacto" className="hover:text-gray-500">Contacto</Link>
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="#login"
            className="text-sm font-medium hover:underline hidden md:inline"
          >
            Iniciar sesión
          </a>
          <button className="rounded-md bg-pink-600 text-white text-sm font-medium px-4 py-2 hover:bg-pink-700 transition-colors">
            Carrito
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-24 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          Hecho con amor, <br />a mano y con lana.
        </h1>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-500 max-w-xl mx-auto">
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

      {/* Categorías */}
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

      {/* Productos Destacados */}
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

      {/* Testimonios */}
      <section className="px-6 pb-24 bg-gray-50 dark:bg-gray-200">
        <h2 className="text-2xl font-semibold text-center mb-10">Lo que dicen nuestros clientes</h2>
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <blockquote className="text-gray-700 italic">
            “Me encantó mi compra, la atención fue muy cálida y la prenda llegó perfecta, con detalles únicos.”
            <p className="mt-2 font-semibold">— María S., Cliente recurrente</p>
          </blockquote>
          <blockquote className="text-gray-700 italic">
            “Cada producto es una obra de arte. Compré un amigurumi y es aún mejor de lo que esperaba.”
            <p className="mt-2 font-semibold">— Laura R., Amante del handmade</p>
          </blockquote>
        </div>
      </section>

      {/* Contact Section */}
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
            <a
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
            </a>

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-600">
              Responderemos lo antes posible 💬
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="border-t border-gray-200 dark:border-gray-300 px-6 py-10 text-center text-sm text-gray-500">
        <p>&copy; 2025 Manos de Lana. Todos los derechos reservados.</p>
        <div className="mt-4 space-x-4">
          <a href="#" className="hover:underline">Políticas de privacidad</a>
          <a href="#" className="hover:underline">Términos y condiciones</a>
          <a href="#" className="hover:underline">Contacto</a>
        </div>
      </footer>
    </div>
  );
}