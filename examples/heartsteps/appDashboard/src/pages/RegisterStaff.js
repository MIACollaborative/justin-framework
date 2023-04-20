import { useRef, useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useIsMounted from '../hooks/useIsMounted';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;
const REGISTER_URL = '/register/staff/';

const RegisterStaff = () => {
  const userRef = useRef();

  const [user, setUser] = useState('');
  const [validName, setValidName] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useIsMounted();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(USER_REGEX.test(user));
  }, [user]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    console.log('called handleSubmit');
    e.preventDefault();
    const v1 = USER_REGEX.test(user);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1) {
      setErrMsg(
        'Invalid Username.\n\n' +
          'Username must be 4 to 24 characters.\n' +
          'Must begin with a letter. Letters, numbers, underscores, hyphens allowed.'
      );
      return;
    }
    if (!v2) {
      setErrMsg(
        'Invalid Password\n\n' +
          'Password must be 8 to 24 characters.\n' +
          'It must include at least one letter and at least one number.'
      );
      return;
    }
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd })
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
      setSuccess(true);
      //clear state and controlled inputs
      //need value attrib on inputs for this
      setUser('');
      setPwd('');
      setMatchPwd('');
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else if (err.response?.status === 403) {
        // TODO: test if refresh tokens work correctly
        setErrMsg('Please sign back in. Your session has expired.');
        /*
          whenever a user's refresh token expires
          after they re-login, user is sent back to the last page they were on
          i.e. user sent back to /participant/john/name page instead of /home page
          */
        navigate('/login', { state: { from: location }, replace: true });
      } else {
        console.log(err);
        setErrMsg('Registration Failed');
      }
    }
    if (isMounted) {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh' }}
    >
      <div className="w-100" style={{ maxWidth: '400px' }}>
        {success ? (
          <div>
            <h1 className="text-center mb-4">Success!</h1>
            <p>
              <Link to="/">Go to Dashboard</Link>
            </p>
          </div>
        ) : (
          <div>
            {errMsg && <Alert variant="danger">{errMsg}</Alert>}
            <Card>
              <Card.Body>
                <h2 className="text-center mb-4">Register Staff</h2>
                {/* {error && <Alert variant="danger">{error}</Alert>} */}
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      ref={userRef}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      onChange={(e) => setPwd(e.target.value)}
                      value={pwd}
                      required
                    />
                  </Form.Group>
                  {/* {!validMatch && (
                    <Alert variant="danger">
                      Must match the first password input field.
                    </Alert>
                  )} */}
                  <Form.Group controlId="password-confirm">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      onChange={(e) => setMatchPwd(e.target.value)}
                      value={matchPwd}
                      required
                    />
                  </Form.Group>
                  {/* TODO: add participantList dropdown */}
                  <Button className="w-100 mt-3" type="submit">
                    {loading ? 'Loading…' : 'Create New Staff Member'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default RegisterStaff;
