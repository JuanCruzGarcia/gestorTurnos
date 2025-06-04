import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function CrearTurno() {
  const [canchas, setCanchas] = useState([]);
  const [idCancha, setIdCancha] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  useEffect(() => {
    const fetchCanchas = async () => {
      const querySnapshot = await getDocs(collection(db, 'canchas'));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCanchas(data);
    };

    fetchCanchas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'turnos'), {
        idCancha,
        fecha,
        hora,
        estado: 'disponible',
        usuario: null
      });

      alert('Turno creado con éxito');
      setIdCancha('');
      setFecha('');
      setHora('');
    } catch (error) {
      console.error('Error al crear turno:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Crear Turno</h2>

      <select
        value={idCancha}
        onChange={(e) => setIdCancha(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      >
        <option value="">Seleccionar cancha</option>
        {canchas.map((cancha) => (
          <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
        ))}
      </select>

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
        Crear Turno
      </button>
    </form>
  );
}
