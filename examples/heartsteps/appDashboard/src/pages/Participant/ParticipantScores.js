import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import Table from 'react-bootstrap/Table';

const ParticipantScores = (props) => {
  const [scores, setScores] = useState([]);
  const [dates, setDates] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    console.log('--- INSIDE PARTICIPANT SCORES COMPONENT ---');
    console.log('props.username: ', props.username);
    let isMounted = true;
    // controller is to cancel request if component unmounts
    const controller = new AbortController();

    const getUserScores = async (uname) => {
      try {
        console.log('--- INSIDE getUserScores ---');
        console.log('uname: ', uname);
        console.log(
          'stringified username: ',
          JSON.stringify({ username: uname })
        );

        const response = await axiosPrivate.get(`/reports/user/${uname}`, {
          signal: controller.signal
        });
        // TODO: SECURITY - DELETE LOG IN PRODUCTION
        console.log(response.data);
        let report, reportDate;
        let reportsArr = [];
        let reportDatesArr = [];
        if (isMounted && response.data) {
          for (let i = 0; i < response.data.length; i++) {
            // FIXME: remove slice(1) and start saving survey res after intro msg (but not including)
            console.log('survey answers: ', response.data[i].answers.slice(1));
            report = response.data[i].answers.slice(1);
            reportDate = new Date(response.data[i].date)
              .toISOString()
              .slice(0, 10);
            reportsArr.push(report);
            reportDatesArr.push(reportDate);
          }
          console.log('reports arr: ', reportsArr);
          if (reportsArr.length !== reportDatesArr.length) {
            throw Error(
              'ERROR: reports array and reports date array are different lengths.'
            );
          }
          setScores(reportsArr);
          setDates(reportDatesArr);
        }
      } catch (err) {
        console.log(err);
        /* 
        whenever a user's refresh token expires
        after they re-login, user is sent back to the last page they were on
        i.e. user sent back to /participant/john/name page instead of /home page
        */
        //  FIXME: uncomment navigate to login
        // navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getUserScores(props.username);
    console.log('scores state: ', scores);
    scores.forEach(function (report) {
      console.log('report: ', report);
    });

    // cleanup function, runs on Users component unmount
    return () => {
      isMounted = false;
      controller.abort(); // cancel any pending requests
    };
  }, []);

  return (
    <Table striped border hover>
      <thead>
        <th>Completion Date</th>
        <th>Q1</th>
        <th>Q2</th>
        <th>Q3</th>
        <th>Q4</th>
        <th>Q5</th>
        <th>Q6</th>
      </thead>
      <tbody>
        {scores?.length ? (
          scores.map((report, i) => (
            <tr key={i}>
              <td>{dates[i]}</td>
              <td>{report[0]}</td>
              <td>{report[1]}</td>
              <td>{report[2]}</td>
              <td>{report[3]}</td>
              <td>{report[4]}</td>
              <td>{report[5]}</td>
            </tr>
          ))
        ) : (
          <p>No reports to display</p>
        )}
      </tbody>
    </Table>
  );
};

export default ParticipantScores;
