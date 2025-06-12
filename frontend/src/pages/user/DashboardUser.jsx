import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';

export default function DashboardUser() {
  const [misTurnos, setMisTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMisTurnos = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const turnosQuery = query(
          collection(db, 'turnos'),
          where('estado', '==', 'reservado'),
          where('usuario.uid', '==', user.uid)
        );
        const snapshot = await getDocs(turnosQuery);
        const turnos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setMisTurnos(turnos);
      } catch (error) {
        console.error('Error al obtener turnos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMisTurnos();
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const turnosOrdenados = [...misTurnos].sort((a, b) => {
    const fechaA = new Date(a.fecha);
    const fechaB = new Date(b.fecha);
    return fechaB - fechaA;
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Panel del Usuario</h1>
      <p>Aquí el usuario ve sus turnos y reservas</p>

      <div className="mt-4">
        <Link to="/user/reservar" className="text-blue-600 underline">
          📅 Ver y reservar turnos
        </Link>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Mis Turnos Reservados</h2>
        {loading ? (
          <p>Cargando turnos...</p>
        ) : turnosOrdenados.length === 0 ? (
          <p>No tenés turnos reservados.</p>
        ) : (
          <ul className="space-y-4 mt-2">
            {turnosOrdenados.map(turno => {
              const fechaTurno = new Date(turno.fecha);
              const esPasado = fechaTurno < hoy;

              return (
                <li
                  key={turno.id}
                  className={`border p-3 rounded shadow transition ${
                    esPasado ? 'bg-gray-200 text-gray-500' : 'bg-white'
                  }`}
                >
                  <p>📅 Fecha: {turno.fecha}</p>
                  <p>⏰ Hora: {turno.hora}</p>
                  <p>📝 Estado: {turno.estado}</p>
                  <p>🆔 Cancha: {turno.idCancha}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}