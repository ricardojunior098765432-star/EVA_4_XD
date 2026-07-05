export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'Pendiente' | 'En revisión' | 'Respondido' | 'Cerrado';
}

export interface User {
  id: string;
  name: string;
  email: string;
}