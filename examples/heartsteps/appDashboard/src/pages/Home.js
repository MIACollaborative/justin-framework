import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import Feed from './Feed';
import { Container, Button, Row, Col } from 'react-bootstrap';

const Home = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const logout = async () => {
    // if used in more components, this should be in context
    // axios to /logout endpoint
    setAuth({});
    navigate('/login');
  };

  return (
    <>
      <Feed />
    </>
  );
};

export default Home;
