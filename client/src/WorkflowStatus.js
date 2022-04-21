import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

function WorkflowStatus(props) {

  const state = props.state;
  const workflowStatus = props.workflowStatus;
  const setWorkFlowStatus = props.setWorkFlowStatus;

  const workflowStepButton = () => {
    switch (workflowStatus) {
      case "0":
        return <Button variant="outline-primary" onClick={startProposalsRegistering}>Start proposal registration</Button>;
      case "1":
        return <Button variant="outline-primary" onClick={endProposalsRegistering}>End proposal registration</Button>;
      case "2":
        return <Button variant="outline-primary" onClick={startVotingSession}>Start voting session</Button>;
      case "3":
        return <Button variant="outline-primary" onClick={endVotingSession}>End voting session</Button>;
      case "4":
        return <Button variant="outline-primary" onClick={tallyVotes}>Tally votes</Button>;
    }
  }

  const syncWorkflowStatus = async () => {
    const workflowStatus = await state.contract.methods.workflowStatus().call();
    setWorkFlowStatus(workflowStatus);
  }

  const startProposalsRegistering = async () => {
    const { accounts, contract, owner } = state;
    await state.contract.methods.startProposalsRegistering().send({ from: owner });
    await syncWorkflowStatus();
  }

  const endProposalsRegistering = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.endProposalsRegistering().send({ from: owner });
    await syncWorkflowStatus();
  }

  const startVotingSession = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.startVotingSession().send({ from: owner });
    await syncWorkflowStatus();
  }

  const endVotingSession = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.endVotingSession().send({ from: owner });
    await syncWorkflowStatus();
  }

  const tallyVotes = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.tallyVotes().send({ from: owner });
    await syncWorkflowStatus();
  }

  return(
    <Container>
      <Row className="justify-content-md-center">
        <div className="WorkflowStatus"> 
          {workflowStepButton()}
        </div>
      </Row>
    </Container>
  )
}

export default WorkflowStatus;