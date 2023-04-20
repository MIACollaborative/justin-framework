import React from 'react';
import { useState, useEffect } from 'react';
import { Container, Row, ListGroup, Table } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useIsMounted from '../../hooks/useIsMounted';
import moment from 'moment-timezone';

const ParticipantMessages = (props) => {
  const [msgs, setMsgs] = useState();
  const isMounted = useIsMounted();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const STAFF_NUM = 'whatsapp:+17342156061';

  useEffect(() => {
    console.log('--- INSIDE PARTICIPANT MESSAGES COMPONENT ---');
    console.log('props.username: ', props.username);
    let isMounted = true;
    // controller is to cancel request if component unmounts
    const controller = new AbortController();

    const getUserMsgs = async (uname) => {
      try {
        console.log('--- INSIDE getUserMsgs ---');
        console.log('uname: ', uname);
        console.log(
          'stringified username: ',
          JSON.stringify({ username: uname })
        );

        const response = await axiosPrivate.get(`/messages/user/${uname}`, {
          signal: controller.signal
        });
        // TODO: SECURITY - DELETE LOG IN PRODUCTION
        console.log(response.data);
        if (isMounted) {
          response.data.forEach(
            (msg) =>
              (msg.localTime = moment(msg.createdAt)
                // .tz('Africa/Nairobi')
                .tz('America/New_York')
                .format('ddd MMM DD YYYY HH:mm:ss'))
          );
          setMsgs(response.data);
        }
      } catch (err) {
        console.log(err);
        /* 
        whenever a user's refresh token expires
        after they re-login, user is sent back to the last page they were on
        i.e. user sent back to /participant/john/name page instead of /home page
        */
        // navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getUserMsgs(props.username);

    // cleanup function, runs on Users component unmount
    return () => {
      isMounted = false;
      controller.abort(); // cancel any pending requests
    };
  }, []);

  return (
    <Container className="align-items-center justify-content-center">
      {msgs?.length ? (
        <Table striped border hover>
          <thead>
            <th>From</th>
            <th>To</th>
            <th>Body</th>
            <th>Local Date/Time</th>
            <th>UTC Date/Time</th>
          </thead>
          <tbody>
            {msgs.map((msg, i) => (
              <tr>
                <td>{msg.from === STAFF_NUM ? 'Staff' : 'Patient'}</td>
                <td>{msg.to === STAFF_NUM ? 'Staff' : 'Patient'}</td>
                <td>{msg.body}</td>
                <td>{msg.localTime}</td>
                <td>{msg.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        // <ListGroup variant="flush">
        //   {/* TODO: replace key with uuid */}
        //   {msgs.map((msg, i) => (
        //     <ListGroup.Item
        //       key={i}
        //       className="d-flex justify-content-between align-items-start"
        //       variant="secondary"
        //       // onClick={(e) => handleSelect(userName)}
        //     >
        //       <p>From: {msg.from}</p>
        //       <p>To: {msg.to}</p>
        //       <p>Body: {msg.body}</p>
        //     </ListGroup.Item>
        //   ))}
        // </ListGroup>
        <p>No messages to display</p>
      )}
    </Container>
  );
};

export default ParticipantMessages;
