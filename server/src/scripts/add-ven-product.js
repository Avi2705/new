import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

const client = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true
});

async function callApi(request) {
    try {
        const res = await request;
        const success = res.status >= 200 && res.status < 300;
        console.log(`${success ? "SUCCESS" : "FAILED"} [${res.status}]`);
        return res;
    } catch (err) {
        console.error("NETWORK/REQUEST ERROR:", err.message);
        return null;
    }
}

const users = [
    { email: "aviravi2705@gmail.com", password: "Qwer4321!" }
];

const commentsPool = [
    { rating: 5, comment: "Excellent build quality and works as described!" },
    { rating: 4, comment: "Very good product, arrived quickly." },
    { rating: 5, comment: "Great value for money, highly recommend!" },
    { rating: 3, comment: "Average performance, could be better." },
    { rating: 4, comment: "Satisfied with this purchase, works well." }
];

async function loginUser(userCreds) {
    console.log(`\nLogging in user: ${userCreds.email}...`);
    const res = await callApi(
        client.post("/user/login", {
            email: userCreds.email,
            password: userCreds.password
        })
    );

    const accessToken = res?.data?.accessToken;
    const refreshToken = res?.data?.refreshToken;

    if (!accessToken) {
        console.error(`Login failed for ${userCreds.email}`);
        return null;
    }

    return {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Refresh-Token": refreshToken
        }
    };
}

async function getAllProducts() {
    console.log("\nFetching existing products from /product/all...");
    const res = await callApi(client.get("/product/all"));
    const products = res?.data?.products || res?.data?.data || res?.data || [];
    return Array.isArray(products) ? products : [];
}

async function addReviewsToProduct(productId, userAuth, count = 3) {
    console.log(`\nAdding ${count} reviews to Product ID: ${productId}`);

    for (let i = 0; i < count; i++) {
        const sample = commentsPool[i % commentsPool.length];
        const res = await callApi(
            client.post(
                `/review/${productId}`,
                {
                    productId: productId.toString(),
                    rating: sample.rating,
                    comment: `${sample.comment} (#${i + 1})`
                },
                userAuth
            )
        );
        console.log(`  -> Added review #${i + 1}: "${sample.comment}" (${sample.rating} stars)`);
    }
}

async function main() {
    console.log("========== ADDING COMMENTS TO ALL EXISTING PRODUCTS ==========");

    const userAuth = await loginUser(users[0]);
    if (!userAuth) {
        console.error("Cannot proceed without a valid user login.");
        return;
    }

    const products = await getAllProducts();
    console.log(`Total existing products found: ${products.length}`);

    if (products.length === 0) {
        console.log("No existing products found.");
        return;
    }

    for (const prod of products) {
        const productId = prod._id || prod.id;
        if (!productId) continue;

        console.log(`\n--------------------------------------------------`);
        console.log(`Product: ${prod.productName || "Unnamed"} (${productId})`);
        await addReviewsToProduct(productId, userAuth, 3);
    }

    console.log("\n========== COMPLETED ALL REVIEWS ==========\n");
}

main();