export default {
    template: `
        <div>
            <h1 class="text-center mb-4">Web3 Data</h1>
            <div v-if="loading" class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else class="row row-cols-1 row-cols-md-2 g-4">
                <div class="col" v-for="cycle in web3Cycles" :key="cycle.id">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Cycle ID: {{ cycle.id }}</h5>
                            <p class="card-text">
                                <strong>Current Owner:</strong> {{ cycle.currentOwner }}<br>
                                <strong>Previous Owner:</strong> {{ cycle.previousOwner }}<br>
                                <strong>Previous Price:</strong> ₹{{ cycle.previousPrice }}<br>
                                <strong>Selling Price:</strong> ₹{{ cycle.sellingPrice }}<br>
                                <strong>For Sale:</strong> {{ cycle.forSale ? "Yes" : "No" }}<br>
                                <strong>Creation Timestamp:</strong> {{ cycle.creationTimestamp }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            web3Cycles: [],
            loading: true,
        };
    },
    methods: {
        async fetchWeb3Data() {
            try {
                const response = await fetch("https://web3ecommerce.onrender.com/getcycle");
                const data = await response.json();
                this.web3Cycles = data;
            } catch (error) {
                console.error("Error fetching Web3 data:", error);
                alert("Failed to fetch Web3 data");
            } finally {
                this.loading = false;
            }
        },
    },
    mounted() {
        this.fetchWeb3Data();
    },
};
