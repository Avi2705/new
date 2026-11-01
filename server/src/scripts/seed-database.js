import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "ecommmerce";

const PASSWORD_HASH = bcrypt.hashSync("Qwer4321!", 10);

const USERS_SEED = Array.from({ length: 10 }, (_, i) => ({
    name: `user${i + 1}`,
    email: `user${i + 1}@gmail.com`,
    password: PASSWORD_HASH,
    isVerified: true,
    sessions: [],
    resetPasswordTokenHash: null,
    resetPasswordExpiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
}));

const VENDORS_SEED = Array.from({ length: 5 }, (_, i) => ({
    name: `vendor${i + 1}`,
    email: `vendor${i + 1}@gmail.com`,
    password: PASSWORD_HASH,
    isVerified: true,
    sessions: [],
    resetPasswordTokenHash: null,
    resetPasswordExpiresAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
}));

const REAL_PRODUCTS_DATA = [
    { productName: "Apple Watch Series 9", productDescription: "Advanced smartwatch with fitness tracking and ECG.", productCategory: "watch", price: 399 },
    { productName: "Samsung Galaxy Watch 6", productDescription: "Classic rotating bezel with deep sleep insights.", productCategory: "watch", price: 299 },
    { productName: "Garmin Fenix 7 Pro", productDescription: "Solar powered multi-sport rugged GPS smartwatch.", productCategory: "watch", price: 799 },
    { productName: "Fossil Gen 6 Smartwatch", productDescription: "Stainless steel touch display smartwatch with wearOS.", productCategory: "watch", price: 199 },
    { productName: "Titan Edge Classic Watch", productDescription: "Ultra-slim luxury analog watch with sapphire glass.", productCategory: "watch", price: 150 },
    { productName: "Casio G-Shock Mudmaster", productDescription: "Tough shock-resistant adventure watch with barometer.", productCategory: "watch", price: 220 },

    { productName: "Samsung 653L French Door Refrigerator", productDescription: "Smart convertible French door fridge with digital inverter.", productCategory: "fridge", price: 1200 },
    { productName: "LG 260L Double Door Refrigerator", productDescription: "Smart inverter frost free double door refrigerator.", productCategory: "fridge", price: 450 },
    { productName: "Whirlpool 190L Single Door Fridge", productDescription: "Energy efficient single door compact home refrigerator.", productCategory: "fridge", price: 260 },
    { productName: "Haier 346L Bottom Mount Fridge", productDescription: "Frost free bottom mounted refrigerator with triple inverter.", productCategory: "fridge", price: 580 },
    { productName: "Bosch 559L Side-by-Side Fridge", productDescription: "Spacious multi-airflow side by side stainless steel fridge.", productCategory: "fridge", price: 1100 },

    { productName: "Organic Whole Almonds 1kg", productDescription: "Premium raw California whole almonds rich in protein.", productCategory: "grocerys", price: 18 },
    { productName: "Extra Virgin Olive Oil 1L", productDescription: "Cold-pressed extra virgin olive oil from Spain.", productCategory: "grocerys", price: 24 },
    { productName: "Basmati Royal Rice 5kg", productDescription: "Long grain aromatic aged Indian basmati rice.", productCategory: "grocerys", price: 22 },
    { productName: "Organic Pure Wild Honey 500g", productDescription: "100% natural unprocessed forest honey in glass jar.", productCategory: "grocerys", price: 15 },
    { productName: "Arabica Whole Bean Coffee 500g", productDescription: "Artisan roasted whole coffee beans with chocolate notes.", productCategory: "grocerys", price: 19 },
    { productName: "Pure Rolled Oats 1.2kg", productDescription: "High-fiber whole grain rolled oats for breakfast.", productCategory: "grocerys", price: 9 },

    { productName: "LG OLED evo C3 55 Inch 4K Smart TV", productDescription: "Stunning 4K OLED TV with Dolby Vision and 120Hz refresh.", productCategory: "tv", price: 1399 },
    { productName: "Sony Bravia XR 65 Inch 4K HDR TV", productDescription: "Cognitive processor XR powered LED smart Google TV.", productCategory: "tv", price: 1199 },
    { productName: "Samsung QLED 4K 50 Inch Q60C", productDescription: "Quantum dot color volume 4K ultra HD television.", productCategory: "tv", price: 649 },
    { productName: "TCL 43 Inch 4K Google TV", productDescription: "Affordable borderless HDR10 smart home television.", productCategory: "tv", price: 280 },
    { productName: "Mi 32 Inch HD Ready Smart TV", productDescription: "Compact smart Android TV with stereo speaker array.", productCategory: "tv", price: 170 },

    { productName: "Apple MacBook Pro 16 M3 Max", productDescription: "Top performance laptop with Liquid Retina XDR screen.", productCategory: "laptop", price: 3499 },
    { productName: "Dell XPS 15 9530 Laptop", productDescription: "OLED touch screen laptop with Intel Core i7 and RTX GPU.", productCategory: "laptop", price: 1899 },
    { productName: "Lenovo ThinkPad X1 Carbon Gen 11", productDescription: "Ultra-lightweight business laptop with durable chassis.", productCategory: "laptop", price: 1549 },
    { productName: "ASUS ROG Zephyrus G14 Gaming Laptop", productDescription: "High refresh rate portable powerhouse gaming laptop.", productCategory: "laptop", price: 1450 },
    { productName: "HP Spectre x360 2-in-1 Laptop", productDescription: "Convertible touchscreen laptop with digital stylus support.", productCategory: "laptop", price: 1399 },
    { productName: "Acer Swift Go 14 OLED Laptop", productDescription: "Slim lightweight ultrabook with 2.8K vibrant OLED panel.", productCategory: "laptop", price: 799 },

    { productName: "Apple iPhone 15 Pro Max 256GB", productDescription: "Titanium design with A17 Pro chip and 5x optical zoom.", productCategory: "mobile", price: 1199 },
    { productName: "Samsung Galaxy S24 Ultra 512GB", productDescription: "AI powered smartphone with built-in S-Pen and 200MP camera.", productCategory: "mobile", price: 1299 },
    { productName: "Google Pixel 8 Pro 128GB", productDescription: "Pure Android experience with best in class computational photo.", productCategory: "mobile", price: 999 },
    { productName: "OnePlus 12 5G Smartphone", productDescription: "Snapdragon 8 Gen 3 with 100W SUPERVOOC hyper charging.", productCategory: "mobile", price: 799 },
    { productName: "Xiaomi 14 Ultra 512GB", productDescription: "Flagship Leica quad camera mobile with 1-inch sensor.", productCategory: "mobile", price: 1050 },
    { productName: "Motorola Edge 50 Pro 256GB", productDescription: "Pantone validated camera mobile with 125W TurboPower.", productCategory: "mobile", price: 450 },

    { productName: "Apple AirPods Pro 2nd Gen USB-C", productDescription: "Active noise cancelling wireless earbuds with spatial audio.", productCategory: "buds", price: 249 },
    { productName: "Sony WF-1000XM5 Wireless Earbuds", productDescription: "Industry leading noise cancellation with Hi-Res LDAC audio.", productCategory: "buds", price: 279 },
    { productName: "Bose QuietComfort Ultra Earbuds", productDescription: "Immersive audio earbuds with world class noise cancel tech.", productCategory: "buds", price: 299 },
    { productName: "Samsung Galaxy Buds 2 Pro", productDescription: "24-bit Hi-Fi sound wireless earbuds with seamless device switch.", productCategory: "buds", price: 180 },
    { productName: "JBL Live Pro 2 TWS Earbuds", productDescription: "True wireless earbuds with 40-hour battery and punchy bass.", productCategory: "buds", price: 130 },
    { productName: "Sennheiser Momentum True Wireless 4", productDescription: "Audiophile-grade acoustic fidelity with lossless sound.", productCategory: "buds", price: 260 },

    { productName: "Ergonomic Mesh Executive Chair", productDescription: "High-back breathable mesh chair with 3D lumbar support.", productCategory: "furnitntes", price: 280 },
    { productName: "Solid Sheesham Wood King Bed", productDescription: "Durable natural teak finish solid wood king size bedframe.", productCategory: "furnitntes", price: 650 },
    { productName: "Modern L-Shaped Sectional Sofa", productDescription: "Comfortable high density fabric 5-seater corner sofa.", productCategory: "furnitntes", price: 890 },
    { productName: "Motorized Electric Standing Desk", productDescription: "Dual motor height adjustable sit-stand wooden work desk.", productCategory: "furnitntes", price: 420 },
    { productName: "Oak Veneer 6-Seater Dining Table", productDescription: "Sturdy Scandinavian style solid wood dining table set.", productCategory: "furnitntes", price: 540 },
    { productName: "Solid Wood 4-Tier Bookshelf", productDescription: "Open display modern ladder bookshelf with storage rack.", productCategory: "furnitntes", price: 160 },
    { productName: "Modern Minimalist Coffee Table", productDescription: "Tempered glass top nesting round coffee table set.", productCategory: "furnitntes", price: 130 },
    { productName: "Reclining Leather Lounge Armchair", productDescription: "Plush padded ergonomic single lounge recliner armchair.", productCategory: "furnitntes", price: 340 },

    { productName: "Anker 737 Fast Power Bank 24000mAh", productDescription: "140W high-speed portable battery bank with smart digital display.", productCategory: "electronics", price: 129 },
    { productName: "Logitech MX Master 3S Wireless Mouse", productDescription: "Ultra-quiet ergonomic performance mouse with 8K DPI tracking.", productCategory: "electronics", price: 99 },
    { productName: "Keychron K2 Wireless Mechanical Keyboard", productDescription: "Hot-swappable 75% layout RGB Bluetooth mechanical keyboard.", productCategory: "electronics", price: 89 }
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
    "Overpriced for what you get. Not worth even ten percent of the price."
];

const COMMENTS_2_STAR = [
    "Underwhelming. Expected much better build quality for this price.",
    "Works poorly. Loses power quickly and gets uncomfortably hot.",
    "Subpar craftsmanship. Finishing is rough around the edges.",
    "Broke after 2 weeks of light usage. Very disappointing durability.",
    "Functions intermittently. Have to restart it multiple times.",
    "Cheap plastic components. Feels like a toy rather than real equipment.",
    "Battery drains quickly. Inconvenient and frustrating.",
    "Shipping box was soaked and product shows signs of damage.",
    "Difficult to calibrate and the manual is written poorly.",
    "Would not recommend. You can get far better alternatives for cheaper."
];

const COMMENTS_3_STAR = [
    "It is okay I guess. Nothing special but gets the basic job done.",
    "Average product. Not great, not terrible either. Decent enough.",
    "Fair for the price point, but definitely leaves room for improvements.",
    "Works fine so far, although the finishing feels somewhat rushed.",
    "Expected slightly more performance, but acceptable for home use.",
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

async function seedDatabase() {
    console.log("========== STARTING DATABASE SEEDING ==========\n");

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log("Connected to MongoDB successfully.\n");

    const db = client.db(DB_NAME);

    console.log("Clearing all collections in database: " + DB_NAME);
    await db.collection("users").deleteMany({});
    await db.collection("vendor").deleteMany({});
    await db.collection("products").deleteMany({});
    await db.collection("productPrices").deleteMany({});
    await db.collection("prices").deleteMany({});
    await db.collection("reviews").deleteMany({});
    await db.collection("orders").deleteMany({});
    console.log("Collections cleared.\n");

    console.log("Inserting 10 verified users...");
    const userInsertRes = await db.collection("users").insertMany(USERS_SEED);
    const userIds = Object.values(userInsertRes.insertedIds);
    console.log(`Inserted ${userIds.length} users (user1@gmail.com to user10@gmail.com)\n`);

    console.log("Inserting 5 verified vendors...");
    const vendorInsertRes = await db.collection("vendor").insertMany(VENDORS_SEED);
    const vendorIds = Object.values(vendorInsertRes.insertedIds);
    console.log(`Inserted ${vendorIds.length} vendors (vendor1@gmail.com to vendor5@gmail.com)\n`);

    console.log(`Inserting ${REAL_PRODUCTS_DATA.length} products across watch, fridge, grocerys, tv, laptop, mobile, buds, furnitntes...`);

    const productDocs = REAL_PRODUCTS_DATA.map((p, idx) => {
        const assignedVendorId = vendorIds[idx % vendorIds.length];
        return {
            _id: new ObjectId(),
            productName: p.productName,
            productDescription: p.productDescription,
            productCategory: p.productCategory,
            productImages: [],
            productVideos: [],
            vendorId: assignedVendorId,
            currentPrice: p.price,
            isDeleted: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    await db.collection("products").insertMany(productDocs);
    console.log(`Inserted ${productDocs.length} products.\n`);

    console.log("Inserting active prices for each product in both productPrices & prices collections...");
    const priceDocs = productDocs.map(p => ({
        productId: p._id,
        price: p.currentPrice,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }));

    await db.collection("productPrices").insertMany(priceDocs);
    await db.collection("prices").insertMany(priceDocs);
    console.log(`Inserted ${priceDocs.length} active prices.\n`);

    const COMMENTS_PER_PRODUCT = 100;
    console.log(`Generating and inserting ${COMMENTS_PER_PRODUCT} comments per product across all 10 users with ratings 0-5 and dates 2024-2026...`);

    const reviewDocs = [];
    let commentCounter = 0;

    for (const product of productDocs) {
        for (let i = 0; i < COMMENTS_PER_PRODUCT; i++) {
            commentCounter++;
            const userIndex = commentCounter % userIds.length;
            const chosenUserId = userIds[userIndex];
            const chosenUserName = `user${userIndex + 1}`;

            const rating = getRandomRating();
            const commentPool = RATING_COMMENT_MAP[rating];
            const baseComment = commentPool[Math.floor(Math.random() * commentPool.length)];
            const comment = `${baseComment} [#${(commentCounter % 999) + 1}]`;

            const date = randomDateBetween(
                new Date("2024-01-01T00:00:00Z"),
                new Date("2026-10-28T00:00:00Z")
            );

            reviewDocs.push({
                productId: product._id,
                productName: product.productName,
                vendorId: product.vendorId,
                userId: chosenUserId,
                userName: chosenUserName,
                rating,
                comment,
                createdAt: date,
                updatedAt: date
            });
        }
    }

    const BATCH_SIZE = 500;
    let reviewsInserted = 0;
    for (let i = 0; i < reviewDocs.length; i += BATCH_SIZE) {
        const batch = reviewDocs.slice(i, i + BATCH_SIZE);
        const res = await db.collection("reviews").insertMany(batch);
        reviewsInserted += res.insertedCount;
        process.stdout.write(`  Inserted ${reviewsInserted}/${reviewDocs.length} reviews...\r`);
    }

    console.log(`\n\nInserted ${reviewsInserted} total reviews.\n`);

    console.log("========== SEED SUMMARY ==========");
    console.log(`Users:     10 (user1@gmail.com to user10@gmail.com, password: Qwer4321!)`);
    console.log(`Vendors:   5 (vendor1@gmail.com to vendor5@gmail.com, password: Qwer4321!)`);
    console.log(`Products:  ${productDocs.length} real products across all requested categories`);
    console.log(`Prices:    ${priceDocs.length} active prices set`);
    console.log(`Reviews:   ${reviewsInserted} reviews (ratings 0-5 stars, dates 2024-2026)`);
    console.log("===================================\n");

    await client.close();
}

seedDatabase().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
