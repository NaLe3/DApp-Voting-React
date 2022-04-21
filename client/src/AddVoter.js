import React from "react";


function AddVoter(props) {

  const state = props.state;
  const voterInput = props.voterInput; 
  const setVoterInput = props.setVoterInput; 
  
  const voterButton = () => {
    return (
      <div>
        <br /><br />
        <input value={voterInput} onChange={handleChangeVoter} />
        <button onClick={handleSubmitVoter}>Add voter</button>
      </div>
    )
  }
  const handleChangeVoter = (e) => {
    e.preventDefault();
    setVoterInput(e.target.value);
  }

  const handleSubmitVoter = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.addVoter(voterInput).send({ from: owner });
  }
  
  return(
    <div>
      { voterButton() }
    </div>
  )

}

export default AddVoter;