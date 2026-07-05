import { useCallback, useEffect, useState } from 'react';
import type { ContactRequest } from '../types';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  orderBy,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const contactsCollection = db ? collection(db, 'contactRequests') : null;

const getLocalContacts = (): ContactRequest[] => {
  try {
    const saved = localStorage.getItem('contactRequests');
    return saved ? (JSON.parse(saved) as ContactRequest[]) : [];
  } catch {
    return [];
  }
};

const setLocalContacts = (contacts: ContactRequest[]) => {
  localStorage.setItem('contactRequests', JSON.stringify(contacts));
};

export const useContacts = () => {
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !contactsCollection) {
      setContacts(getLocalContacts());
      setLoading(false);
      return;
    }

    try {
      const q = query(contactsCollection, orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      setContacts(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<ContactRequest, 'id'>) })));
    } catch {
      setError('Error al cargar solicitudes.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createContact = async (contact: Omit<ContactRequest, 'id'>) => {
    setLoading(true);
    setError(null);

    const newContact: ContactRequest = { ...contact, id: `${Date.now()}` };

    if (!isFirebaseConfigured || !contactsCollection) {
      const current = getLocalContacts();
      const next = [newContact, ...current];
      setLocalContacts(next);
      setContacts(next);
      setLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(contactsCollection, contact);
      setContacts((prev) => [{ id: docRef.id, ...contact }, ...prev]);
    } catch {
      setError('Error al registrar solicitud.');
      throw new Error('create-contact-error');
    } finally {
      setLoading(false);
    }
  };

  const updateContact = async (id: string, updates: Partial<ContactRequest>) => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !db) {
      const current = getLocalContacts();
      const next = current.map((contact) => (contact.id === id ? { ...contact, ...updates } : contact));
      setLocalContacts(next);
      setContacts(next);
      setLoading(false);
      return;
    }

    try {
      const contactDoc = doc(db, 'contactRequests', id);
      await updateDoc(contactDoc, updates);
      setContacts((prev) => prev.map((contact) => (contact.id === id ? { ...contact, ...updates } : contact)));
    } catch {
      setError('Error al actualizar solicitud.');
      throw new Error('update-contact-error');
    } finally {
      setLoading(false);
    }
  };

  const removeContact = async (id: string) => {
    setLoading(true);
    setError(null);

    if (!isFirebaseConfigured || !db) {
      const current = getLocalContacts();
      const next = current.filter((contact) => contact.id !== id);
      setLocalContacts(next);
      setContacts(next);
      setLoading(false);
      return;
    }

    try {
      await deleteDoc(doc(db, 'contactRequests', id));
      setContacts((prev) => prev.filter((contact) => contact.id !== id));
    } catch {
      setError('Error al eliminar solicitud.');
      throw new Error('delete-contact-error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    loadContacts,
    createContact,
    updateContact,
    removeContact,
  };
};
