import React from "react";

function WorkflowStatus(props) {

  const state = props.state;
  const workflowStatus = props.workflowStatus;
  const setWorkFlowStatus = props.setWorkFlowStatus;

  const workflowStepButton = () => {
    switch (workflowStatus) {
      case "0":
        return <button onClick={startProposalsRegistering}>Start proposal registration</button>;
      case "1":
        return <button onClick={endProposalsRegistering}>End proposal registration</button>;
      case "2":
        return <button onClick={startVotingSession}>Start voting session</button>;
      case "3":
        return <button onClick={endVotingSession}>End voting session</button>;
      case "4":
        return <button onClick={tallyVotes}>Tally votes</button>;
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
    <div className="WorkflowStatus"> 
      {workflowStepButton()}
    </div>
  )
}

export default WorkflowStatus;