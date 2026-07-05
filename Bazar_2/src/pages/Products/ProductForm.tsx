import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Product } from '../types';

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    createdAt: new Date().toISOString()
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (isEditing && id) {
      const saved = localStorage.getItem('products');
      if (saved) {
        const products: Product[] = JSON.parse(saved);
        const found = products.find(p => p.id === id);
        if (found) setFormData(found);
      }
    }
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['price', 'stock'].includes(name) ? Number(value) : value
    }));
  };

  const validate = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "El nombre es obligatorio";
    if (!formData.description) newErrors.description = "La descripción es obligatoria";
    if (!formData.category) newErrors.category = "Selecciona una categoría";
    if (formData.price <= 0) newErrors.price = "El precio debe ser mayor a 0";
    if (formData.stock < 0) newErrors.stock = "El stock no puede ser negativo";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const saved = localStorage.getItem('products');
    let products: Product[] = saved ? JSON.parse(saved) : [];

    if (isEditing) {
      products = products.map(p => p.id === id ? formData : p);
    } else {
      const newProduct = { ...formData, id: Date.now().toString() };
      products.push(newProduct);
    }

    localStorage.setItem('products', JSON.stringify(products));
    navigate('/productos');
  };

  return (
    <div className="page-container">
      <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="panel-header" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2 style={{ margin: 0 }}>{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          </div>
          <span className="pill">{isEditing ? 'Edición' : 'Creación'}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ fontWeight: 'bold' }}>Nombre del Producto</label>
            <input className="form-input" type="text" name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <small style={{ color: 'red' }}>{errors.name}</small>}
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Descripción</label>
            <textarea className="form-textarea" name="description" value={formData.description} onChange={handleChange} rows={5} />
            {errors.description && <small style={{ color: 'red' }}>{errors.description}</small>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ fontWeight: 'bold' }}>Precio ($)</label>
              <input className="form-input" type="number" name="price" value={formData.price} onChange={handleChange} />
              {errors.price && <small style={{ color: 'red' }}>{errors.price}</small>}
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>Stock</label>
              <input className="form-input" type="number" name="stock" value={formData.stock} onChange={handleChange} />
              {errors.stock && <small style={{ color: 'red' }}>{errors.stock}</small>}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Categoría</label>
            <select className="form-select" name="category" value={formData.category} onChange={handleChange}>
              <option value="">Selecciona...</option>
              <option value="Alimentos">Alimentos Saludables</option>
              <option value="Eco">Productos Ecológicos</option>
              <option value="Bienestar">Bienestar</option>
              <option value="Libros">Libros</option>
              <option value="Otros">Otros</option>
            </select>
            {errors.category && <small style={{ color: 'red' }}>{errors.category}</small>}
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>URL de Imagen (opcional)</label>
            <input className="form-input" type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
            <small style={{ color: '#6b7280' }}>Puedes usar una URL pública para mostrar una imagen del producto.</small>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Guardar Cambios' : 'Crear Producto'}</button>
            <button type="button" onClick={() => navigate('/productos')} className="btn btn-ghost" style={{ flex: 1 }}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;