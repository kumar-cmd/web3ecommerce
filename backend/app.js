const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
    Client,
    ContractCallQuery,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    ContractId,
    PrivateKey,
} = require("@hashgraph/sdk");
const { Interface } = require("ethers");
const { configDotenv } = require("dotenv");

// Load environment variables
configDotenv();
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

// Initialize Hedera Client
const client = Client.forTestnet()
    .setOperator(myAccountId, myPrivateKey)
    .setMaxAttempts(10) // Retry up to 10 times
    .setRequestTimeout(120000); // Timeout for each attempt: 120 seconds

// Define contract details
const contractId = ContractId.fromString("0.0.5191469");
const abi = [
    "function getAllBicycles() public view returns (tuple(uint id, address currentOwner, address previousOwner, uint previousPrice, uint sellingPrice, bool forSale, uint creationTimestamp)[])",
    "function addBicycle(uint buyingPrice) public",
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
        return decodedData[0].map((bicycle) => ({
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

// Hedera function to add a bicycle
async function addBicycle(buyingPrice) {
    try {
        const params = new ContractFunctionParameters().addUint256(buyingPrice);

        const transaction = new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(300000) // Set sufficient gas
            .setFunction("addBicycle", params);

        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (receipt.status.toString() === "SUCCESS") {
            console.log("Bicycle added successfully:", receipt);
            return { success: true, receipt };
        } else {
            console.error("Failed to add bicycle:", receipt.status.toString());
            return { success: false, error: receipt.status.toString() };
        }
    } catch (error) {
        console.error("Error adding bicycle:", error);
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

// Endpoint to add a bicycle
app.post("/addcycle", async (req, res) => {
    const { buyingPrice } = req.body;

    if (!buyingPrice) {
        return res.status(400).json({ error: "Invalid request. Missing buying price." });
    }

    try {
        const result = await addBicycle(buyingPrice);
        if (result.success) {
            res.json({ message: "Bicycle added successfully!", receipt: result.receipt });
        } else {
            res.status(500).json({ error: "Failed to add bicycle", details: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while adding the bicycle" });
    }
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
