import React from "react";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';


function VotersCount(props) {

  const votersCount = props.votersCount;

  const renderVotersCount = () => 
    <p>registered {votersCount > 1 ? "voters" : "voter"} <Badge bg="secondary"> {votersCount} </Badge> </p>

  return (
    <Container className="mt-5">
      <Row className="justify-content-sm-center">
        <Col sm={2}>
          <Card >
            <Card.Header>{renderVotersCount(votersCount)}</Card.Header>
          </Card>
        </Col>
      </Row>
    </Container>
  )

}

export default VotersCount;