import React from 'react';
import { useParams } from 'react-router-dom';

export default function ClubDetail() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Turnos disponibles - Club ID {id}</h1>
      <p>Aquí iría el calendario con los horarios y la opción de reservar</p>
    </div>
  );
}
