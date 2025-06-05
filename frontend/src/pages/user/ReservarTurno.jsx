import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getAuth } from 'firebase/auth';

export default function ReservarTurno() {
  const [turnos, setTurnos] = useState([]);
  const [canchasMap, setCanchasMap] = useState({});
  const [clubesMap, setClubesMap] = useState({});

  useEffect(() => {
    const fetchDatos = async () => {
      // 1. Traer turnos disponibles
      const turnosQuery = query(collection(db, 'turnos'), where('estado', '==', 'disponible'));
      const turnosSnapshot = await getDocs(turnosQuery);
      const turnosData = turnosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2. Traer canchas
      const canchasSnapshot = await getDocs(collection(db, 'canchas'));
      const canchasData = canchasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const canchasMap = {};
      canchasData.forEach(c => canchasMap[c.id] = c);
      setCanchasMap(canchasMap);

      // 3. Traer clubes
      const clubesSnapshot = await getDocs(collection(db, 'clubes'));
      const clubesData = clubesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      const clubesMap = {};
      clubesData.forEach(c => clubesMap[c.id] = c);
      setClubesMap(clubesMap);

      // 4. Enriquecer turnos con nombres
      const turnosEnriquecidos = turnosData.map(turno => {
        const cancha = canchasMap[turno.idCancha];
        const club = cancha ? clubesMap[cancha.idClub] : null;

        return {
          ...turno,
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

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Turnos Disponibles</h2>
      {turnos.length === 0 && <p>No hay turnos disponibles en este momento.</p>}
      <ul className="space-y-4">
        {turnos.map(turno => (
          <li key={turno.id} className="border p-3 rounded shadow">
            <p>🏟️ Club: <strong>{turno.nombreClub}</strong></p>
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
    </div>
  );
}
