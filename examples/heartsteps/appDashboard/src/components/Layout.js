import { Outlet } from 'react-router-dom';
import NavComponent from './NavComponent';

const Layout = () => {
  return (
    <main className="App">
      <NavComponent />
      <Outlet />
    </main>
  );
};

export default Layout;
