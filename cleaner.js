const https = require('http');

// Configuration
const BASE_URL = 'http://localhost:2424';
const ADMIN_EMAIL = process.argv[2] || 'admin@example.com';
const ADMIN_PASSWORD = process.argv[3] || 'adminpassword';

// Helper: HTTP Request
const request = (method, path, headers = {}, data = null) => {
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
                    // Try to parse error body
                    try {
                        const errorBody = JSON.parse(body);
                        reject(`Request failed ${res.statusCode}: ${errorBody.message || body}`);
                    } catch (e) {
                        reject(`Request failed with status ${res.statusCode}: ${body}`);
                    }
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (data) req.write(JSON.stringify(data));
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

// Get All Products
const getProducts = async (token) => {
    try {
        const response = await request('GET', '/product/get-all', { 'Authorization': `Bearer ${token}` });
        return response.productList || [];
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return [];
    }
};

// Delete Product
const deleteProduct = async (token, productId) => {
    try {
        await request('DELETE', `/product/delete/${productId}`, { 'Authorization': `Bearer ${token}` });
        console.log(`Deleted Product ID: ${productId}`);
    } catch (error) {
        console.error(`Failed to delete product ${productId}:`, error);
    }
};

// Get All Categories
const getCategories = async (token) => {
    try {
        const response = await request('GET', '/category/get-all', { 'Authorization': `Bearer ${token}` });
        return response.categoryList || [];
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
};

// Delete Category
const deleteCategory = async (token, categoryId) => {
    try {
        await request('DELETE', `/category/delete/${categoryId}`, { 'Authorization': `Bearer ${token}` });
        console.log(`Deleted Category ID: ${categoryId}`);
    } catch (error) {
        // Categories might fail if they still have products (FK constraint), but we delete products first.
        console.error(`Failed to delete category ${categoryId}:`, error);
    }
};

const main = async () => {
    console.log('Starting Cleanup Script...');
    const token = await login();

    // 1. Delete Products (Must be done first to avoid FK constraints)
    console.log('\nFetching Products...');
    const products = await getProducts(token);
    console.log(`Found ${products.length} products.`);

    for (const product of products) {
        await deleteProduct(token, product.id);
    }

    // 2. Delete Categories
    console.log('\nFetching Categories...');
    const categories = await getCategories(token);
    console.log(`Found ${categories.length} categories.`);

    for (const category of categories) {
        await deleteCategory(token, category.id);
    }

    console.log('\nCleanup Completed!');
};

main();
