import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useAuth } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const { user, logout } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const deleteProduct = (id: string) => {
    if (window.confirm('¿Eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (!filterCategory || p.category === filterCategory)
  );

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Inventario</p>
          <h1 className="page-title">Gestión de Productos</h1>
          <p className="page-subtitle">Organiza catálogo, stock y detalles de cada producto.</p>
        </div>
        <div className="nav-actions">
          <span>Bienvenido, <strong>{user?.name}</strong></span>
          <button onClick={logout} className="btn btn-danger">Cerrar Sesión</button>
        </div>
      </header>

      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-header">
          <h2>Productos</h2>
          <Link to="/productos/nuevo" className="btn btn-primary">
            + Nuevo Producto
          </Link>
        </div>

        <div className="toolbar">
          <input
            className="form-input"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: '320px' }}
          />
          <select className="form-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ maxWidth: '240px' }}>
            <option value="">Todas las categorías</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card card">
            {product.imageUrl && <img className="product-image" src={product.imageUrl} alt={product.name} />}
            <h3 style={{ margin: '0' }}>{product.name}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>{product.category}</p>
            <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>${product.price.toLocaleString()}</strong>
              <span className="badge">Stock: {product.stock}</span>
            </div>
            <div className="controls" style={{ marginTop: '12px' }}>
              <Link to={`/productos/${product.id}`} className="btn btn-primary" style={{ flex: 1 }}>Ver Detalle</Link>
              <Link to={`/productos/editar/${product.id}`} className="btn btn-accent" style={{ flex: 1 }}>Editar</Link>
              <button onClick={() => deleteProduct(product.id)} className="btn btn-danger" style={{ flex: 1 }}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && <p className="empty-state">No se encontraron productos</p>}
    </div>
  );
};

export default ProductList;