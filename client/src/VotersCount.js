import React from "react";
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';


function VotersCount(props) {

  const votersCount = props.votersCount;

  const renderVotersCount = () => <p>registered {votersCount > 1 ? "voters" : "voter"} <Badge bg="secondary"> {votersCount} </Badge> </p>

  return (
    <Button variant="light">
      {renderVotersCount(votersCount)}
    </Button>
  )

}

export default VotersCount;