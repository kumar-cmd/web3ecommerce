// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const Web3 = require("web3");

// // Initialize Express app
// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Blockchain setup
// const provider = new Web3.providers.HttpProvider("https://goerli.infura.io/v3/YOUR_INFURA_PROJECT_ID"); // Replace with your provider URL
// const web3 = new Web3(provider);

// // Replace with your contract's ABI and address
// const contractABI = [
//   {
//     "inputs": [],
//     "name": "retrieve",
//     "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
//     "stateMutability": "view",
//     "type": "function",
//   },
//   {
//     "inputs": [{ "internalType": "uint256", "name": "num", "type": "uint256" }],
//     "name": "store",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function",
//   },
// ];
// const contractAddress = "YOUR_CONTRACT_ADDRESS"; // Replace with your contract address

// const storageContract = new web3.eth.Contract(contractABI, contractAddress);

// // API to retrieve the value of 'number' from the contract
// app.get("/retrieve", async (req, res) => {
//   try {
//     const value = await storageContract.methods.retrieve().call();
//     res.json({ value });
//   } catch (error) {
//     console.error("Error retrieving value:", error);
//     res.status(500).json({ error: "Failed to retrieve value" });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// const HOST = "0.0.0.0";
// app.listen(PORT, HOST, () => {
//   console.log(`Server is running on http://${HOST}:${PORT}`);
// });



// ===========================



import { Client,
  ContractCallQuery,
  ContractId,
  PrivateKey} from "@hashgraph/sdk"

import { Interface } from "ethers";

import { configDotenv } from "dotenv";
configDotenv();
// Load Hedera account ID and private key from environment variables
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

// Configure the Hedera client
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// Define the contract ID (replace with your actual contract ID)
const contractId = ContractId.fromString("0.0.5190702");

// Define the ABI for the getAllBicycles function (replace with your actual ABI)
const abi = [
"function getAllBicycles() public view returns (tuple(uint id, address currentOwner, address previousOwner, uint previousPrice, uint sellingPrice, bool forSale, uint creationTimestamp)[])"
];

const iface = new Interface(abi);

// Function to get all bicycles and log the decoded output
async function getAllBicycles() {
// Create the query for the getAllBicycles function
const query = new ContractCallQuery()
  .setContractId(contractId)
  .setGas(100000)
  .setFunction("getAllBicycles");

// Execute the query
const response = await query.execute(client);

// Decode the response using ethers.js
const decodedData = iface.decodeFunctionResult("getAllBicycles", response.bytes);

// Log the decoded bicycles
const bicycles = decodedData[0].map(bicycle => ({
  id: Number(bicycle.id),
  currentOwner: bicycle.currentOwner,
  previousOwner: bicycle.previousOwner,
  previousPrice: Number(bicycle.previousPrice),
  sellingPrice: Number(bicycle.sellingPrice),
  forSale: bicycle.forSale,
  creationTimestamp: new Date(Number(bicycle.creationTimestamp) * 1000)
}));

console.log("All Bicycles:", bicycles);
}

// Execute the function
getAllBicycles().catch(console.error);