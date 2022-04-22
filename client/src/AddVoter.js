import React from "react";
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function AddVoter(props) {

  const state = props.state;
  const voterInput = props.voterInput; 
  const setVoterInput = props.setVoterInput; 

  const handleChangeVoter = (e) => {
    e.preventDefault();
    setVoterInput(e.target.value);
  }

  const handleSubmitVoter = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.addVoter(voterInput).send({ from: owner });
  }
  
  return(
    <Container className="mt-5">
      <Form>
        <Row className="justify-content-md-center">
          <Col sm={3} className="my-1">
            <InputGroup value={voterInput} onChange={handleChangeVoter}>
              <Form.Control id="inlineFormInputName" placeholder="0X..." />
            </InputGroup>
          </Col>
          <Col xs="auto" className="my-1">
            <Button type="submit" onClick={handleSubmitVoter}>Add voter</Button>
          </Col>
        </Row>
      </Form>
    </Container>  
  )

}

export default AddVoter;