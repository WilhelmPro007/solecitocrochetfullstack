import react from 'react';

import { useParams } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}
