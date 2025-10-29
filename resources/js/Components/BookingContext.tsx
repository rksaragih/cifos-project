import React from "react";
import React, { createContext, useContext, useEffect, useState } from 'react';

type BookingData = {
  name?: string;
  phone?: string;
  email?: string;
  persons?: string;
  bookingDay?: string;
  // Reservasi-specific optional fields
  time?: string;
  kategori_jumlah?: string;
  jumlah_orang?: string;
  catatan?: string;
};

type BookingContextType = {
  booking: BookingData;
  setBooking: (b: BookingData) => void;
  clearBooking: () => void;
};

const STORAGE_KEY = 'yummi:booking';

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [booking, setBookingState] = useState<BookingData>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setBookingState(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
    } catch {}
  }, [booking]);

  const setBooking = (b: BookingData) => setBookingState((prev) => ({ ...prev, ...b }));
  const clearBooking = () => {
    setBookingState({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <BookingContext.Provider value={{ booking, setBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};

export default BookingContext;
