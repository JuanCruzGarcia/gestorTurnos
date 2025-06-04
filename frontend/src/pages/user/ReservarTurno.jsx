import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';

export default function ReservarTurno() {
  const [turnos, setTurnos] = useState([]);

  useEffect(() => {
    const fetchTurnos = async () => {
      const q = query(collection(db, 'turnos'), where('estado', '==', 'disponible'));
      const snapshot = await getDocs(q);
      const datos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTurnos(datos);
    };

    fetchTurnos();
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Turnos Disponibles</h2>
      {turnos.length === 0 && <p>No hay turnos disponibles en este momento.</p>}
      <ul className="space-y-4">
        {turnos.map(turno => (
          <li key={turno.id} className="border p-3 rounded shadow">
            <p>📍 Cancha: {turno.idCancha}</p>
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
    </div>
  );
}
