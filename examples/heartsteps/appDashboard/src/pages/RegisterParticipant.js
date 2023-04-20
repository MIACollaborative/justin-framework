import { useRef, useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import TimePicker from 'react-bootstrap-time-picker';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import useIsMounted from '../hooks/useIsMounted';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,24}$/;
const REGISTER_URL = '/register/participant/';
const UPDATE_PATIENT_LIST_URL = '/users/staff/update';

const RegisterParticipant = () => {
  const userRef = useRef();

  const [user, setUser] = useState('');
  const [phone, setPhone] = useState('');
  const [surveyTime, setSurveyTime] = useState('');
  const [surveyHour, setSurveyHour] = useState('');
  const [surveyMin, setSurveyMin] = useState('');
  const [surveyTimeInt, setSurveyTimeInt] = useState('');
  const [validName, setValidName] = useState(false);
  // TODO: SECURITY - move to env file and make secure

  const [pwd, setPwd] = useState('supersecret1234');
  const [validPwd, setValidPwd] = useState(false);
  // TODO: SECURITY - move to env file and make secure

  const [matchPwd, setMatchPwd] = useState('supersecret1234');
  const [validMatch, setValidMatch] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [therapist, setTherapist] = useState('');
  const [therapistList, setTherapistList] = useState([]);

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const isMounted = useIsMounted();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    let isMounted = true;
    // controller is to cancel request if component unmounts
    const controller = new AbortController();

    const getStaffUsers = async () => {
      try {
        const response = await axiosPrivate.get('/users/staff/', {
          signal: controller.signal
        });
        const staffObjs = response.data.map((staff) => staff.username);
        // TODO: SECURITY - DELETE LOG IN PRODUCTION
        console.log(response.data);
        if (isMounted) {
          setTherapistList(staffObjs);
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

    getStaffUsers();

    // cleanup function, runs on Users component unmount
    return () => {
      isMounted = false;
      controller.abort(); // cancel any pending requests
    };
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
      let whatsappNum = phone;
      const response = await axiosPrivate.post(
        REGISTER_URL,
        JSON.stringify({ user, pwd, whatsappNum, surveyTime })
      );
      console.log(response?.data);
      console.log(response?.accessToken);
      console.log(JSON.stringify(response));
    } catch (err) {
      if (!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else if (err.response?.status === 403) {
        // TODO: test if refresh tokens work correctly
        // TODO: error msg should be in context to display on login page
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

    // FIXME: create UPDATE_PATIENT_LIST_URL on backend

    // try {
    //   const response = await axiosPrivate.post(
    //     UPDATE_PATIENT_LIST_URL,
    //     JSON.stringify({ therapistName: therapist, addToPatientList: user })
    //   );
    //   console.log(response?.data);
    //   console.log(response?.accessToken);
    //   console.log(JSON.stringify(response));
    //   setSuccess(true);
    //   //clear state and controlled inputs
    //   //need value attrib on inputs for this
    //   setUser('');
    //   setPwd('');
    //   setPhone('');
    //   setSurveyTime('');
    //   setMatchPwd('');
    //   setTherapist('');
    // } catch (err) {
    //   if (!err?.response) {
    //     setErrMsg('No Server Response');
    //   } else if (err.response?.status === 409) {
    //     setErrMsg('Username Taken');
    //   } else if (err.response?.status === 403) {
    //     // TODO: test if refresh tokens work correctly
    //     // TODO: error msg should be in context to display on login page
    //     setErrMsg('Please sign back in. Your session has expired.');
    //     /*
    //       whenever a user's refresh token expires
    //       after they re-login, user is sent back to the last page they were on
    //       i.e. user sent back to /participant/john/name page instead of /home page
    //       */
    //     navigate('/login', { state: { from: location }, replace: true });
    //   } else {
    //     console.log(err);
    //     setErrMsg('Registration Failed');
    //   }
    // }

    if (isMounted) {
      setLoading(false);
    }
  };

  const handleTimeChange = (timeInSecs) => {
    console.log(timeInSecs);
    const hour = Math.floor(timeInSecs / 3600);
    const hourInSecs = hour * 3600;
    const minInSecs = timeInSecs - hourInSecs;
    const min = minInSecs / 60;
    setSurveyTimeInt(timeInSecs);
    setSurveyHour(hour);
    setSurveyMin(min);
    setSurveyTime(`${min} ${hour} * * *`);
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
                <h2 className="text-center mb-4">Register Participant</h2>
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
                  <Form.Group controlId="phoneNum">
                    <Form.Label>WhatsApp Number</Form.Label>
                    <Form.Control
                      type="text"
                      onChange={(e) => setPhone(e.target.value)}
                      value={phone}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="surveyTime">
                    <Form.Label>
                      Survey Time (set to 10 AM by default)
                    </Form.Label>
                    {/* <Form.Control
                      type="text"
                      onChange={(e) => setSurveyTime(e.target.value)}
                      value={surveyTime}
                    /> */}
                    <TimePicker
                      start="10:00"
                      end="21:00"
                      step={15}
                      onChange={handleTimeChange}
                      value={surveyTimeInt}
                    />
                  </Form.Group>
                  <Form.Group controlId="assignedTherapist">
                    <Form.Label>Assigned Therapist</Form.Label>
                    <Form.Select
                      onChange={(e) => setTherapist(e.target.value)}
                      value={therapist}
                    >
                      <option>Select a therapist</option>
                      {therapistList?.length ? (
                        therapistList.map((therapistName, i) => (
                          <option>{therapistName}</option>
                        ))
                      ) : (
                        <option>No therapists to display</option>
                      )}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    // TODO: make matchPwd and validPwd refs, include in disabled check
                    disabled={loading ? true : false}
                    className="w-100 mt-3"
                    type="submit"
                  >
                    {loading ? 'Loading…' : 'Create New Participant'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            {/* <div className="w-100 text-center mt-2">
              Already have an account? <Link to="/login">Log In</Link>
            </div> */}
          </div>
        )}
      </div>
    </Container>
  );
};

export default RegisterParticipant;
