import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { format, addDays, isEqual, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale'; // Para formatear en español si lo necesitás

const horasDelDia = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function ClubDetail() {
  const { id } = useParams();
  const [canchas, setCanchas] = useState([]);
  const [turnos, setTurnos] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(startOfDay(new Date()));

  // Generamos fechas desde hoy hasta 6 días posteriores (7 días en total)
  const fechasDisponibles = Array.from({ length: 7 }, (_, i) =>
  startOfDay(addDays(new Date(), i))
);

  useEffect(() => {
    const fetchCanchasYTurnos = async () => {
      try {
        const canchasSnapshot = await getDocs(query(collection(db, 'canchas'), where('idClub', '==', id)));
        const canchasData = canchasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCanchas(canchasData);

        const canchaIds = canchasData.map(c => c.id);
        if (canchaIds.length > 0) {
          const turnosSnapshot = await getDocs(query(collection(db, 'turnos'), where('idCancha', 'in', canchaIds)));
          const turnosData = turnosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setTurnos(turnosData);
        }
      } catch (err) {
        console.error('Error cargando datos:', err);
      }
    };

    fetchCanchasYTurnos();
  }, [id]);

  const getTurno = (idCancha, hora) => {
    const fechaStr = format(fechaSeleccionada, 'yyyy-MM-dd');
    return turnos.find(t =>
      t.idCancha === idCancha &&
      t.fecha === fechaStr &&
      t.hora === hora
    );
  };

const cambiarFecha = (direccion) => {
  const indexActual = fechasDisponibles.findIndex(f =>
    isEqual(startOfDay(f), startOfDay(fechaSeleccionada))
  );
  const nuevoIndex = indexActual + direccion;

  if (nuevoIndex >= 0 && nuevoIndex < fechasDisponibles.length) {
    setFechaSeleccionada(fechasDisponibles[nuevoIndex]);
  }
};

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-xl font-bold mb-4">Turnos - Club ID {id}</h1>

      {/* Selector de fecha */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => cambiarFecha(-1)}
          disabled={isEqual(fechaSeleccionada, fechasDisponibles[0])}
        >
          ◀
        </button>
        <span className="font-semibold text-lg">
          {format(fechaSeleccionada, 'dd/MM/yyyy', { locale: es })}
        </span>
        <button
          className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => cambiarFecha(1)}
          disabled={isEqual(fechaSeleccionada, fechasDisponibles[fechasDisponibles.length - 1])}
        >
          ▶
        </button>
      </div>

      {/* Tabla de turnos */}
      <div className="min-w-[900px] border rounded overflow-hidden">
        <div className="grid grid-cols-[200px_repeat(15,1fr)] border-b bg-gray-100">
          <div className="p-2 font-semibold">Cancha</div>
          {horasDelDia.map((hora) => (
            <div key={hora} className="p-2 text-center font-semibold text-sm border-l">{hora}</div>
          ))}
        </div>

        {canchas.map((cancha) => (
          <div key={cancha.id} className="grid grid-cols-[200px_repeat(15,1fr)] border-b">
            <div className="p-2 font-medium border-r">{cancha.nombre}</div>
            {horasDelDia.map((hora) => {
              const turno = getTurno(cancha.id, hora);
              const estado = turno ? turno.estado : 'no-habilitado';
              return (
                <div
                  key={hora}
                  className={`h-10 border-l flex items-center justify-center text-xs cursor-pointer transition 
                    ${estado !== 'disponible'
                      ? 'bg-gray-500 text-white cursor-not-allowed'
                      : 'bg-white hover:bg-green-400 hover:text-white'}`}
                >
                  {estado === 'disponible' ? 'Disponible' : 'No disponible'}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        ℹ️ Las reservas se pueden realizar hasta con seis días de antelación.
      </div>
    </div>
  );
}
