import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { ContactRequest } from '../types';
import { useAuth } from '../../context/AuthContext';

const ContactList = () => {
  const { user, logout } = useAuth();
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('contactRequests');
    if (saved) {
      setContacts(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contactRequests', JSON.stringify(contacts));
  }, [contacts]);

  const deleteContact = (id: string) => {
    if (window.confirm('¿Eliminar esta solicitud?')) {
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    }
  };

  const updateStatus = (id: string, status: ContactRequest['status']) => {
    setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, status } : contact)));
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => !filterStatus || contact.status === filterStatus);
  }, [contacts, filterStatus]);

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">Atención al cliente</p>
          <h1 className="page-title">Solicitudes de contacto</h1>
          <p className="page-subtitle">Revisa y prioriza mensajes entrantes de forma ordenada.</p>
        </div>
        <div className="nav-actions">
          <span>Bienvenido, <strong>{user?.name}</strong></span>
          <button onClick={logout} className="btn btn-danger">Cerrar sesión</button>
        </div>
      </header>

      <div className="panel" style={{ marginBottom: '20px' }}>
        <div className="panel-header">
          <h2>Solicitudes</h2>
          <Link to="/" className="btn btn-ghost">← Volver al panel</Link>
        </div>

        <div className="toolbar">
          <label style={{ fontWeight: '700', color: '#374151' }}>Filtrar por estado</label>
          <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ maxWidth: '240px' }}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En revisión">En revisión</option>
            <option value="Respondido">Respondido</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0 }}>{contact.name}</h3>
                <p style={{ margin: '4px 0 0', color: '#4b5563' }}>{contact.email} • {contact.phone}</p>
              </div>
              <span className="pill">{contact.status}</span>
            </div>
            <p style={{ margin: '8px 0 12px', color: '#374151' }}>{contact.message}</p>
            <div className="controls">
              <select value={contact.status} onChange={(e) => updateStatus(contact.id, e.target.value as ContactRequest['status'])} className="form-select" style={{ maxWidth: '220px' }}>
                <option value="Pendiente">Pendiente</option>
                <option value="En revisión">En revisión</option>
                <option value="Respondido">Respondido</option>
                <option value="Cerrado">Cerrado</option>
              </select>
              <button onClick={() => deleteContact(contact.id)} className="btn btn-danger">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && <p className="empty-state">No hay solicitudes registradas.</p>}
    </div>
  );
};

export default ContactList;
