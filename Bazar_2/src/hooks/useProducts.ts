import { useCallback, useState } from 'react';
import type { Product } from '../types';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const productsCollection = db ? collection(db, 'products') : null;

const getLocalProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem('products');
    return saved ? (JSON.parse(saved) as Product[]) : [];
  } catch {
    return [];
  }
};

const setLocalProducts = (products: Product[]) => {
  localStorage.setItem('products', JSON.stringify(products));
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !productsCollection) {
      setProducts(getLocalProducts());
      setLoading(false);
      return;
    }

    try {
      const q = query(productsCollection, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      setProducts(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) })));
    } catch (err) {
      setError('Error al cargar productos.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (product: Omit<Product, 'id'>) => {
    setLoading(true);
    setError(null);
    const newProduct = { ...product, id: `${Date.now()}`, createdAt: product.createdAt ?? new Date().toISOString() };

    if (!isFirebaseConfigured || !productsCollection) {
      const current = getLocalProducts();
      const next = [newProduct, ...current];
      setLocalProducts(next);
      setProducts(next);
      setLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: product.createdAt ?? new Date().toISOString(),
      });
      setProducts((prev) => [{ id: docRef.id, ...product, createdAt: product.createdAt ?? new Date().toISOString() }, ...prev]);
    } catch (err) {
      setError('Error al crear producto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (product: Product) => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !db) {
      const current = getLocalProducts();
      const next = current.map((item) => (item.id === product.id ? product : item));
      setLocalProducts(next);
      setProducts(next);
      setLoading(false);
      return;
    }

    try {
      const productDoc = doc(db, 'products', product.id);
      await updateDoc(productDoc, {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        imageUrl: product.imageUrl ?? '',
      });
      setProducts((prev) => prev.map((item) => (item.id === product.id ? product : item)));
    } catch {
      setError('Error al actualizar producto.');
      throw new Error('update-error');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !db) {
      const current = getLocalProducts();
      const next = current.filter((product) => product.id !== id);
      setLocalProducts(next);
      setProducts(next);
      setLoading(false);
      return;
    }

    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch {
      setError('Error al eliminar producto.');
      throw new Error('delete-error');
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async (id: string) => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !db) {
      const current = getLocalProducts();
      const found = current.find((item) => item.id === id) ?? null;
      setLoading(false);
      return found;
    }

    try {
      const productDoc = await getDoc(doc(db, 'products', id));
      if (!productDoc.exists()) {
        return null;
      }
      return { id: productDoc.id, ...(productDoc.data() as Omit<Product, 'id'>) };
    } catch {
      setError('Error al obtener producto.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    loadProducts,
    createProduct,
    updateProduct,
    removeProduct,
    getProduct,
  };
};
