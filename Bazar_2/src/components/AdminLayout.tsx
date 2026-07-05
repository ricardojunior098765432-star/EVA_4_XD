import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

const navItems = [
  { to: '/', label: 'Resumen', icon: '📊' },
  { to: '/productos', label: 'Productos', icon: '🛍️' },
  { to: '/contactos', label: 'Solicitudes', icon: '✉️' },
];

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/productos')) return 'Productos';
  if (pathname.startsWith('/contactos')) return 'Solicitudes';
  return 'Resumen';
};

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="admin-shell">
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">🌿 Verde Limón</div>
          <p className="sidebar-subtitle">Panel administrativo</p>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }: { isActive: boolean }) => `sidebar-link${isActive ? ' active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div>
            <strong>{user?.name ?? 'Administrador'}</strong>
            <p>{user?.email ?? 'admin@verdelimon.cl'}</p>
          </div>
          <button className="btn btn-danger" onClick={logout}>
            Salir
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Administración</p>
            <h2 className="page-title">{getPageTitle(location.pathname)}</h2>
          </div>
          <div className="nav-actions">
            <span>Bienvenido, <strong>{user?.name}</strong></span>
            <button className="btn btn-ghost" onClick={logout}>Cerrar sesión</button>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
