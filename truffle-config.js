const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();
const path = require("path");


module.exports = {

  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),

  networks: {
    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: () => new HDWalletProvider(`${process.env.MNEMONIC}`, `https://ropsten.infura.io/v3/${process.env.INFURA_ID}`),
      network_id: 3,       // Ropsten's id
      // gas: 5500000,        // Ropsten has a lower block limit than mainnet
      // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },
    kovan: {
      provider: function() {return new HDWalletProvider({mnemomic:{phrase:"${process.env.MNEMOMIC}"},providerOrUrl:"https://kovan.infura.io/v3/INFURA_ID"})},
      network_id: 42
    } 
    
  },

  mocha: {
     // timeout: 100000
  },

  compilers: {
    solc: {
      version: "0.8.13", // Récupérer la version exacte de solc-bin (par défaut : la  version de truffle)
      settings: {  // Voir les documents de solidity pour des conseils sur l'optimisation et l'evmVersion
        optimizer: {
        enabled: false,
        runs: 200
        },
      evmVersion: "byzantium"
      }
    },
  },
};