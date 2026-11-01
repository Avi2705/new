
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const BASE_URL =
  process.env.BASE_URL || "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  validateStatus: () => true,
});

let passed = 0;
let failed = 0;
let skipped = 0;

async function callApi(label, request) {
  try {
    const res = await request;
    const success = res.status >= 200 && res.status < 300;

    console.log(`\n${success ? "SUCCESS" : "FAILED"} | ${label}`);
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(res.data, null, 2));

    if (success) {
      passed++;
    } else {
      failed++;
      console.error(
        "Error:",
        res.data?.message || res.data?.error || "Request failed"
      );
    }

    return res;
  } catch (err) {
    failed++;
    console.error(`\nNETWORK/REQUEST ERROR | ${label}`);
    console.error(err.message);
    return null;
  }
}

async function runUserRoutes(user) {
  const userLabel = user.email;

  console.log("\n========================================");
  console.log("TESTING USER:", userLabel);
  console.log("========================================");

  
  const login = await callApi(
    `[${userLabel}] POST /user/login`,
    client.post("/user/login", {
      email: user.email,
      password: user.password,
    })
  );

  const token = login?.data?.accessToken;
  const refreshToken = login?.data?.refreshToken;

  if (
    !login ||
    login.status < 200 ||
    login.status >= 300 ||
    !token ||
    !refreshToken
  ) {
    console.error(
      `[${userLabel}] Login failed. Skipping protected routes.`
    );
    skipped++;
    return;
  }

  
  const auth = {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Refresh-Token": refreshToken,
    },
  };


  await callApi(
    `[${userLabel}] GET /user/me`,
    client.get("/user/me", auth)
  );

  await callApi(
    `[${userLabel}] GET /user/profile`,
    client.get("/user/profile", auth)
  );

  await callApi(
    `[${userLabel}] PATCH /user/update`,
    client.patch(
      "/user/update",
      { name: `Test User ${userLabel}` },
      auth
    )
  );

 
  const allProducts = await callApi(
    `[${userLabel}] GET /product/all`,
    client.get("/product/all")
  );

  const productData = allProducts?.data;
  const products = Array.isArray(productData)
    ? productData
    : productData?.products || [];

  const productId = products[0]?._id;

  if (!productId) {
    console.log(
      `[${userLabel}] No product found. Product-specific tests skipped.`
    );
    skipped++;
  } else {
    console.log(`[${userLabel}] Using Product ID:`, productId);

    await callApi(
      `[${userLabel}] GET /product/search`,
      client.get("/product/search", {
        params: { name: "product" },
      })
    );

    await callApi(
      `[${userLabel}] GET /product/filter`,
      client.get("/product/filter", {
        params: { minPrice: 1, maxPrice: 50000 },
      })
    );

    await callApi(
      `[${userLabel}] GET /product/${productId}`,
      client.get(`/product/${productId}`)
    );

    await callApi(
      `[${userLabel}] GET /offer/${productId}`,
      client.get(`/offer/${productId}`)
    );

    
    await callApi(
      `[${userLabel}] POST /cart/add`,
      client.post(
        "/cart/add",
        { productId, quantity: 2 },
        auth
      )
    );

    await callApi(
      `[${userLabel}] GET /cart/get-cart`,
      client.get("/cart/get-cart", auth)
    );

    await callApi(
      `[${userLabel}] DELETE /cart/${productId}`,
      client.delete(`/cart/${productId}`, auth)
    );

    await callApi(
      `[${userLabel}] POST /cart/add (before clear)`,
      client.post(
        "/cart/add",
        { productId, quantity: 1 },
        auth
      )
    );

    await callApi(
      `[${userLabel}] DELETE /cart/clear`,
      client.delete("/cart/clear", auth)
    );

    
    const placeOrder = await callApi(
      `[${userLabel}] POST /order/place`,
      client.post(
        "/order/place",
        { productId, quantity: 1 },
        auth
      )
    );

    await callApi(
      `[${userLabel}] GET /order/my-orders`,
      client.get("/order/my-orders", auth)
    );

    const orderId = placeOrder?.data?.order?._id;

    if (orderId) {
      await callApi(
        `[${userLabel}] GET /order/${orderId}`,
        client.get(`/order/${orderId}`, auth)
      );

      await callApi(
        `[${userLabel}] PATCH /order/${orderId}/cancel`,
        client.patch(`/order/${orderId}/cancel`, {}, auth)
      );
    } else {
      console.log(
        `[${userLabel}] No order ID returned; order-specific tests skipped.`
      );
      skipped++;
    }

    
    await callApi(
      `[${userLabel}] POST /review/${productId}`,
      client.post(
        `/review/${productId}`,
        {
          productId,
          rating: 5,
          comment: `Automated test review by ${userLabel}`,
        },
        auth
      )
    );

    await callApi(
      `[${userLabel}] GET /review/${productId}`,
      client.get(`/review/${productId}`)
    );
  }


  await callApi(
    `[${userLabel}] POST /user/logout`,
    client.post("/user/logout", {}, auth)
  );

  console.log(`\nFINISHED USER: ${userLabel}`);
}

async function main() {
  console.log("\n========== MULTI-USER API TESTS ==========");
  console.log("Base URL:", BASE_URL);

let users;
  try {
   users = [
  {
    email: "aviravi2705@gmail.com",
    password: "Qwer4321!"
  },
  {
    email: "aviravi275@gmail.com",
    password: "Qwer4321!"
  },
  
];
  } catch {
    console.error("Invalid TEST_USERS JSON in .env");
    process.exitCode = 1;
    return;
  }

  if (!Array.isArray(users) || users.length === 0) {
    console.error(
      "No users configured. Add a TEST_USERS JSON array to .env."
    );
    process.exitCode = 1;
    return;
  }

  for (const user of users) {
    if (!user?.email || !user?.password) {
      console.error("Skipping invalid user entry:", user?.email);
      skipped++;
      continue;
    }

      await runUserRoutes(user);
  }

  console.log("\n========== FINAL TEST SUMMARY ==========");
  console.log("Users configured:", users.length);
  console.log("Requests passed:", passed);
  console.log("Requests failed:", failed);
  console.log("Items skipped:", skipped);
  console.log("========== TESTS COMPLETED ==========\n");

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
