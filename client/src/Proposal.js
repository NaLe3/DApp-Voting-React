import React from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';


function Proposal(props) {

  const state = props.state;
  const workflowStatus = props.workflowStatus;
  const proposalInput = props.proposalInput;
  const proposals = props.proposals;
  const setProposalInput = props.setProposalInput;
  const proposalWinningId = props.proposalWinningId;
  const currentUser = props.currentUser;
  const setCurrentUser = props.setCurrentUser;

  const wrapperProposal = () => {
    return (
      <div>
        {workflowStatus === "1" && (
          <Form>
            <Row className="justify-content-md-center">
              <Col sm={3} className="my-1">
                <InputGroup value={proposalInput} onChange={handleChangeProposal}>
                  <Form.Control id="inlineFormInputName"  />
                </InputGroup>
              </Col>
              <Col xs="auto" className="my-1">
                <Button type="submit"onClick={handleSubmitProposal}>Add Proposal</Button>
              </Col>
            </Row>
          </Form>
      )}
      {workflowStatus !== "0" && renderProposals(proposals)}
      </div>
    )
  }

  const handleSubmitProposal = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.addProposal(proposalInput).send({ from: accounts[0] });
  }
  
  const handleChangeProposal = (e) => {
    e.preventDefault();
    setProposalInput(e.target.value);
  }

  const vote = async index => {
    const { accounts, contract } = state;
    await contract.methods.setVote(index).send({ from: accounts[0] });
    const currentUser = await contract.methods.getVoter(accounts[0]).call();
    setCurrentUser(currentUser);
  }

  const renderProposals = (proposals) => {
    if (proposals.length === 0) {
      return <p>There is no proposal registered yet.</p>
    }
  
    return (
      <Container className="mt-5">
        {proposalWinningId && <p>The winner proposal is: <Badge bg="success">{proposals[proposalWinningId].description}</Badge></p>}
        <Row className="justify-content-md-center">
        {proposals.map((proposal, index) =>
          
            <Col sm={4}>
            <Card style={{ width: '18rem' }}>
              <Card.Header>Proposals {index + 1}:</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item> <p>{proposal.description}</p></ListGroup.Item>
                {workflowStatus === "3" && !currentUser.hasVoted &&
                <ListGroup>
                  <Button variant="outline-dark" onClick={() => vote(index)}>Vote</Button>
                </ListGroup>}
                <ListGroup>
                  {workflowStatus === "5" &&
                  <Badge bg="dark">{proposal.voteCount} {proposal.voteCount > 1 ? "votes" : "vote"}</Badge>}
                </ListGroup>
              </ListGroup>
            </Card>
            </Col>
          
        )}
        </Row>
      </Container>
    )
  }

  return (
    <Container className="mt-5">
      {wrapperProposal()}
    </Container>  
  )

}

export default Proposal;




