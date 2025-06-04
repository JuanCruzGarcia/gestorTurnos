import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardSuperAdmin() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Panel del SuperAdmin</h1>
      <div>
      <Link to="/superadmin/agregar-club" className="text-blue-500 underline">
        Agregar nuevo club
      </Link>
      </div>
      <div>
      <Link to="/superadmin/usuarioxrol" className="text-blue-500 underline">
        Usuario x Rol
      </Link>
      </div>
      <p>Aquí se administran los clubes y se asignan roles</p>
    </div>
  );
}