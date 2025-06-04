import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ClubList from './pages/ClubList';
import ClubDetail from './pages/ClubDetail';
import DashboardUser from './pages/user/DashboardUser';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import DashboardSuperAdmin from './pages/superadmin/DashboardSuperAdmin';
import AgregarClub from './pages/superadmin/AgregarClub';
import AgregarCancha from './pages/admin/AgregarCanchas';
import CrearTurno from './pages/admin/CrearTurno';
import ReservarTurno from './pages/user/ReservarTurno';
import UsuarioxRol from './pages/superadmin/ListadoUsuario';

function App() {
  const role = localStorage.getItem('role');

  return (
    <Routes>
      <Route path="/" element={<ClubList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/club/:id" element={<ClubDetail />} />

      {role === 'user' && (
        <>
          <Route path="/user/dashboard" element={<DashboardUser />} />
          <Route path="/user/reservar" element={<ReservarTurno />} />
        </>
      )}
      {role === 'admin' && (
        <>
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/agregar-cancha" element={<AgregarCancha />} />
          <Route path="/admin/crear-turno" element={<CrearTurno />} />
        </>
      )}
      {role === 'superadmin' && (
        <>
          <Route path="/superadmin/dashboard" element={<DashboardSuperAdmin />} />
          <Route path="/superadmin/agregar-club" element={<AgregarClub />} />
          <Route path="/superadmin/usuarioxrol" element={<UsuarioxRol />} />
        </>
      )}

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;