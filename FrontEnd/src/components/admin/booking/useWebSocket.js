import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { toast } from 'react-toastify';
import { WEBSOCKET_URL } from './constants';

export const useWebSocket = (onNewBooking, onBookingUpdate) => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const socket = new SockJS(WEBSOCKET_URL);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/bookings', (message) => {
        const newBooking = JSON.parse(message.body);
        onNewBooking(newBooking);
        toast.success(`New booking: ${newBooking.bookingCode}`);
      });
      stompClient.subscribe('/topic/booking-updates', (message) => {
        const updatedBooking = JSON.parse(message.body);
        onBookingUpdate(updatedBooking);
        toast.info(`Booking ${updatedBooking.bookingCode} updated to ${updatedBooking.bookingStatus}`);
      });
    };

    stompClient.onStompError = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Failed to connect to WebSocket.');
    };

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
      console.log('Disconnected from WebSocket');
    };
  }, [onNewBooking, onBookingUpdate]);

  return client;
};