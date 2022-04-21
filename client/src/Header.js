import React from "react";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';




function Header(props) {

  const Owned = props.Owned;
  const state = props.state;
  const setWorkFlowStatus = props.setWorkFlowStatus;
  const setProposals = props.setProposals;
  const setVotersCount = props.setVotersCount;
  const isRegistered = props.isRegistered;

  const resetVote = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.resetVote().send({ from: owner });
    const workflowStatus = await state.contract.methods.workflowStatus().call();
    setWorkFlowStatus(workflowStatus);
    setProposals([]);
    const voters = await contract.methods.getVoters().call({ from: accounts[0] });
    setVotersCount(voters.length);
  }

  const renderLoggedUser = () => {
    if (Owned()) {
      return "owner";
    }
    if (isRegistered) {
      return "registered";
    }

    return "not registered";
  };

  return (
    
    <Navbar expand="lg" variant="light" bg="light">
      <Container>
        <Navbar.Brand><h2>Voting DApp</h2></Navbar.Brand>
        <p class="center"><strong>You are {renderLoggedUser()} </strong>
          <p>({state.accounts[0]})</p>
        </p>

        {Owned() &&
        <>
          <Button variant="secondary" onClick={resetVote}>Reset vote</Button>
        </>}
      </Container>
    </Navbar>
  )
}

export default Header;
