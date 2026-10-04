// In-memory Store Manager Operational Data (Inventory, Fleet, Store Settings)

export const initialInventory = [
  {
    id: 1,
    name: 'Amul Taaza Toned Milk',
    category: 'Dairy & Breakfast',
    weight: '500 ml',
    price: 27,
    mrp: 30,
    stock: 45,
    minThreshold: 15,
    shelfLocation: 'Aisle A-01 (Dairy Chiller)',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 2,
    name: 'Amul Butter',
    category: 'Dairy & Breakfast',
    weight: '100 g',
    price: 58,
    mrp: 60,
    stock: 18,
    minThreshold: 10,
    shelfLocation: 'Aisle A-02 (Butter Tray)',
    image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Britannia White Bread',
    category: 'Dairy & Breakfast',
    weight: '400 g',
    price: 45,
    mrp: 50,
    stock: 4,
    minThreshold: 10,
    shelfLocation: 'Aisle B-01 (Bakery Shelf)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 4,
    name: 'Farm Fresh Eggs',
    category: 'Dairy & Breakfast',
    weight: '6 pieces',
    price: 48,
    mrp: 55,
    stock: 24,
    minThreshold: 12,
    shelfLocation: 'Aisle A-04 (Egg Racks)',
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 7,
    name: 'Onion (Pyaz)',
    category: 'Vegetables & Fruits',
    weight: '1 kg',
    price: 35,
    mrp: 40,
    stock: 40,
    minThreshold: 15,
    shelfLocation: 'Produce Bin P-03',
    image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 9,
    name: 'Tomato (Tamatar)',
    category: 'Vegetables & Fruits',
    weight: '1 kg',
    price: 45,
    mrp: 50,
    stock: 3,
    minThreshold: 10,
    shelfLocation: 'Produce Bin P-01',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 10,
    name: 'Fresh Bananas',
    category: 'Vegetables & Fruits',
    weight: '6 pieces',
    price: 42,
    mrp: 48,
    stock: 0,
    minThreshold: 8,
    shelfLocation: 'Produce Rack P-07',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=640&q=85',
    isAvailable: false,
  },
  {
    id: 13,
    name: "Lay's India's Magic Masala Chips",
    category: 'Snacks',
    weight: '50 g',
    price: 20,
    mrp: 20,
    stock: 65,
    minThreshold: 20,
    shelfLocation: 'Aisle C-02 (Chips)',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 18,
    name: 'Maggi 2-Minute Masala Noodles',
    category: 'Instant Food',
    weight: '140 g',
    price: 28,
    mrp: 30,
    stock: 52,
    minThreshold: 15,
    shelfLocation: 'Aisle C-05 (Instant Foods)',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 21,
    name: 'Coca-Cola',
    category: 'Beverages',
    weight: '750 ml',
    price: 40,
    mrp: 45,
    stock: 30,
    minThreshold: 10,
    shelfLocation: 'Beverage Cooler D-01',
    image: 'https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 25,
    name: 'Fortune Sunlite Refined Sunflower Oil',
    category: 'Cooking Essentials',
    weight: '1 L',
    price: 135,
    mrp: 150,
    stock: 14,
    minThreshold: 8,
    shelfLocation: 'Aisle E-03 (Edible Oils)',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
  {
    id: 26,
    name: 'Aashirvaad Superior MP Shudh Chakki Atta',
    category: 'Cooking Essentials',
    weight: '5 kg',
    price: 245,
    mrp: 270,
    stock: 9,
    minThreshold: 6,
    shelfLocation: 'Heavy Pallet H-02',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=640&q=85',
    isAvailable: true,
  },
];

export const initialRiders = [
  {
    id: 'RDR-101',
    name: 'Sunil Yadav',
    phone: '9871100112',
    vehicle: 'Honda Shine (BR-01-AB-1234)',
    status: 'AVAILABLE', // AVAILABLE, DELIVERING, ON_BREAK, OFFLINE
    activeOrderId: null,
    deliveriesToday: 14,
    rating: 4.9,
    batteryOrFuel: '85%',
    avatarColor: 'bg-emerald-500',
  },
  {
    id: 'RDR-102',
    name: 'Deepak Kumar',
    phone: '9871100223',
    vehicle: 'Ather 450X EV (BR-01-EV-5678)',
    status: 'DELIVERING',
    activeOrderId: 'ORD-8939',
    deliveriesToday: 19,
    rating: 4.8,
    batteryOrFuel: '62%',
    avatarColor: 'bg-blue-500',
  },
  {
    id: 'RDR-103',
    name: 'Amit Singh',
    phone: '9871100334',
    vehicle: 'Hero Splendor (BR-01-CD-9012)',
    status: 'AVAILABLE',
    activeOrderId: null,
    deliveriesToday: 12,
    rating: 4.9,
    batteryOrFuel: '90%',
    avatarColor: 'bg-indigo-500',
  },
  {
    id: 'RDR-104',
    name: 'Ravi Ranjan',
    phone: '9871100445',
    vehicle: 'TVS Jupiter (BR-01-XY-3456)',
    status: 'ON_BREAK',
    activeOrderId: null,
    deliveriesToday: 8,
    rating: 4.7,
    batteryOrFuel: '40%',
    avatarColor: 'bg-amber-500',
  },
  {
    id: 'RDR-105',
    name: 'Sonu Pandit',
    phone: '9871100556',
    vehicle: 'Ola S1 Pro (BR-01-EV-7890)',
    status: 'OFFLINE',
    activeOrderId: null,
    deliveriesToday: 0,
    rating: 4.6,
    batteryOrFuel: '95%',
    avatarColor: 'bg-gray-400',
  },
];

export const initialStoreStatus = {
  storeId: 'STORE-PAT-04',
  storeName: 'Apna Store #04 - Patna Central Hub',
  hubCode: 'DS-PATNA-CENTRAL',
  location: 'Kankarbagh, Patna, Bihar',
  isOpen: true,
  speedMode: 'EXPRESS_10M', // EXPRESS_10M, RAIN_SURGE_25M, HIGH_DEMAND_15M
  activePackingBays: 3,
  coldRoomTemp: '3.6°C',
  dryStorageTemp: '24.1°C',
  manager: {
    name: 'Vikash Kumar',
    email: 'manager@apnastore.com',
    phone: '+91 98350 44556',
    badge: 'MGR-402',
    shift: 'Evening Rush (4:00 PM - 12:00 AM)',
  },
  announcement: 'Evening shift peak active: Maintain under 3-minute pick & pack.',
};

// Global in-memory states
let inventoryData = [...initialInventory];
let ridersData = [...initialRiders];
let storeStatusData = { ...initialStoreStatus };

export function getInventory() {
  return inventoryData;
}

export function updateInventoryItem(id, updates) {
  const item = inventoryData.find((prod) => prod.id === Number(id));
  if (!item) return null;
  Object.assign(item, updates);
  if (typeof item.stock === 'number') {
    item.isAvailable = item.stock > 0;
  }
  return item;
}

export function addInventoryItem(newItem) {
  const item = {
    ...newItem,
    id: newItem.id || Date.now(),
    stock: Number(newItem.stock) || 0,
    price: Number(newItem.price) || 0,
    mrp: Number(newItem.mrp || newItem.price) || 0,
    minThreshold: Number(newItem.minThreshold) || 10,
    isAvailable: Number(newItem.stock) > 0,
  };
  inventoryData.unshift(item);
  return item;
}

export function getRiders() {
  return ridersData;
}

export function updateRider(id, updates) {
  const rider = ridersData.find((r) => r.id === id);
  if (!rider) return null;
  Object.assign(rider, updates);
  return rider;
}

export function addRider(newRider) {
  const rider = {
    ...newRider,
    id: `RDR-${Date.now().toString().slice(-3)}`,
    status: newRider.status || 'AVAILABLE',
    deliveriesToday: 0,
    rating: 5.0,
    avatarColor: 'bg-emerald-500',
  };
  ridersData.push(rider);
  return rider;
}

export function getStoreStatus() {
  return storeStatusData;
}

export function updateStoreStatus(updates) {
  Object.assign(storeStatusData, updates);
  return storeStatusData;
}
