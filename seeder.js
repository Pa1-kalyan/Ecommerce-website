const fs = require('fs');
const path = require('path');
const https = require('http');

// Configuration
const BASE_URL = 'http://localhost:2424';
const ADMIN_EMAIL = process.argv[2] || 'admin@example.com';
const ADMIN_PASSWORD = process.argv[3] || 'adminpassword';
const IMAGE_DIR = 'C:\\Users\\pachi\\Desktop\\Full stack webs\\E-Commerce\\Pics';

// Product List provided by User
const PRODUCTS_DATA = {
    'Electronics': [
        "Apple MacBook Air M2",
        "Samsung Galaxy S23 Ultra",
        "Sony WH-1000XM5 Noise Cancelling Headphones",
        "Dell Inspiron 15 Laptop",
        "Logitech MX Master 3 Wireless Mouse",
        "Canon EOS 1500D DSLR Camera",
        "Apple iPad 10th Generation",
        "JBL Flip 6 Bluetooth Speaker",
        "OnePlus 12 5G Smartphone",
        "HP Pavilion Gaming Laptop"
    ],
    'Fashion': [
        "Men’s Slim Fit Formal Shirt",
        "Women’s Floral Summer Dress",
        "Men’s Leather Wallet",
        "Unisex Running Shoes",
        "Men’s Casual Denim Jacket",
        "Women’s Ethnic Kurti Set",
        "Classic Analog Watch",
        "Cotton Round Neck T-Shirt",
        "Designer Sunglasses"
    ],
    'Kitchen': [
        "Non-Stick Cookware Set",
        "Stainless Steel Water Bottle",
        "Electric Kettle",
        "Premium Bedsheet Set",
        "Microwave Oven",
        "Wooden Dining Chair",
        "Air Fryer 4L Capacity",
        "Storage Organizer Box Set",
        "Automatic Room Humidifier"
    ],
    'Books': [
        "Atomic Habits – James Clear",
        "The Psychology of Money – Morgan Housel",
        "Rich Dad Poor Dad – Robert Kiyosaki",
        "The Alchemist – Paulo Coelho",
        "Ikigai – Hector Garcia",
        "Think and Grow Rich – Napoleon Hill",
        "The Power of Now – Eckhart Tolle",
        "Deep Work – Cal Newport",
        "The 7 Habits of Highly Effective People",
        "Zero to One – Peter Thiel"
    ],
    'Sports': [
        "Adjustable Dumbbell Set",
        "Yoga Mat",
        "Treadmill for Home Use",
        "Skipping Rope",
        "Protein Shaker Bottle",
        "Resistance Bands Set",
        "Cricket Bat",
        "Football",
        "Gym Gloves",
        "Foam Roller for Muscle Recovery"
    ]
};

// Helper: Random Int
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper: Normalize String for Matching
const normalize = (str) => {
    return str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

// Helper: Generate Details
const generateDetails = (category, name) => {
    let price = 0;

    // Price Ranges (INR)
    switch (category) {
        case 'Electronics': price = randomInt(2000, 150000); break;
        case 'Fashion': price = randomInt(500, 5000); break;
        case 'Kitchen': price = randomInt(500, 15000); break;
        case 'Books': price = randomInt(200, 1000); break;
        case 'Sports': price = randomInt(300, 25000); break;
        default: price = 1000;
    }

    // Descriptions
    const adjectives = ["Premium", "High-quality", "Durable", "Best-selling", "Authentic", "Modern"];
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];

    let desc = `Experience the best with this ${adj.toLowerCase()} ${name}. \n`;
    desc += `Perfect for your daily needs and designed for long-lasting performance. \n`;
    desc += `Get this top-rated product now at an unbeatable price. Satisfaction guaranteed.`;

    return { price, description: desc, quantity: randomInt(5, 10) };
};

// Helper: HTTP Request
const request = (method, path, headers = {}, data = null, isMultipart = false) => {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: headers
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        resolve(body);
                    }
                } else {
                    reject(`Request failed ${res.statusCode}: ${body}`);
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data && !isMultipart) {
            req.write(JSON.stringify(data));
        } else if (data && isMultipart) {
            req.write(data);
        }

        req.end();
    });
};

// Login
const login = async () => {
    console.log(`Logging in as ${ADMIN_EMAIL}...`);
    try {
        const response = await request('POST', '/auth/login', { 'Content-Type': 'application/json' }, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        console.log('Login successful!');
        return response.token;
    } catch (error) {
        console.error('Login failed:', error);
        process.exit(1);
    }
};

// Create Category
const createCategory = async (token, categoryName) => {
    try {
        const response = await request('POST', '/category/create', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }, { name: categoryName });
        return response.category;
    } catch (error) {
        return null; // Likely exists
    }
};

// Get Categories
const getCategories = async (token) => {
    try {
        const response = await request('GET', '/category/get-all', { 'Authorization': `Bearer ${token}` });
        return response.categoryList || [];
    } catch (error) {
        return [];
    }
}

// Create Product
const createProduct = async (token, categoryId, productData, imagePath) => {
    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="categoryId"\r\n\r\n${categoryId}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="name"\r\n\r\n${productData.name}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="description"\r\n\r\n${productData.description}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="price"\r\n\r\n${productData.price}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="quantity"\r\n\r\n${productData.quantity}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="image"; filename="${path.basename(imagePath)}"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;

    const fileContent = fs.readFileSync(imagePath);
    const preBody = Buffer.from(body, 'utf-8');
    const postBody = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
    const payload = Buffer.concat([preBody, fileContent, postBody]);

    try {
        await request('POST', '/product/create', {
            'Authorization': `Bearer ${token}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': payload.length
        }, payload, true);
        console.log(`[SUCCESS] Created: ${productData.name}`);
    } catch (error) {
        console.error(`[FAILED] ${productData.name}: ${error}`);
    }
};

const main = async () => {
    console.log('Starting Targeted Seeder (Local Images)...');

    // 0. Verify and Index Images
    if (!fs.existsSync(IMAGE_DIR)) {
        console.error(`ERROR: Image directory not found at ${IMAGE_DIR}`);
        process.exit(1);
    }

    const files = fs.readdirSync(IMAGE_DIR);
    const imageMap = {};
    files.forEach(f => {
        const norm = normalize(path.parse(f).name);
        imageMap[norm] = f;
    });
    console.log(`Indexed ${Object.keys(imageMap).length} images.`);

    const token = await login();

    // 1. Create Categories
    for (const categoryName of Object.keys(PRODUCTS_DATA)) {
        await createCategory(token, categoryName);
    }

    // 2. Map Category IDs
    const categories = await getCategories(token);
    const categoryMap = {};
    categories.forEach(c => categoryMap[c.name] = c.id);

    // 3. Create Products
    for (const [categoryName, products] of Object.entries(PRODUCTS_DATA)) {
        const catId = categoryMap[categoryName];
        if (!catId) {
            console.log(`Skipping category ${categoryName} (ID not found)`);
            continue;
        }

        console.log(`\nSeeding ${categoryName}...`);

        for (const productName of products) {
            // Find Image (Fuzzy Match)
            const normName = normalize(productName);
            const filename = imageMap[normName];

            if (!filename) {
                console.warn(`  [MISSING IMAGE] Could not find image for "${productName}" (Normalized: ${normName})`);
                // Fallback attempt: try to find strict match? No, normalize should cover it.
                // Maybe log valid keys for debugging?
                // console.log(`   Available Keys: ${Object.keys(imageMap).slice(0, 5)}...`);
                continue;
            }

            const imagePath = path.join(IMAGE_DIR, filename);

            // Generate Details
            const details = generateDetails(categoryName, productName);

            // Create
            await createProduct(token, catId, {
                name: productName,
                ...details
            }, imagePath);

            // Small delay
            await new Promise(r => setTimeout(r, 100));
        }
    }

    console.log(`\nSeeding Completed!`);
};

main();
