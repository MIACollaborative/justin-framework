import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Nav, Button, Container, Col, Row } from 'react-bootstrap';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ParticipantInfo } from './ParticipantInfo';
import ParticipantMessages from './ParticipantMessages';
import ParticipantScores from './ParticipantScores';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useIsMounted from '../../hooks/useIsMounted';

// TODO: pass in users as data context
function ParticipantPage() {
  const [tabDetails, setTabDetails] = useState(<ParticipantMessages />);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState();
  const [msgBody, setMsgBody] = useState();
  const { username } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useIsMounted();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isMounted = true;
    // controller is to cancel request if component unmounts
    const controller = new AbortController();

    const getUser = async () => {
      try {
        const response = await axiosPrivate.get(`/users/${username}/`, {
          signal: controller.signal
        });
        // TODO: SECURITY - DELETE LOG IN PRODUCTION
        console.log(response.data);
        if (isMounted) {
          console.log('phone state: ', response.data.whatsappNum);
          setPhone(response.data.whatsappNum);
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

    getUser();

    // cleanup function, runs on Users component unmount
    return () => {
      isMounted = false;
      controller.abort(); // cancel any pending requests
    };
  }, []);

  const sendSurvey = async () => {
    try {
      const response = await axiosPrivate.post(`/messages/sendIntroMsg`, {
        to: phone
      });

      // TODO: SECURITY - delete log in production
      console.log(JSON.stringify(response?.data));
      if (isMounted) {
        setSuccess(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Survey failed to send');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleDeleteUsrMsgs = async () => {
    try {
      const response = await axiosPrivate.post(`/messages/deleteUsrMsgs`, {
        receiver: phone
      });

      console.log('response: ', response);
      // TODO: SECURITY - delete log in production
      console.log(JSON.stringify(response?.data));
      if (isMounted) {
        setSuccess(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Survey failed to send');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const sendFreeform = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosPrivate.post(`/messages/freeformSend`, {
        to: phone,
        msgBody: msgBody
      });

      // TODO: SECURITY - delete log in production
      console.log(JSON.stringify(response?.data));
      if (isMounted) {
        setSuccess(true);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else {
        setErrMsg('Survey failed to send');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  const handleSelect = (eventKey) => {
    // alert(`selected ${eventKey}`);
    if (eventKey === 'messages') {
      // TODO: use data provider context to get username to avoid 'no messages found' appearing sometimes
      setTabDetails(<ParticipantMessages username={username} />);
    } else if (eventKey === 'scores') {
      setTabDetails(<ParticipantScores username={username} />);
    } else if (eventKey === 'info') {
      setTabDetails(<ParticipantInfo username={username} />);
    }
  };

  return (
    <>
      <Container className="align-items-center justify-content-center">
        <Row>
          <h4 className="text-center">{`Username: ${username}`}</h4>
          <Button onClick={sendSurvey}>Send Survey</Button>
          <Form onSubmit={sendFreeform}>
            <Form.Group controlId="msgBody">
              <Form.Label>Custom Message</Form.Label>
              {/* TODO: test autoComplete=off */}
              <Form.Control
                type="text"
                onChange={(e) => setMsgBody(e.target.value)}
                value={msgBody}
                autoComplete="off"
                required
              />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Send Message
            </Button>
          </Form>
          {/* FIXME: REMOVE DELETE BUTTON
          <Button
            disabled={loading}
            className="w-100"
            onClick={handleDeleteUsrMsgs}
          >
            Delete User Messages
          </Button> */}
        </Row>
      </Container>
      <Nav variant="tabs" defaultActiveKey="info" onSelect={handleSelect}>
        <Nav.Item>
          <Nav.Link
            eventKey="messages"
            // as={Link}
            // to={`participant/${username}/messages`}
          >
            Messages
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="scores"
            // as={Link}
            // to={`participant/${username}/scores`}
          >
            Scores
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="info"
            // as={Link}
            // to={`participant/${username}/info`}
          >
            Patient Info
          </Nav.Link>
        </Nav.Item>
      </Nav>

      {tabDetails}
    </>
  );
}

export default ParticipantPage;
