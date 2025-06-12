import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';
import { format, addDays, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export default function ReservarTurno() {
  const [turnos, setTurnos] = useState([]);
  const [canchasMap, setCanchasMap] = useState({});
  const [clubesMap, setClubesMap] = useState({});
  const [clubSeleccionado, setClubSeleccionado] = useState(null);
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionadaIndex, setFechaSeleccionadaIndex] = useState(0);

  useEffect(() => {
    const fetchDatos = async () => {
      // Generar los próximos 7 días desde hoy
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechas = Array.from({ length: 7 }, (_, i) => {
        const date = addDays(hoy, i);
        return format(date, 'yyyy-MM-dd');
      });
      setFechasDisponibles(fechas);

      // Traer turnos disponibles
      const turnosQuery = query(collection(db, 'turnos'), where('estado', '==', 'disponible'));
      const turnosSnapshot = await getDocs(turnosQuery);
      const turnosData = turnosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filtrar turnos entre hoy y 7 días adelante
      const turnosFiltrados = turnosData.filter(t => fechas.includes(t.fecha));

      // Traer canchas
      const canchasSnapshot = await getDocs(collection(db, 'canchas'));
      const canchasData = canchasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const canchasMap = {};
      canchasData.forEach(c => canchasMap[c.id] = c);
      setCanchasMap(canchasMap);

      // Traer clubes
      const clubesSnapshot = await getDocs(collection(db, 'clubes'));
      const clubesData = clubesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const clubesMap = {};
      clubesData.forEach(c => clubesMap[c.id] = c);
      setClubesMap(clubesMap);

      // Enriquecer turnos con info de cancha y club
      const turnosEnriquecidos = turnosFiltrados.map(turno => {
        const cancha = canchasMap[turno.idCancha];
        const club = cancha ? clubesMap[cancha.idClub] : null;

        return {
          ...turno,
          idClub: cancha?.idClub || '',
          nombreCancha: cancha?.nombre || 'Desconocido',
          nombreClub: club?.nombre || 'Desconocido'
        };
      });

      setTurnos(turnosEnriquecidos);
    };

    fetchDatos();
  }, []);

  const handleReserva = async (turnoId) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('Debes iniciar sesión');
      return;
    }

    try {
      const refTurno = doc(db, 'turnos', turnoId);
      await updateDoc(refTurno, {
        estado: 'reservado',
        usuario: {
          uid: user.uid,
          email: user.email
        }
      });

      alert('Turno reservado con éxito');
      setTurnos(prev => prev.filter(t => t.id !== turnoId));
    } catch (error) {
      console.error('Error al reservar turno:', error);
    }
  };

  const cambiarFecha = (direccion) => {
    const nuevoIndex = fechaSeleccionadaIndex + direccion;
    if (nuevoIndex >= 0 && nuevoIndex < fechasDisponibles.length) {
      setFechaSeleccionadaIndex(nuevoIndex);
    }
  };

  const fechaSeleccionada = fechasDisponibles[fechaSeleccionadaIndex];
  const clubesConTurnos = [...new Set(turnos.map(t => t.idClub))];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Reservar Turno</h2>

      {!clubSeleccionado ? (
        <>
          {clubesConTurnos.length === 0 ? (
            <p>No hay turnos disponibles desde hoy hasta los próximos 7 días.</p>
          ) : (
            <ul className="space-y-4">
              {clubesConTurnos.map(idClub => (
                <li
                  key={idClub}
                  className="border p-3 rounded shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => setClubSeleccionado(idClub)}
                >
                  🏟️ <strong>{clubesMap[idClub]?.nombre || 'Club desconocido'}</strong>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <button
            onClick={() => setClubSeleccionado(null)}
            className="mb-4 px-3 py-1 bg-gray-300 rounded"
          >
            ← Volver a clubes
          </button>

          <h3 className="text-lg font-semibold mb-2">
            Turnos en {clubesMap[clubSeleccionado]?.nombre}
          </h3>

          {/* Navegador de fechas */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => cambiarFecha(-1)}
              disabled={fechaSeleccionadaIndex === 0}
            >
              ◀
            </button>
            <span className="font-semibold text-lg">
              {format(parseISO(fechaSeleccionada), 'dd/MM/yyyy', { locale: es })}
            </span>
            <button
              className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => cambiarFecha(1)}
              disabled={fechaSeleccionadaIndex === fechasDisponibles.length - 1}
            >
              ▶
            </button>
          </div>

          {/* Turnos del día */}
          <ul className="space-y-4">
            {turnos
              .filter(t => t.idClub === clubSeleccionado && t.fecha === fechaSeleccionada)
              .sort((a, b) => a.hora.localeCompare(b.hora))
              .map(turno => (
                <li key={turno.id} className="border p-3 rounded shadow">
                  <p>🎾 Cancha: <strong>{turno.nombreCancha}</strong></p>
                  <p>📅 Fecha: {turno.fecha}</p>
                  <p>⏰ Hora: {turno.hora}</p>
                  <button
                    onClick={() => handleReserva(turno.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded mt-2"
                  >
                    Reservar Turno
                  </button>
                </li>
              ))}
          </ul>

          {turnos.filter(t => t.idClub === clubSeleccionado && t.fecha === fechaSeleccionada).length === 0 && (
            <p className="text-center text-gray-500 mt-4">No hay turnos disponibles para este día.</p>
          )}
        </>
      )}
    </div>
  );
}
