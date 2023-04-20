import { Link } from 'react-router-dom';

const Staff = () => {
  return (
    <section>
      <h1>Staff Page</h1>
      <br />
      <p>You must have been assigned an Staff role.</p>
      <div className="flexGrow">
        <Link to="/">Home</Link>
      </div>
    </section>
  );
};

export default Staff;
