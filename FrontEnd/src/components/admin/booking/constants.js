export const BOOKING_STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
export const PAYMENT_FILTERS = ['ALL', 'PENDING', 'OTHERS'];
export const CANCEL_REASONS = [
  { value: 'TOUR_QUALITY_CONCERN', label: 'Lo ngại về chất lượng tour' },
  { value: 'WEATHER_CONDITION', label: 'Điều kiện thời tiết bất lợi' },
  { value: 'OPERATIONAL_ISSUE', label: 'Vấn đề vận hành tour' },
  { value: 'LEGAL_RESTRICTION', label: 'Hạn chế pháp lý hoặc quy định' },
  { value: 'OTHER', label: 'Lý do khác' },
];
export const WEBSOCKET_URL = 'http://localhost:8082/ws';
export const PAGE_SIZE = 10;