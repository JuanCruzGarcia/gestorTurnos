import React, { useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AgregarClub() {
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'clubes'), { nombre, ubicacion });
      alert('Club agregado con éxito');
      setNombre('');
      setUbicacion('');
    } catch (error) {
      console.error('Error al agregar club:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Agregar Club</h2>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del club"
        className="w-full p-2 border rounded mb-2"
      />
      <input
        type="text"
        value={ubicacion}
        onChange={(e) => setUbicacion(e.target.value)}
        placeholder="Ubicación"
        className="w-full p-2 border rounded mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">
        Agregar
      </button>
    </form>
  );
}
