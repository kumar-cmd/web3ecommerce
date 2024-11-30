const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Client, ContractCallQuery, ContractId, PrivateKey } = require("@hashgraph/sdk");
const { Interface } = require("ethers");
const { configDotenv } = require("dotenv");

// Load environment variables
configDotenv();
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

// Initialize Hedera Client
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// Define contract details
// const contractId = ContractId.fromString("0.0.5190702"); 
// const contractId = ContractId.fromString("0.0.5191407"); 
const contractId = ContractId.fromString("0.0.5191469");
const abi = [
    "function getAllBicycles() public view returns (tuple(uint id, address currentOwner, address previousOwner, uint previousPrice, uint sellingPrice, bool forSale, uint creationTimestamp)[])"
];
const iface = new Interface(abi);

// Hedera function to get all bicycles
async function getAllBicycles() {
    try {
        const query = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(500000) // Temporarily set a high gas limit
            .setFunction("getAllBicycles");

        const response = await query.execute(client);

        console.log("Gas used:", response.gasUsed); // Log the gas used for debugging

        // Decode the response using ethers.js
        const decodedData = iface.decodeFunctionResult("getAllBicycles", response.bytes);

        // Transform data for readability
        return decodedData[0].map(bicycle => ({
            id: Number(bicycle.id),
            currentOwner: bicycle.currentOwner,
            previousOwner: bicycle.previousOwner,
            previousPrice: Number(bicycle.previousPrice),
            sellingPrice: Number(bicycle.sellingPrice),
            forSale: bicycle.forSale,
            creationTimestamp: new Date(Number(bicycle.creationTimestamp) * 1000),
        }));
    } catch (error) {
        console.error("Error retrieving bicycles:", error);
        throw error;
    }
}

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Root Route - Return "Hello, World!"
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Endpoint to get all bicycles
app.get("/getcycle", async (req, res) => {
    try {
        const bicycles = await getAllBicycles();
        res.json(bicycles);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bicycles" });
    }
});

// Endpoint to simulate a purchase
app.post("/buy", (req, res) => {
    const { id, owner, sellingPrice } = req.body;

    if (!id || !owner || !sellingPrice) {
        return res.status(400).json({ error: "Invalid request. Missing fields." });
    }

    console.log(`Cycle bought: ID=${id}, Owner=${owner}, Selling Price=₹${sellingPrice}`);

    res.json({ id, owner, sellingPrice });
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
