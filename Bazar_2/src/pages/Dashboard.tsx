import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useContacts } from '../hooks/useContacts';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { products, loading: productsLoading, loadProducts } = useProducts();
  const { contacts, loading: contactsLoading, loadContacts } = useContacts();

  useEffect(() => {
    loadProducts();
    loadContacts();
  }, [loadContacts, loadProducts]);

  const summary = useMemo(() => {
    const lowStock = products.filter((product) => product.stock < 10).length;
    const pendingContacts = contacts.filter(
      (contact) => contact.status !== 'Respondido' && contact.status !== 'Cerrado'
    ).length;

    return {
      totalProducts: products.length,
      lowStock,
      totalContacts: contacts.length,
      pendingContacts,
    };
  }, [products, contacts]);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Panel administrativo</p>
          <h1 className="page-title">Verde Limón</h1>
          <p className="page-subtitle">Controla inventario, pedidos y solicitudes de tus clientes desde un solo lugar.</p>
        </div>
        <div className="nav-actions">
          <span>Bienvenido, <strong>{user?.name}</strong></span>
          <button onClick={logout} className="btn btn-danger">Cerrar sesión</button>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card stat-card--green">
          <h3>Productos</h3>
          <p className="value">{productsLoading ? '...' : summary.totalProducts}</p>
          <small>{productsLoading ? 'Cargando...' : `${summary.lowStock} con stock bajo`}</small>
        </article>
        <article className="stat-card stat-card--blue">
          <h3>Solicitudes</h3>
          <p className="value">{contactsLoading ? '...' : summary.totalContacts}</p>
          <small>{contactsLoading ? 'Cargando...' : `${summary.pendingContacts} pendientes`}</small>
        </article>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Gestión integral</h2>
          <span className="pill">Actualizado</span>
        </div>
        <p style={{ color: '#4b5563', lineHeight: '1.6' }}>
          Administra productos naturales, ecológicos y de bienestar, además de las solicitudes de contacto de tus clientes.
        </p>

        <div className="controls" style={{ marginTop: '20px' }}>
          <Link to="/productos" className="btn btn-primary">
            Gestionar productos
          </Link>
          <Link to="/contactos" className="btn btn-accent">
            Ver solicitudes de contacto
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
