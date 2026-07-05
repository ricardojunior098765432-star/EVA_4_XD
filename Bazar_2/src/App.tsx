import type { ReactNode } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import ProductDetail from './pages/Products/ProductDetail';
import ContactList from './pages/Contacts/ContactList';
import ContactForm from './pages/Contacts/ContactForm';
import AdminLayout from './components/AdminLayout';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="page-container">Cargando...</div>;
  }

  return user ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/productos" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
          <Route path="/productos/nuevo" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/productos/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
          <Route path="/productos/editar/:id" element={<ProtectedRoute><ProductForm /></ProtectedRoute>} />
          <Route path="/contactos" element={<ProtectedRoute><ContactList /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;