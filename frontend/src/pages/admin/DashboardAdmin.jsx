import React from 'react';
import { Link } from 'react-router-dom';
export default function DashboardSuperAdmin() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Panel del Admin</h1>
      <p>Aquí se administran los clubes y se asignan roles</p>
      <div className="mt-4 space-y-2">
        <Link to="/admin/agregar-cancha" className="text-blue-600 underline block">➕ Agregar Cancha</Link>
        <Link to="/admin/crear-turno" className="text-blue-600 underline block">📅 Crear Turno</Link>
    </div>
    </div>
  );
}
