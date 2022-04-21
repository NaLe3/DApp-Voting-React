import React from "react";
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';


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
          <>
            <input value={proposalInput} onChange={handleChangeProposal} />
            <button onClick={handleSubmitProposal}>Add proposal</button>
          </>
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
      <Container>
        {proposalWinningId && <p><b>The winner proposal is: {proposals[proposalWinningId].description}</b></p>}
        
        {proposals.map((proposal, index) =>
          <Row className="justify-content-md-center">
            <Card style={{ width: '18rem' }}>
              <Card.Header>Proposals {index + 1}:</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item> <p>{proposal.description}</p></ListGroup.Item>
                {workflowStatus === "3" && !currentUser.hasVoted &&
                <ListGroup>
                  <Button variant="info" onClick={() => vote(index)}>Vote</Button>
                </ListGroup>}
                <ListGroup>
                  {workflowStatus === "5" &&
                  <Badge bg="success">{proposal.voteCount} {proposal.voteCount > 1 ? "votes" : "vote"}</Badge>}
                </ListGroup>
              </ListGroup>
            </Card>
            
          </Row>
        )}
      </Container>
    )
  }

  return (
    <div> 
      {wrapperProposal()}
    </div>
  )

}

export default Proposal;