const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { Client, ContractExecuteTransaction, ContractId, PrivateKey } = require("@hashgraph/sdk");
const { configDotenv } = require("dotenv");

// Load environment variables
configDotenv();
const myAccountId = process.env.MY_ACCOUNT_ID;
const myPrivateKey = PrivateKey.fromStringDer(process.env.MY_PRIVATE_KEY);

// Initialize Hedera Client
const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

// Define contract details
const contractId = ContractId.fromString("0.0.5191469"); // Update to your contract ID

// Hedera function to add a bicycle
async function addBicycle(buyingPrice) {
    try {
        const transaction = new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(100000) // Adjust gas as needed
            .setFunction("addBicycle", [buyingPrice]);

        // Sign and execute the transaction
        const txResponse = await transaction.execute(client);
        const receipt = await txResponse.getReceipt(client);

        // Check the status of the transaction
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

// Endpoint to get all bicycles
app.get("/getcycle", async (req, res) => {
    try {
        const bicycles = await getAllBicycles();
        res.json(bicycles);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve bicycles" });
    }
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
