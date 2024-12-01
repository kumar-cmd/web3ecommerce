export default {
    template: `
        <div>
            <h1 class="text-center mb-4">Welcome to Cycle Shop</h1>
            <div class="row row-cols-1 row-cols-md-3 g-4">
                <div class="col" v-for="cycle in cycles" :key="cycle.id">
                    <div class="card h-100">
                        <img :src="cycle.image" :alt="cycle.brand" class="cycle-image card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">{{ cycle.brand }}</h5>
                            <p class="card-text">
                                <strong>ID:</strong> {{ cycle.id }}<br>
                                <strong>Owner:</strong> {{ cycle.owner }}<br>
                                <strong>Buying Price:</strong> ₹{{ cycle.buyingPrice }}<br>
                                <strong>Selling Price:</strong> ₹{{ cycle.sellingPrice }}<br>
                                <strong>Age:</strong> {{ cycle.age }} years
                            </p>
                        </div>
                        <div class="card-footer text-center">
                            <button class="btn btn-success w-100" @click="buyCycle(cycle)">Buy</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="responseMessage" class="alert alert-success mt-4" role="alert">
                {{ responseMessage }}
            </div>
        </div>
    `,
    data() {
        return {
            cycles: [
                {
                    id: 1,
                    brand: "Hero",
                    owner: "John",
                    buyingPrice: 7000,
                    sellingPrice: 5500,
                    age: 2,
                    image: "https://via.placeholder.com/150?text=Hero+Cycle",
                },
                {
                    id: 2,
                    brand: "Atlas",
                    owner: "Doe",
                    buyingPrice: 4500,
                    sellingPrice: 4800,
                    age: 3,
                    image: "https://via.placeholder.com/150?text=Atlas+Cycle",
                },
                {
                    id: 3,
                    brand: "Hercules",
                    owner: "Smith",
                    buyingPrice: 6000,
                    sellingPrice: 6200,
                    age: 1,
                    image: "https://via.placeholder.com/150?text=Hercules+Cycle",
                },
            ],
            responseMessage: "",
        };
    },
    methods: {
        async buyCycle(cycle) {
            try {
                const response = await fetch("https://web3ecommerce.onrender.com/buy", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: cycle.id,
                        owner: cycle.owner,
                        sellingPrice: cycle.sellingPrice,
                    }),
                });

                const result = await response.json();
                this.responseMessage = `Server Response: Cycle ID: ${result.id}, Owner: ${result.owner}, Selling Price: ₹${result.sellingPrice}`;
            } catch (error) {
                console.error("Error:", error);
                alert("An error occurred while processing your request.");
            }
        },
    },
};
