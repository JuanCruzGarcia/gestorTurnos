import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { auth } from '../../firebase/firebase'; // Asegurate de importar auth si usás Firebase Auth

export default function CrearTurno() {
  const [clubes, setClubes] = useState([]);
  const [canchas, setCanchas] = useState([]);
  const [clubSeleccionado, setClubSeleccionado] = useState('');
  const [idCancha, setIdCancha] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  // Obtener clubes asignados al usuario actual
  useEffect(() => {
    const fetchClubesAsignados = async () => {
      const userEmail = auth.currentUser?.email;
      const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
      const userDoc = usuariosSnapshot.docs.find(doc => doc.data().email === userEmail);
      
      if (userDoc) {
        const clubesAsignadosIds = userDoc.data().clubes || [];

        if (clubesAsignadosIds.length) {
          const clubesSnapshot = await getDocs(collection(db, 'clubes'));
          const clubesAsignados = clubesSnapshot.docs
            .filter(doc => clubesAsignadosIds.includes(doc.id))
            .map(doc => ({ id: doc.id, ...doc.data() }));
          
          setClubes(clubesAsignados);
        }
      }
    };

    fetchClubesAsignados();
  }, []);

  // Obtener canchas del club seleccionado
  useEffect(() => {
    const fetchCanchas = async () => {
      if (!clubSeleccionado) {
        setCanchas([]);
        return;
      }

      const canchasRef = collection(db, 'canchas');
      const q = query(canchasRef, where('idClub', '==', clubSeleccionado));
      const snapshot = await getDocs(q);

      const canchasData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCanchas(canchasData);
    };

    fetchCanchas();
  }, [clubSeleccionado]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'turnos'), {
        idCancha,
        fecha,
        hora,
        estado: 'disponible',
        usuario: null
      });

      alert('Turno creado con éxito');
      setClubSeleccionado('');
      setIdCancha('');
      setFecha('');
      setHora('');
    } catch (error) {
      console.error('Error al crear turno:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Crear Turno</h2>

      {/* Selección de club */}
      <select
        value={clubSeleccionado}
        onChange={(e) => {
          setClubSeleccionado(e.target.value);
          setIdCancha('');
        }}
        className="w-full p-2 border rounded mb-2"
        required
      >
        <option value="">Seleccionar club</option>
        {clubes.map((club) => (
          <option key={club.id} value={club.id}>{club.nombre}</option>
        ))}
      </select>

      {/* Selección de cancha (si hay club seleccionado) */}
      {clubSeleccionado && (
        <select
          value={idCancha}
          onChange={(e) => setIdCancha(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          required
        >
          <option value="">Seleccionar cancha</option>
          {canchas.map((cancha) => (
            <option key={cancha.id} value={cancha.id}>{cancha.nombre}</option>
          ))}
        </select>
      )}

      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <input
        type="time"
        value={hora}
        onChange={(e) => setHora(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        required
      />

      <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
        Crear Turno
      </button>
    </form>
  );
}
