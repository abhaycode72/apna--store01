const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS for Next.js Frontend
app.use(cors({ origin: '*' }));
app.use(express.json());

// Initialize Redis Client (For fast sub-second inventory locking)
const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
});

// Initialize Real-time WebSockets
const io = new Server(server, {
  cors: { origin: '*' }
});

// Mock Database Storage (Production me PostgreSQL replace karega)
let mockOrders = [];
let mockInventory = {
  'prod_101': { name: 'Farm Fresh Milk', price: 32, stock: 15 },
  'prod_102': { name: 'Whole Wheat Bread', price: 45, stock: 8 },
};

// ==========================================
// 1. REAL-TIME SOCKET CONNECTION (For Admin)
// ==========================================
io.on('connection', (socket) => {
  console.log('⚡ Client connected to Real-Time Feed:', socket.id);

  // Send current live orders immediately on connect
  socket.emit('initial_orders', mockOrders);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// ==========================================
// 2. ORDER CREATION API (Online + COD Flow)
// ==========================================
app.post('/api/orders/create', async (req, res) => {
  try {
    const { customerName, address, items, paymentMode, darkStoreId } = req.body;

    // A. COD Security Constraint Check
    let totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 15; // +15 Delivery fee
    
    if (paymentMode === 'COD' && totalAmount > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Cash on Delivery is limited to orders below ₹1,000. Please select Online Payment.'
      });
    }

    // B. Atomic Inventory Lock using Redis (Preventing Out-of-Stock errors)
    for (const item of items) {
      const currentStock = await redis.get(`stock:${item.id}`) || mockInventory[item.id]?.stock || 0;
      
      if (parseInt(currentStock) < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Item ${item.name} went out of stock!`
        });
      }
    }

    // Deduct stock in Redis instantly
    for (const item of items) {
      await redis.decrby(`stock:${item.id}`, item.quantity);
    }

    // C. Create Order Object
    const newOrder = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      address,
      items,
      totalAmount,
      paymentMode, // 'ONLINE' or 'COD'
      paymentStatus: paymentMode === 'ONLINE' ? 'PAID' : 'PENDING_COLLECTION',
      orderStatus: 'ORDER_PLACED', // Status for Dark Store Picker App
      darkStoreId: darkStoreId || 'Patna Central DS',
      createdAt: new Date().toLocaleTimeString()
    };

    mockOrders.unshift(newOrder);

    // D. BROADCAST TO ADMIN & DARK STORE VIA WEBSOCKETS (Zero Delay)
    io.emit('new_order_received', newOrder);

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully! Delivery within 10 minutes.',
      order: newOrder
    });

  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// ==========================================
// 3. ADMIN STATUS UPDATE API
// ==========================================
// Order ka status change karne ke liye (Packing -> Out for Delivery -> Delivered)
app.post('/api/admin/update-status', (req, res) => {
  const { orderId, newStatus } = req.body;
  
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.orderStatus = newStatus;
    
    // Broadcast status update to Admin Dashboard & Customer App Tracking Screen
    io.emit('order_status_updated', { orderId, newStatus });
    
    return res.json({ success: true, message: `Order status updated to ${newStatus}` });
  }

  res.status(404).json({ success: false, message: 'Order not found' });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Quick Commerce Backend Server running on http://localhost:${PORT}`);
});