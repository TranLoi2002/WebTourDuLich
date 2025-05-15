import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { getBooking } from '../api/booking.api';

const VIETQR_CONFIG = {
  bankId: '970415', 
  accountNumber: '105874911011',
  template: 'compact2',
  accountName: 'Nguyen Truong An',
};
const EXCHANGE_RATE = 25000; // 1 USD = 25,000 VND
const QR_VALIDITY_SECONDS = 900; // 15 minutes
const MAX_VIETQR_AMOUNT = 9999999999999;

function Payment() {
  const { id: bookingId } = useParams(); 
  const { state } = useLocation(); 
  const navigate = useNavigate();

  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isFetchingBooking, setIsFetchingBooking] = useState(true);
  const [isQrGenerating, setIsQrGenerating] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (!state?.isAuthorized) {
      setNotification({
        open: true,
        message: 'Unauthorized access. Please initiate payment from your bookings.',
        severity: 'error',
      });
      navigate('/', { replace: true });
    }
  }, [state, navigate]);

  const amountInVND = bookingData?.totalPrice
    ? Math.round(bookingData.totalPrice * EXCHANGE_RATE)
    : state?.totalPrice
    ? Math.round(state.totalPrice * EXCHANGE_RATE)
    : 0;

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchBooking = async () => {
      setIsFetchingBooking(true);
      try {
        const response = await getBooking(bookingId);
        if (response.success) {
          setBookingData(response.data);
          if (response.data.bookingStatus !== 'PENDING') {
            setNotification({
              open: true,
              message: `Cannot process payment: Booking is in ${response.data.bookingStatus} status`,
              severity: 'error',
            });
          }
        } else {
          setNotification({
            open: true,
            message: response.message || 'Failed to retrieve booking information',
            severity: 'error',
          });
        }
      } catch (error) {
        setNotification({
          open: true,
          message: 'Error fetching booking information',
          severity: 'error',
        });
      } finally {
        setIsFetchingBooking(false);
      }
    };

    if (bookingId && state?.isAuthorized) {
      fetchBooking();
    } else if (state?.isAuthorized) {
      setNotification({
        open: true,
        message: 'Missing Booking ID',
        severity: 'error',
      });
      setIsFetchingBooking(false);
    }
  }, [bookingId, state]);

  const generateQrCodeUrl = () => {
    // Validate amount
    if (!amountInVND || amountInVND <= 0) {
      setNotification({
        open: true,
        message: 'Invalid payment amount',
        severity: 'error',
      });
      return '';
    }
    if (amountInVND > MAX_VIETQR_AMOUNT) {
      setNotification({
        open: true,
        message: 'Amount exceeds VietQR limit (13 digits)',
        severity: 'error',
      });
      return '';
    }
    if (bookingData && bookingData.bookingStatus !== 'PENDING') {
      setNotification({
        open: true,
        message: `Cannot generate QR code: Booking is in ${bookingData.bookingStatus} status`,
        severity: 'error',
      });
      return '';
    }

    setIsQrGenerating(true);
    const description = `Payment for booking ${bookingData?.bookingCode || bookingId}`;
    const encodedDescription = encodeURIComponent(description);
    const encodedAccountName = encodeURIComponent(VIETQR_CONFIG.accountName);
    const url = `https://img.vietqr.io/image/${VIETQR_CONFIG.bankId}-${VIETQR_CONFIG.accountNumber}-${VIETQR_CONFIG.template}.png?amount=${amountInVND}&addInfo=${encodedDescription}&accountName=${encodedAccountName}`;

    setTimerSeconds(QR_VALIDITY_SECONDS);
    setTimeout(() => setIsQrGenerating(false), 500); 
    return url;
  };

  useEffect(() => {
    if ((bookingData || state?.totalPrice) && bookingData?.bookingStatus === 'PENDING') {
      const url = generateQrCodeUrl();
      if (url) {
        setQrCodeUrl(url);
        setNotification({
          open: true,
          message: 'QR code generated successfully!',
          severity: 'success',
        });
      }
    }
  }, [bookingData, state]);

  useEffect(() => {
    if (timerSeconds === null || timerSeconds <= 0) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setQrCodeUrl(''); 
          setNotification({
            open: true,
            message: 'QR code expired. Please generate a new one.',
            severity: 'warning',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerSeconds]);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (isFetchingBooking) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // No booking data or totalPrice
  if (!bookingData && !state?.totalPrice) {
    return <Typography>No payment information available</Typography>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 4,
        paddingTop: '120px',
        background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '900px',
          bgcolor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          p: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Left Column: Booking Information */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a3c34' }}>
            Booking Payment
          </Typography>
          <Typography sx={{ mb: 2, color: '#555' }}>
            <strong>Booking Code:</strong> {bookingData?.bookingCode || 'N/A'}
          </Typography>
          <Typography sx={{ mb: 2, color: '#555' }}>
            <strong>Amount:</strong> {amountInVND.toLocaleString('vi-VN')} VND
          </Typography>
          <Typography sx={{ mb: 2, color: '#555' }}>
            <strong>Bank:</strong> VietinBank
          </Typography>
          <Typography sx={{ mb: 2, color: '#555' }}>
            <strong>Account Number:</strong> {VIETQR_CONFIG.accountNumber}
          </Typography>
          <Typography sx={{ mb: 2, color: '#555' }}>
            <strong>Account Holder:</strong> {VIETQR_CONFIG.accountName}
          </Typography>
        </Box>

        {/* Right Column: QR Code and Buttons */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          {isQrGenerating ? (
            <CircularProgress sx={{ mb: 3 }} />
          ) : qrCodeUrl && bookingData?.bookingStatus === 'PENDING' && timerSeconds > 0 ? (
            <>
              <Typography sx={{ mb: 2, color: '#555', textAlign: 'center' }}>
                Scan the QR code below with your banking app to pay:
              </Typography>
              <img
                src={qrCodeUrl}
                alt="VietQR Code"
                style={{ maxWidth: '250px', margin: '0 auto' }}
              />
              <Typography sx={{ mt: 2, color: '#555', fontSize: '0.875rem', textAlign: 'center' }}>
                Time remaining: {formatTimer(timerSeconds)}
              </Typography>
              <Typography sx={{ mt: 1, color: '#d32f2f', fontSize: '0.875rem', textAlign: 'center' }}>
                Note: QR code is valid for 15 minutes.
              </Typography>
            </>
          ) : (
            <Typography sx={{ mb: 3, color: '#d32f2f', textAlign: 'center' }}>
              {timerSeconds === 0
                ? 'QR code expired. Please generate a new one.'
                : bookingData?.bookingStatus !== 'PENDING'
                ? `Cannot process payment: Booking is in ${bookingData?.bookingStatus} status`
                : 'Failed to generate QR code. Please try again.'}
            </Typography>
          )}

          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => setQrCodeUrl(generateQrCodeUrl())}
              disabled={isFetchingBooking || isQrGenerating || bookingData?.bookingStatus !== 'PENDING'}
              sx={{
                background: 'linear-gradient(90deg, #1a73e8 0%, #4285f4 100%)',
                color: 'white',
                fontWeight: 'bold',
                textTransform: 'none',
                padding: '12px',
                borderRadius: '8px',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4285f4 0%, #1a73e8 100%)',
                },
                '&:disabled': {
                  background: 'linear-gradient(90deg, #90caf9 0%, #b0bec5 100%)',
                },
              }}
            >
              {isQrGenerating ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Generate New QR Code'
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={handleReturnHome}
              sx={{
                borderColor: '#1a73e8',
                color: '#1a3c34',
                fontWeight: 'bold',
                textTransform: 'none',
                padding: '12px',
                borderRadius: '8px',
                '&:hover': {
                  backgroundColor: '#e3f2fd',
                  borderColor: '#1a73e8',
                },
              }}
            >
              Return to Home
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            sx={{
              width: '100%',
              bgcolor: notification.severity === 'success' ? '#e0f7fa' : '#ffebee',
              color: notification.severity === 'success' ? '#00695c' : '#c62828',
              '& .MuiAlert-icon': {
                color: notification.severity === 'success' ? '#00695c' : '#c62828',
              },
            }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleCloseNotification}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
}

export default Payment;