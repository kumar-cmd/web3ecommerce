export default {
    template: `
        <div>
            <h2 class="text-center mb-4">Add a New Bicycle</h2>
            <form @submit.prevent="addCycle" class="p-4 border rounded">
                <div class="mb-3">
                    <label for="buyingPrice" class="form-label">Buying Price</label>
                    <input
                        type="number"
                        id="buyingPrice"
                        v-model="newCycleBuyingPrice"
                        class="form-control"
                        required
                    />
                </div>
                <button type="submit" class="btn btn-primary w-100">Add Bicycle</button>
            </form>
            <div v-if="addCycleMessage" class="alert alert-success mt-4" role="alert">
                {{ addCycleMessage }}
            </div>
        </div>
    `,
    data() {
        return {
            newCycleBuyingPrice: null,
            addCycleMessage: "",
        };
    },
    methods: {
        async addCycle() {
            try {
                const response = await fetch("https://web3ecommerce.onrender.com/addcycle", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ buyingPrice: this.newCycleBuyingPrice }),
                });

                const result = await response.json();
                if (response.ok) {
                    this.addCycleMessage = result.message;
                    this.newCycleBuyingPrice = null;
                } else {
                    alert(`Failed to add bicycle: ${result.error}`);
                }
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while adding the bicycle.");
            }
        },
    },
};
