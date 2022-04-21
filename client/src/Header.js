import React from "react";


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
    <div>
      <h1>Voting dApp project</h1>
			<p><strong>You are {renderLoggedUser()} ({state.accounts[0]})</strong></p>
			{Owned() &&
      <>
        <br />
        <button onClick={resetVote}>Reset vote</button>
        <br />
      </>}
    </div>
  )
}

export default Header;
