import { Container } from 'react-bootstrap';

import RegisterStaff from './pages/RegisterStaff';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './components/Layout';
import Staff from './pages/Staff';
import Admin from './pages/Admin';
import Missing from './pages/Missing';
import Unauthorized from './pages/Unauthorized';
import Lounge from './pages/Lounge';
import LinkPage from './pages/LinkPage';
import RequireAuth from './components/RequireAuth';
import { Routes, Route } from 'react-router-dom';
import ParticipantPage from './pages/Participant/ParticipantPage';
import RegisterParticipant from './pages/RegisterParticipant';

// TODO: use API to query backend for role values
const ROLES = {
  Admin: 1999,
  Staff: 1984,
  Participant: 2001
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        {/* <Route path="bootstrap" element={<NavComponent />} /> */}

        {/* we want to protect these routes */}
        {/* TODO: require that <Home /> is protected */}
        <Route
          element={
            <RequireAuth
              allowedRoles={[ROLES.Participant, ROLES.Staff, ROLES.Admin]}
            />
          }
        >
          <Route path="/" element={<Home />} />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.Staff]} />}
        >
          <Route
            path="register-participant"
            element={<RegisterParticipant />}
          />
          <Route path="participant/:username" element={<ParticipantPage />} />
          <Route path="staff" element={<Staff />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          {/* TODO: change to only ROLES.Admin and test */}
          <Route path="register-staff" element={<RegisterStaff />} />
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route
          element={<RequireAuth allowedRoles={[ROLES.Staff, ROLES.Admin]} />}
        >
          <Route path="lounge" element={<Lounge />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
