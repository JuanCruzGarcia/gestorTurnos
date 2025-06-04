import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function AgregarCancha() {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [clubes, setClubes] = useState([]);
  const [idClub, setIdClub] = useState('');

  useEffect(() => {
    const fetchClubes = async () => {
      const querySnapshot = await getDocs(collection(db, 'clubes'));
      const clubesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClubes(clubesData);
    };

    fetchClubes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'canchas'), {
        nombre,
        tipo,
        idClub
      });

      alert('Cancha creada con éxito');
      setNombre('');
      setTipo('');
      setIdClub('');
    } catch (error) {
      console.error('Error al crear cancha:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Agregar Cancha</h2>

      <select
        value={idClub}
        onChange={(e) => setIdClub(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      >
        <option value="">Seleccionar club</option>
        {clubes.map((club) => (
          <option key={club.id} value={club.id}>{club.nombre}</option>
        ))}
      </select>

      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de la cancha"
        className="w-full p-2 border rounded mb-2"
        required
      />

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      >
        <option value="">Seleccionar tipo</option>
        <option value="dobles">Dobles</option>
        <option value="singles">Singles</option>
      </select>

      <button type="submit" className="bg-green-600 text-white w-full p-2 rounded">
        Crear Cancha
      </button>
    </form>
  );
}
