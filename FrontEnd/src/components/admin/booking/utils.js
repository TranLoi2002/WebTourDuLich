export const formatPrice = (price) => (price ? `$${price.toFixed(2)}` : 'N/A');

export const getValidStatusOptions = (currentStatus) => {
  if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
    return [currentStatus];
  }
  if (currentStatus === 'PENDING') {
    return ['PENDING', 'CONFIRMED', 'CANCELLED'];
  }
  return ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
};