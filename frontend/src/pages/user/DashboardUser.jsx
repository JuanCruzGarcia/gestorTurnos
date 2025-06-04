import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardUser() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Panel del Usuario</h1>
      <p>Aquí el usuario ve sus turnos y reservas</p>
      
        <div className="mt-4">
        <Link to="/user/reservar" className="text-blue-600 underline">📅 Ver y reservar turnos</Link>
        </div>
    </div>
  );
}
