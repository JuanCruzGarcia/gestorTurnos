import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Asegurate de que esta ruta esté bien
import { Link } from 'react-router-dom';

export default function ClubList() {
  const [clubes, setClubes] = useState([]);

  useEffect(() => {
    const fetchClubes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'clubes'));
        const clubesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClubes(clubesData);
      } catch (error) {
        console.error('Error al obtener clubes:', error);
      }
    };

    fetchClubes();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clubes disponibles</h1>
      {clubes.length === 0 ? (
        <p>No hay clubes disponibles en este momento.</p>
      ) : (
        <ul className="space-y-4">
          {clubes.map((club) => (
            <li key={club.id} className="border p-3 rounded shadow">
              <Link to={`/club/${club.id}`} className="text-lg text-blue-600 font-semibold underline">
                {club.nombre}
              </Link>
              <p className="text-gray-700">📍 {club.ubicacion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
