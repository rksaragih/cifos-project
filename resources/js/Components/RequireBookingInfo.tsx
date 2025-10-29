import React from 'react';
import { Navigate } from 'react-router-dom';
import { useBooking } from './BookingContext';

const RequireBookingInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { booking } = useBooking();

  // Check minimal required fields (name + phone or email)
  const hasInfo = Boolean(booking && (booking.name || booking.email || booking.phone));

  if (!hasInfo) {
    return <Navigate to="/booking/info" replace />;
  }

  return <>{children}</>;
};

export default RequireBookingInfo;
