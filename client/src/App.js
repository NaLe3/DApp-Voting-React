import React, { useState, useEffect, useRef } from "react";
import VotingContract                         from "./contracts/Voting.json";
import getWeb3                                from "./getWeb3";
import "./App.css";
import WorkflowStatus from "./WorkflowStatus";
import AddVoter from "./AddVoter";
import VotersCount from "./VotersCount";
import Proposal from "./Proposal";
import Header from "./Header";


const App = () => {

  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
    owner: null
  });

  const [voterInput, setVoterInput] = useState("");
  const [proposalInput, setProposalInput] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [workflowStatus, setWorkFlowStatus] = useState("0");
  const [proposals, setProposals] = useState([]);
  const [proposalWinningId, setProposalWinningId] = useState(null);
  const [votersCount, setVotersCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  const inputRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const instance = new web3.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
        const owner = await instance.methods.owner().call();
        const workflowStatus = await instance.methods.workflowStatus().call();
          
        setState({
          web3,
          accounts,
          contract: instance,
          owner
        });
        setWorkFlowStatus(workflowStatus);
        
        if (accounts[0] === owner) {
          const currentUser = await instance.methods.getVoter(accounts[0]).call({ from: accounts[0] });
          setCurrentUser(currentUser);
          setIsRegistered(true)
          const voters = await instance.methods.getVoters().call({ from: accounts[0] });
          setVotersCount(voters.length);
          const proposalsList = await instance.methods.getProposals().call({ from: accounts[0] });
          setProposals(proposalsList);
        } else {
          let options = {
            fromBlock: 0,
            toBlock: 'latest'
          };
          const resetData = await instance.getPastEvents("ResetVote", options)
      
          options = {
            // filter: {
            //     value: "address"
            // },
            fromBlock: 0,
            toBlock: 'latest'
          };  
          const votersData = await instance.getPastEvents("VoterRegistered", options)
          // console.log("votersData", votersData);
          votersData.map(async event => {
            if (event.returnValues.voterAddress === accounts[0]) {
              setIsRegistered(true);
              const currentUser = await instance.methods.getVoter(accounts[0]).call({ from: accounts[0] });
              setCurrentUser(currentUser);

              if (parseInt(workflowStatus) >= 1) {
                const proposalsList = await instance.methods.getProposals().call({ from: accounts[0] });
                setProposals(proposalsList);
              }
            }
          });
        }

        await instance.events.VoterRegistered()
          .on("data", async event => {
              const voterAddress = event.returnValues.voterAddress;
              if (voterAddress === accounts[0]) {
                  const currentUser = await instance.methods.getVoter(accounts[0]).call({ from: accounts[0] });
                  setCurrentUser(currentUser);
                  setIsRegistered(true);
              }
              if (accounts[0] === owner) {
                const voters = await instance.methods.getVoters().call({ from: accounts[0] });
                setVotersCount(voters.length);
              }
              console.log("New voter have been registered: " + voterAddress);
          })
          .on("changed", changed => console.log(changed))
          .on("error", err => console.error(err))
          .on("connected", str => console.log(str));

        await instance.events.ProposalRegistered()
          .on("data", async event => {
              const proposalsList = await instance.methods.getProposals().call({ from: accounts[0] });
              setProposals(proposalsList);
              console.log("New proposal pushed.");
          })
          .on("changed", changed => console.log(changed))
          .on("error", err => console.error(err))
          .on("connected", str => console.log(str));
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
			if (workflowStatus === "5") {
					const { contract, owner } = state;
					const proposalsList = await contract.methods.getProposals().call({ from: owner });
					const proposalWinningId = await contract.methods.winningProposalID().call({ from: owner });
					setProposals(proposalsList);
					setProposalWinningId(proposalWinningId);
			}
    })()
}, [workflowStatus]);

  console.log("currentUser2", currentUser);

  const Owned = () => state.accounts[0] === state.owner;

	const resetVote = async () => {
    const { accounts, contract, owner } = state;
    await contract.methods.resetVote().send({ from: owner });
    const workflowStatus = await state.contract.methods.workflowStatus().call();
    setWorkFlowStatus(workflowStatus);
    setProposals([]);
    const voters = await contract.methods.getVoters().call({ from: accounts[0] });
    setVotersCount(voters.length);
  }

  if (state.web3 === null) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
    <div className="App">
      <Header
				Owned = { Owned }
				state = { state }
				setWorkFlowStatus = { setWorkFlowStatus }
				setProposals = { setProposals }
				setVotersCount = { setVotersCount }
				isRegistered = { isRegistered }
			/>
			{ Owned() &&
				<WorkflowStatus 
					workflowStatus = { workflowStatus }
					state = { state }
					setWorkFlowStatus = { setWorkFlowStatus } 
				/> }
			{ Owned() && workflowStatus === "0" &&
				<AddVoter
					state = { state }
					voterInput = { voterInput }
					setVoterInput = { setVoterInput }
			/> }	
      {Owned() && 
				<VotersCount
					votersCount = { votersCount }
				/> 
			}
      {isRegistered && 
				<Proposal
					workflowStatus = { workflowStatus }
					state = { state }
					proposalInput = { proposalInput }
					proposals = { proposals }
				  setProposalInput = { setProposalInput }
					proposalWinningId = { proposalWinningId }
					currentUser = { currentUser }
					setCurrentUser = { setCurrentUser }
				/> 
			}
    </div>
  );
}

export default App;