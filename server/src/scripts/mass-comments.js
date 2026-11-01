import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "ecommmerce";

const USER_IDS = [
    "6adc7d0c968942bf5d456a72",
    "6ae19417e19b8ec6f92a7404",
    "6ae19462e19b8ec6f92a7405",
    "6ae194eae19b8ec6f92a7406",
];

const COMMENTS_0_STAR = [
    "Complete scam! Item never worked and zero response from seller.",
    "Absolute trash. Broke immediately upon opening the box.",
    "Zero stars if possible. Completely useless and dangerous product.",
    "Do NOT buy this! Total waste of hard earned money.",
    "Worst item ever manufactured. Arrived completely shattered and dead.",
    "Fraudulent listing. Product is counterfeit and does not match description.",
    "Horrendous experience. Caused electrical spark when plugged in.",
    "Terrible nightmare. Seller sent empty broken parts and refuses refund.",
    "Literal junk. Threw it straight into the garbage bin.",
    "Disastrous quality. Fell apart in my hands within ten seconds."
];

const COMMENTS_1_STAR = [
    "Terrible quality. Broke within two days of using it.",
    "Complete waste of money. Do not buy this product.",
    "The product looks nothing like the pictures. Very misleading.",
    "Arrived damaged and customer support was completely unhelpful.",
    "Extremely disappointed. The material feels cheap, fragile, and flimsy.",
    "Does not work as advertised. I want an immediate full refund.",
    "Worst purchase I have ever made. Absolute garbage tier quality.",
    "The product stopped working after one week. Very unreliable.",
    "Poor packaging, the item was scratched and dented all over.",
    "Overpriced for what you get. Not worth even ten percent of the price.",
    "Horrible experience. The product smells bad and looks worse in person.",
    "I have seen better quality from dollar store bargain bins.",
    "Took forever to arrive and the unit was entirely defective.",
    "The description is completely inaccurate. Total false advertising.",
    "Falls apart if you even look at it wrong. Zero durability.",
    "Customer service completely ghosted me after reporting the issue.",
    "Deeply regret buying this. Should have listened to warning reviews.",
    "The product caused an allergic reaction. Very unsafe materials.",
    "Instructions were missing and the device is impossible to assemble.",
    "Returned it immediately. This is not worth anyone's time or effort."
];

const COMMENTS_2_STAR = [
    "Underwhelming. Expected much better build quality for this price.",
    "Works poorly. Loses power quickly and gets uncomfortably hot.",
    "Subpar craftsmanship. Finishing is rough around the edges.",
    "Broke after 2 weeks of light usage. Very disappointing durability.",
    "Functions intermittently. Have to restart it multiple times.",
    "Cheap plastic components. Feels like a toy rather than real equipment.",
    "Battery drains in under 2 hours. Inconvenient and frustrating.",
    "Shipping box was soaked and product shows signs of water damage.",
    "Difficult to calibrate and the manual is written in broken sentences.",
    "Would not recommend. You can get far better alternatives for cheaper."
];

const COMMENTS_3_STAR = [
    "It is okay I guess. Nothing special but gets the basic job done.",
    "Average product. Not great, not terrible either. Decent enough.",
    "Fair for the price point, but definitely leaves room for improvements.",
    "Works fine so far, although the finishing feels somewhat rushed.",
    "Expected slightly more power, but acceptable for occasional home use.",
    "Middle-of-the-road performance. It does the job, barely.",
    "Mixed feelings. Good aesthetics, but performance is only average.",
    "Not bad, but there are definitely better options in the market.",
    "Mediocre build quality. Will probably last a year if handled carefully.",
    "Satisfactory, though shipping took longer than expected."
];

const COMMENTS_4_STAR = [
    "Very good product! Minor room for improvement but overall happy.",
    "Solid build quality and reliable performance. Worth buying.",
    "Exceeded my expectations on ease of use. Looks neat and stylish.",
    "Fast delivery and packaged neatly. Good value for money.",
    "Works as advertised with only slight learning curve in the beginning.",
    "Pleasantly surprised by the performance. Would buy again.",
    "Good quality materials, comfortable to use, and dependable.",
    "Solid four stars. Does what it promises without any hiccups.",
    "Customer service answered my questions promptly. Happy customer.",
    "Great companion for daily tasks. Sturdy and well thought out."
];

const COMMENTS_5_STAR = [
    "Outstanding masterpiece! Best purchase I have made in years.",
    "Exceptional build quality, flawless performance, and top tier support.",
    "Five stars all day! Exceeded every single expectation I had.",
    "Extremely durable, sleek, and works like a charm right out of the box.",
    "Premium feel and superb craftsmanship. Worth every single penny.",
    "I have recommended this to all my friends and colleagues. Wonderful!",
    "Top quality materials and rapid shipping. 10/10 experience.",
    "Unbeatable value. Easily beats competitors priced twice as high.",
    "Fantastic attention to detail. Could not be happier with this.",
    "Remarkable product! Runs silently, efficiently, and looks gorgeous."
];

const RATING_COMMENT_MAP = {
    0: COMMENTS_0_STAR,
    1: COMMENTS_1_STAR,
    2: COMMENTS_2_STAR,
    3: COMMENTS_3_STAR,
    4: COMMENTS_4_STAR,
    5: COMMENTS_5_STAR
};

function randomDateBetween(start, end) {
    const startMs = start.getTime();
    const endMs = end.getTime();
    const randomMs = startMs + Math.random() * (endMs - startMs);
    return new Date(randomMs);
}

function getRandomRating() {
    const ratings = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5];
    return ratings[Math.floor(Math.random() * ratings.length)];
}

async function main() {
    console.log("========== MASS COMMENT INSERTION (100+ PER PRODUCT) ==========\n");

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB successfully.\n");

    const db = client.db(DB_NAME);

    const users = await db
        .collection("users")
        .find({ _id: { $in: USER_IDS.map((id) => new ObjectId(id)) } })
        .project({ name: 1, email: 1 })
        .toArray();

    const userMap = new Map(users.map((u) => [u._id.toString(), u]));
    console.log(`Found ${users.length} user(s) in DB:`);
    for (const u of users) {
        console.log(`  ${u._id} => ${u.name || u.email}`);
    }

    if (users.length === 0) {
        console.error("ERROR: No valid users found. Please check user IDs.");
        await client.close();
        return;
    }

    const products = await db
        .collection("products")
        .find({ isDeleted: { $ne: true } })
        .toArray();

    console.log(`\nFound ${products.length} product(s) in DB.\n`);

    if (products.length === 0) {
        console.error("No products found in DB. Exiting.");
        await client.close();
        return;
    }

    const COMMENTS_PER_PRODUCT = 105;
    const totalToGenerate = COMMENTS_PER_PRODUCT * products.length;
    console.log(`Adding ${COMMENTS_PER_PRODUCT} comments per product across ${products.length} products = ${totalToGenerate} total comments...\n`);

    const reviewDocs = [];
    let counter = 0;

    for (const product of products) {
        const productId = product._id;
        const productName = product.productName || "Unknown Product";
        const vendorId = product.vendorId;

        for (let i = 0; i < COMMENTS_PER_PRODUCT; i++) {
            counter++;
            const userId = USER_IDS[counter % USER_IDS.length];
            const user = userMap.get(userId);

            const rating = getRandomRating();
            const commentList = RATING_COMMENT_MAP[rating];
            const baseComment = commentList[Math.floor(Math.random() * commentList.length)];
            const comment = `${baseComment} [#${(counter % 999) + 1}]`;

            const date = randomDateBetween(
                new Date("2024-01-01T00:00:00Z"),
                new Date("2026-10-28T00:00:00Z")
            );

            reviewDocs.push({
                productId: typeof productId === "string" ? new ObjectId(productId) : productId,
                productName,
                vendorId: typeof vendorId === "string" ? new ObjectId(vendorId) : vendorId,
                userId: new ObjectId(userId),
                userName: user?.name || user?.email || "User",
                rating,
                comment,
                createdAt: date,
                updatedAt: date
            });
        }
    }

    const BATCH_SIZE = 500;
    let insertedTotal = 0;

    for (let i = 0; i < reviewDocs.length; i += BATCH_SIZE) {
        const batch = reviewDocs.slice(i, i + BATCH_SIZE);
        const res = await db.collection("reviews").insertMany(batch);
        insertedTotal += res.insertedCount;
        process.stdout.write(`  Inserted ${insertedTotal}/${reviewDocs.length} comments...\r`);
    }

    console.log(`\n\nSuccessfully inserted ${insertedTotal} total reviews!`);

    const yearCounts = { 2024: 0, 2025: 0, 2026: 0 };
    const ratingCounts = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const userCounts = {};

    for (const doc of reviewDocs) {
        const yr = doc.createdAt.getFullYear();
        yearCounts[yr] = (yearCounts[yr] || 0) + 1;
        ratingCounts[doc.rating] = (ratingCounts[doc.rating] || 0) + 1;
        const uid = doc.userId.toString();
        userCounts[uid] = (userCounts[uid] || 0) + 1;
    }

    console.log("\n========== SUMMARY ==========");
    console.log(`Total Reviews Inserted: ${insertedTotal}`);
    console.log(`Products Processed:     ${products.length}`);
    console.log(`Comments Per Product:   ${COMMENTS_PER_PRODUCT}`);
    console.log("\nBreakdown By Year:");
    for (const [yr, cnt] of Object.entries(yearCounts)) {
        console.log(`  ${yr}: ${cnt} comments`);
    }
    console.log("\nBreakdown By Rating (0-5 stars):");
    for (const [r, cnt] of Object.entries(ratingCounts)) {
        console.log(`  ${r} star: ${cnt} comments`);
    }
    console.log("\nBreakdown By User:");
    for (const [uid, cnt] of Object.entries(userCounts)) {
        const u = userMap.get(uid);
        console.log(`  ${u?.name || u?.email || uid}: ${cnt} comments`);
    }
    console.log("\n========== COMPLETED ==========\n");

    await client.close();
}

main();
