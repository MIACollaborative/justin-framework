import { Link } from 'react-router-dom';
import Feed from './Feed';

const Admin = () => {
  return (
    <section>
      <h1>Admins Page</h1>
      <br />
      <Feed />
      <br />
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Admin;
