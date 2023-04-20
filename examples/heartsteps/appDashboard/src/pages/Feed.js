import { useState, useEffect } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Participant from './Participant/Participant';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';

const Feed = () => {
  const [users, setUsers] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    // controller is to cancel request if component unmounts
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users/participants/', {
          signal: controller.signal
        });
        const userObjs = response.data.map((user) => ({
          username: user.username,
          phone: user.whatsappNum,
          enrollmentDate: user.createdAt
            ? String(new Date(user.createdAt).toISOString().slice(0, 10))
            : null
        }));
        // TODO: SECURITY - DELETE LOG IN PRODUCTION
        console.log(response.data);
        if (isMounted) {
          setUsers(userObjs);
        }
      } catch (err) {
        console.log(err);
        /* 
        whenever a user's refresh token expires
        after they re-login, user is sent back to the last page they were on
        i.e. user sent back to /participant/john/name page instead of /home page
        */
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getUsers();

    // cleanup function, runs on Users component unmount
    return () => {
      isMounted = false;
      controller.abort(); // cancel any pending requests
    };
  }, []);

  return (
    <Table striped border hover>
      <thead>
        <th>Username</th>
        <th>WhatsApp Number</th>
        <th>Enrollment Date</th>
      </thead>
      <tbody>
        {users?.length ? (
          users.map((user, i) => (
            <tr key={i}>
              <td>
                <Link to={`/participant/${user.username}`}>
                  {user.username}
                </Link>
              </td>
              <td>{user.phone}</td>
              <td>{user.enrollmentDate}</td>
            </tr>
          ))
        ) : (
          <p>No users to display</p>
        )}
      </tbody>
    </Table>
  );
};

export default Feed;
