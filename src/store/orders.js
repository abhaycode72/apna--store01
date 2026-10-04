// In-memory orders database for Apna Store
const initialSeedOrders = [
  {
    id: 'ORD-8941',
    customer: {
      name: 'Priya Sharma',
      mobile: '9876543210',
      email: 'priya.sharma@example.com',
      address: 'Flat 402, Ganga Heights, Kankarbagh Road',
      location: 'Kankarbagh, Patna',
    },
    items: [
      { id: 1, name: 'Amul Taaza Toned Milk', weight: '500 ml', price: 27, quantity: 2 },
      { id: 3, name: 'Britannia White Bread', weight: '400 g', price: 45, quantity: 1 },
      { id: 4, name: 'Farm Fresh Eggs', weight: '6 pieces', price: 48, quantity: 1 },
    ],
    paymentMethod: 'upi',
    paymentStatus: 'PAID',
    total: 162, // 147 + 15 delivery
    status: 'ORDER_PLACED',
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    assignedRider: null,
    notes: 'Please leave at the door with security guard if not answering.',
    preparationTimeEstimate: '6 mins',
  },
  {
    id: 'ORD-8940',
    customer: {
      name: 'Mayank Kumar',
      mobile: '9835012345',
      email: 'mayank.k@example.com',
      address: 'House #12, Lane 3, Boring Canal Road',
      location: 'Boring Road, Patna',
    },
    items: [
      { id: 7, name: 'Onion (Pyaz)', weight: '1 kg', price: 35, quantity: 1 },
      { id: 9, name: 'Tomato (Tamatar)', weight: '1 kg', price: 45, quantity: 1 },
      { id: 13, name: "Lay's Magic Masala Chips", weight: '50 g', price: 20, quantity: 2 },
    ],
    paymentMethod: 'cod',
    paymentStatus: 'PENDING_COLLECTION',
    total: 135, // 120 + 15 delivery
    status: 'PACKING',
    createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    assignedRider: 'Sunil Yadav',
    notes: 'Call before reaching.',
    preparationTimeEstimate: '3 mins remaining',
  },
  {
    id: 'ORD-8939',
    customer: {
      name: 'Rajesh Verma',
      mobile: '9431098765',
      email: 'rajesh.v@example.com',
      address: '3rd Floor, Shanti Enclave, Bailey Road',
      location: 'Bailey Road, Patna',
    },
    items: [
      { id: 21, name: 'Coca-Cola', weight: '750 ml', price: 40, quantity: 2 },
      { id: 18, name: 'Maggi 2-Minute Noodles', weight: '140 g', price: 28, quantity: 4 },
      { id: 2, name: 'Amul Butter', weight: '100 g', price: 58, quantity: 1 },
    ],
    paymentMethod: 'upi',
    paymentStatus: 'PAID',
    total: 265,
    status: 'OUT_FOR_DELIVERY',
    createdAt: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    assignedRider: 'Deepak Kumar',
    notes: 'Ring the blue bell.',
    preparationTimeEstimate: 'Out with rider',
  },
  {
    id: 'ORD-8938',
    customer: {
      name: 'Ananya Roy',
      mobile: '9123456789',
      email: 'ananya.roy@example.com',
      address: 'Plot 88, Road 2, Patliputra Colony',
      location: 'Patliputra Colony, Patna',
    },
    items: [
      { id: 10, name: 'Fresh Bananas', weight: '6 pieces', price: 42, quantity: 2 },
      { id: 1, name: 'Amul Taaza Toned Milk', weight: '500 ml', price: 27, quantity: 1 },
    ],
    paymentMethod: 'upi',
    paymentStatus: 'PAID',
    total: 126,
    status: 'DELIVERED',
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    assignedRider: 'Amit Singh',
    notes: 'Delivered successfully in 8.5 minutes.',
    preparationTimeEstimate: 'Completed',
  },
  {
    id: 'ORD-8937',
    customer: {
      name: 'Vikram Aditya',
      mobile: '9811122334',
      email: 'vikram.a@example.com',
      address: 'Near Old Bus Stand, Rajendra Nagar',
      location: 'Rajendra Nagar, Patna',
    },
    items: [
      { id: 13, name: "Lay's Magic Masala Chips", weight: '50 g', price: 20, quantity: 5 },
      { id: 21, name: 'Coca-Cola', weight: '750 ml', price: 40, quantity: 2 },
    ],
    paymentMethod: 'cod',
    paymentStatus: 'CANCELLED',
    total: 195,
    status: 'CANCELLED',
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    assignedRider: null,
    notes: 'Customer cancelled due to change in location.',
    preparationTimeEstimate: 'Cancelled',
  },
];

const orders = [...initialSeedOrders];

export function addOrder(order) {
  orders.unshift(order);
  return order;
}

export function getOrders() {
  return orders;
}

export function updateOrder(orderId, updates) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) return null;
  Object.assign(order, updates);
  return order;
}

export function deleteOrder(orderId) {
  const index = orders.findIndex((item) => item.id === orderId);
  if (index === -1) return false;
  orders.splice(index, 1);
  return true;
}