const orders = [];

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