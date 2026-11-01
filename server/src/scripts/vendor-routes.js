
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL =
    process.env.BASE_URL || "http://localhost:8000/api/v1";

const client = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
    validateStatus: () => true
});


const vendors = [
    {
        email: "aviravi275@gmail.com",
        password: "Qwer4321!"
    },
   
];

let passed = 0;
let failed = 0;
let skipped = 0;

async function callApi(label, request) {
    try {
        const response = await request;
        const success =
            response.status >= 200 && response.status < 300;

        console.log(`\n${success ? "SUCCESS" : "FAILED"} | ${label}`);
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(response.data, null, 2));

        if (success) {
            passed++;
        } else {
            failed++;
            console.error(
                "Error:",
                response.data?.message ||
                response.data?.error ||
                "Request failed"
            );
        }

        return response;
    } catch (error) {
        failed++;
        console.error(`\nNETWORK ERROR | ${label}`);
        console.error(error.message);
        return null;
    }
}

async function runVendorRoutes(vendor) {
    const label = vendor.email;

    console.log("\n================================");
    console.log("TESTING VENDOR:", label);
    console.log("================================");

    const login = await callApi(
        `[${label}] POST /vendor/login`,
        client.post("/vendor/login", {
            email: vendor.email,
            password: vendor.password
        })
    );

    if (
        !login ||
        login.status < 200 ||
        login.status >= 300 ||
        !login.data?.accessToken ||
        !login.data?.refreshToken
    ) {
        console.error(`[${label}] Login failed. Skipping protected routes.`);
        skipped++;
        return;
    }

    const { accessToken, refreshToken } = login.data;

    const auth = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "x-refresh-token": refreshToken
        }
    };

    await callApi(
        `[${label}] GET /vendor/me`,
        client.get("/vendor/me", auth)
    );

    await callApi(
        `[${label}] PATCH /vendor/update`,
        client.patch(
            "/vendor/update",
            { name: `Test Vendor ${label}` },
            auth
        )
    );

    
    const productsResponse = await callApi(
        `[${label}] GET /product/my-products`,
        client.get("/product/my-products", auth)
    );

    const productData =
        productsResponse?.data?.products ??
        productsResponse?.data?.data ??
        productsResponse?.data;

    const products = Array.isArray(productData) ? productData : [];
    let productId = products[0]?._id;

    if (!productId) {
        const created = await callApi(
            `[${label}] POST /product/create`,
            client.post(
                "/product/create",
                {
                    productName: `Test Product ${Date.now()}`,
                    productDescription: "Created by vendor API test",
                    productCategory: "Electronics"
                },
                auth
            )
        );

        const createdData =
            created?.data?.product ??
            created?.data?.data ??
            created?.data;

        productId = createdData?._id;
    }

    if (productId) {
        await callApi(
            `[${label}] PATCH /product/${productId}`,
            client.patch(
                `/product/${productId}`,
                {
                    productDescription: "Updated by vendor API test"
                },
                auth
            )
        );

        await callApi(
            `[${label}] POST /price/set-price`,
            client.post(
                "/price/set-price",
                { productId, price: 199.99 },
                auth
            )
        );

        await callApi(
            `[${label}] GET /price/${productId}`,
            client.get(`/price/${productId}`, auth)
        );

        await callApi(
            `[${label}] GET /review/${productId}`,
            client.get(`/review/${productId}`, auth)
        );
    } else {
        console.log(`[${label}] No product ID; skipping product tests.`);
        skipped++;
    }

   
    const ordersResponse = await callApi(
        `[${label}] GET /order/vendor-orders`,
        client.get("/order/vendor-orders", auth)
    );

    const orderData =
        ordersResponse?.data?.orders ??
        ordersResponse?.data?.data ??
        ordersResponse?.data;

    const orders = Array.isArray(orderData) ? orderData : [];
    const orderId = orders[0]?._id;

    if (orderId) {
        await callApi(
            `[${label}] GET /order/${orderId}`,
            client.get(`/order/${orderId}`, auth)
        );

        await callApi(
            `[${label}] PATCH /order/${orderId}/status`,
            client.patch(
                `/order/${orderId}/status`,
                { status: "confirmed" },
                auth
            )
        );
    } else {
        console.log(`[${label}] No vendor orders found.`);
        skipped++;
    }

    
    await callApi(
        `[${label}] GET /review/vendor-reviews`,
        client.get("/review/vendor-reviews", auth)
    );

    
    await callApi(
        `[${label}] POST /vendor/logout`,
        client.post(
            "/vendor/logout",
            { refreshToken },
            auth
        )
    );

    console.log(`\nFINISHED VENDOR: ${label}`);
}

async function main() {
    console.log("\n========== MULTI-VENDOR API TESTS ==========");
    console.log("Base URL:", BASE_URL);
    console.log("Total vendors:", vendors.length);

    for (const vendor of vendors) {
        if (!vendor.email || !vendor.password) {
            console.error(
                `Skipping ${vendor.email || "unknown vendor"}: missing credentials.`
            );
            skipped++;
            continue;
        }

       
        await runVendorRoutes(vendor);
    }

    console.log("\n========== TEST SUMMARY ==========");
    console.log("Passed:", passed);
    console.log("Failed:", failed);
    console.log("Skipped:", skipped);
    console.log("========== COMPLETED ==========\n");

    if (failed > 0) {
        process.exitCode = 1;
    }
}

main();
