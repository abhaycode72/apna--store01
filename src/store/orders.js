const orders = [];

export function addOrder(order) {
  orders.unshift(order);
  return order;
}

export function getOrders() {
  return orders;
}