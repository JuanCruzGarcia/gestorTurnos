import React from 'react';
import { Link } from 'react-router-dom';

const clubes = [
  { id: 1, nombre: 'Club Padel Norte' },
  { id: 2, nombre: 'Zona Pádel' }
];

export default function ClubList() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Clubes disponibles</h1>
      <ul>
        {clubes.map((club) => (
          <li key={club.id} className="mb-2">
            <Link to={`/club/${club.id}`} className="text-blue-500 underline">{club.nombre}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
