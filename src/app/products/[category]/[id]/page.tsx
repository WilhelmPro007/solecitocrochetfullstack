'use client' // Necesario si usas hooks como useState, useEffect o useParams

import { useParams } from 'next/navigation'

export default function ProductPage() {
  const { id } = useParams() // Aquí obtienes el parámetro dinámico

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product ID: {id}</p>
    </div>
  )
}