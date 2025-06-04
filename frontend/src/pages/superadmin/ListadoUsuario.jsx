import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function ListadoUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [clubesDisponibles, setClubesDisponibles] = useState([]);
  const [clubesSeleccionadosTemporal, setClubesSeleccionadosTemporal] = useState({});

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
      const usuariosData = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(usuariosData);
    };

    const fetchClubes = async () => {
      const clubesSnapshot = await getDocs(collection(db, 'clubes'));
      const clubesData = clubesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setClubesDisponibles(clubesData);
    };

    fetchUsuarios();
    fetchClubes();
  }, []);

  const handleRolChange = async (uid, nuevoRol) => {
    const userRef = doc(db, 'usuarios', uid);
    const updated = { rol: nuevoRol };

    if (nuevoRol !== 'admin') {
      updated.clubes = [];
    }

    await updateDoc(userRef, updated);
    setUsuarios(prev => prev.map(u => u.id === uid ? { ...u, ...updated } : u));

    // Limpiar clubes temporales si cambia de admin a otro rol
    if (nuevoRol !== 'admin') {
      setClubesSeleccionadosTemporal(prev => {
        const copy = { ...prev };
        delete copy[uid];
        return copy;
      });
    }
  };

  const handleClubChange = async (uid, clubesSeleccionados) => {
    const userRef = doc(db, 'usuarios', uid);
    await updateDoc(userRef, { clubes: clubesSeleccionados });
    setUsuarios(prev => prev.map(u => u.id === uid ? { ...u, clubes: clubesSeleccionados } : u));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Panel del SuperAdmin</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Email</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Clubes asignados</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <select
                  value={user.rol}
                  onChange={(e) => handleRolChange(user.id, e.target.value)}
                  className="border px-2 py-1"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">SuperAdmin</option>
                </select>
              </td>
              <td className="p-2">
                {user.rol === 'admin' ? (
                  <div className="flex gap-2 items-center">
                    <select
                      multiple
                      value={clubesSeleccionadosTemporal[user.id] || user.clubes || []}
                      onChange={(e) => {
                        const options = Array.from(e.target.selectedOptions, opt => opt.value);
                        setClubesSeleccionadosTemporal(prev => ({ ...prev, [user.id]: options }));
                      }}
                      className="border p-1 w-full"
                    >
                      {clubesDisponibles.map((club) => (
                        <option key={club.id} value={club.id}>{club.nombre}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        const clubesParaGuardar = clubesSeleccionadosTemporal[user.id] || [];
                        handleClubChange(user.id, clubesParaGuardar);
                        setClubesSeleccionadosTemporal(prev => {
                          const copy = { ...prev };
                          delete copy[user.id];
                          return copy;
                        });
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Agregar
                    </button>
                  </div>
                ) : (
                  <em className="text-gray-500">-</em>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
