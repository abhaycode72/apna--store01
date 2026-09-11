-- 1. Dark Stores Table
CREATE TABLE dark_stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 2. Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    dark_store_id INT REFERENCES dark_stores(id)
);

-- 3. Orders Table (Online + COD Support)
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(20) CHECK (payment_mode IN ('ONLINE', 'COD')),
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    order_status VARCHAR(30) DEFAULT 'ORDER_PLACED', -- ORDER_PLACED, PACKING, OUT_FOR_DELIVERY, DELIVERED
    dark_store_id INT REFERENCES dark_stores(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);