import React from "react";


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
      <div>
        {proposalWinningId && <p><b>The winner proposal is: {proposals[proposalWinningId].description}</b></p>}
        Proposals:
        {proposals.map((proposal, index) =>
          <div key={index}>
            <p>{proposal.description}</p>
            {workflowStatus === "3" && !currentUser.hasVoted &&
            <button onClick={() => vote(index)}>Vote</button>}
            {workflowStatus === "5" &&
            <div>{proposal.voteCount} {proposal.voteCount > 1 ? "votes" : "vote"}</div>}
          </div>
        )}
      </div>
    )
  }

  return (
    <div> 
      {wrapperProposal()}
    </div>
  )

}

export default Proposal;