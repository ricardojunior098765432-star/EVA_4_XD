import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ContactRequest } from '../types';

const ContactForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContactRequest>({
    id: '',
    name: '',
    email: '',
    phone: '',
    message: '',
    status: 'Pendiente',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const saved = localStorage.getItem('contactRequests');
    const contacts: ContactRequest[] = saved ? JSON.parse(saved) : [];
    const newContact = { ...formData, id: Date.now().toString() };
    contacts.push(newContact);
    localStorage.setItem('contactRequests', JSON.stringify(contacts));
    navigate('/contactos');
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="panel-header" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Contacto</p>
            <h2 style={{ margin: 0 }}>Formulario de contacto</h2>
          </div>
          <span className="pill">Nuevo mensaje</span>
        </div>
        <p style={{ textAlign: 'center', color: '#4b5563' }}>Tu mensaje será registrado en la administración de Verde Limón.</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: 12 }}>
          <div>
            <label style={{ fontWeight: '700' }}>Nombre</label>
            <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: '700' }}>Correo</label>
            <input className="form-input" type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: '700' }}>Teléfono</label>
            <input className="form-input" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label style={{ fontWeight: '700' }}>Mensaje</label>
            <textarea className="form-textarea" name="message" value={formData.message} onChange={handleChange} rows={5} />
          </div>

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Registrar solicitud</button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
