import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase'; // Asegurate de tener este archivo con tu `initializeApp`

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const refUsuario = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(refUsuario);

      if (!docSnap.exists()) {
        // Si no existe, se crea como user por defecto
        await setDoc(refUsuario, {
          email: user.email,
          rol: 'user',
          clubes: [] // array vacío por si se asignan clubes después
        });
      }

      // Obtener los datos actualizados
      const finalSnap = await getDoc(refUsuario);
      const datos = finalSnap.data();
      const rol = datos.rol;
      localStorage.setItem('role', rol);

      if (rol === 'admin') navigate('/admin/dashboard');
      else if (rol === 'superadmin') navigate('/superadmin/dashboard');
      else navigate('/user/dashboard');

    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Iniciar sesión</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 w-full rounded">
        Iniciar sesión con Google
      </button>
    </div>
  );
}
