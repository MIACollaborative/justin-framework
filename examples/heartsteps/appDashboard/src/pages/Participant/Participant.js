import React from 'react';
import { ListGroup, Badge } from 'react-bootstrap';
import useData from '../../hooks/useData';
import { Link } from 'react-router-dom';

const Participant = ({ userName }) => {
  // TODO: use refs
  const { currParticipantId, setCurrParticipantId } = useData();

  const handleSelect = (participantID) => {
    setCurrParticipantId(participantID);
    alert(`selected ${participantID}`);
  };

  // TODO: set up fetch from axios
  const whatsappNum = 'whatsapp+:8455321923';

  return (
    <ListGroup.Item
      key={userName}
      as="li"
      className="d-flex justify-content-between align-items-start"
      // eventKey={userName}
      action
      variant="primary"
      // onClick={(e) => handleSelect(userName)}
    >
      <Link to={`/participant/${userName}`}>
        <div className="ms-2 me-auto">
          <div className="fw-bold">{userName}</div>
          {whatsappNum}
        </div>
      </Link>
      <Badge bg="primary" pill>
        14
      </Badge>
    </ListGroup.Item>
  );
};

export default Participant;
