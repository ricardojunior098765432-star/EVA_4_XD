import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (id) {
      const saved = localStorage.getItem('products');
      if (saved) {
        const products: Product[] = JSON.parse(saved);
        const found = products.find(p => p.id === id);
        if (found) setProduct(found);
      }
    }
  }, [id]);

  if (!product) return <p style={{ textAlign: 'center', marginTop: '50px' }}>Producto no encontrado</p>;

  return (
    <div className="page-container">
      <Link to="/productos" className="btn btn-ghost" style={{ marginBottom: '20px', width: 'fit-content' }}>
        ← Volver a Productos
      </Link>

      <div className="panel" style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 380px) 1fr', gap: '30px', alignItems: 'start' }}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-image"
            style={{ width: '100%', height: '320px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
          />
        ) : (
          <div className="empty-state" style={{ height: '320px', display: 'grid', placeItems: 'center' }}>
            Sin imagen disponible
          </div>
        )}

        <div>
          <p className="eyebrow">Producto</p>
          <h1 style={{ color: '#166534', margin: '0 0 8px' }}>{product.name}</h1>
          <p style={{ fontSize: '1.25rem', color: '#166534', fontWeight: '700' }}>${product.price.toLocaleString()}</p>

          <div style={{ margin: '20px 0', display: 'grid', gap: '8px' }}>
            <div><strong>Categoría:</strong> {product.category}</div>
            <div><strong>Stock:</strong> <span style={{ color: product.stock < 10 ? '#dc2626' : '#15803d' }}>{product.stock} unidades</span></div>
            <div><strong>Fecha de creación:</strong> {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'No registrada'}</div>
          </div>

          <h3 style={{ marginBottom: '8px' }}>Descripción</h3>
          <p style={{ lineHeight: '1.6', fontSize: '16px', color: '#374151' }}>{product.description}</p>

          <div style={{ marginTop: '30px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button onClick={() => navigate(`/productos/editar/${product.id}`)} className="btn btn-primary">Editar Producto</button>
            <button onClick={() => navigate('/productos')} className="btn btn-ghost">Volver</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;