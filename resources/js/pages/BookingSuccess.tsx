import { Link } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import React, { useEffect, useState } from "react";
import { Check, Calendar, Users, Phone, Mail } from "lucide-react";
import { useBooking } from "@/Components/BookingContext";

const BookingSuccess = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);
  const { booking, clearBooking } = useBooking();
  
  useEffect(() => {
    // Generate order number immediately
    const generatedOrderNumber = `#${Date.now().toString().slice(-6)}`;
    setOrderNumber(generatedOrderNumber);
    
    // Get order details from localStorage (simulating order data)
    const savedOrder = localStorage.getItem('bookingOrder');
    if (savedOrder) {
      setOrderDetails(JSON.parse(savedOrder));
    }
    
    // Set loading to false after a short delay to show the success page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Auto redirect to new booking after showing success
  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Clear booking data and redirect to new booking after showing success
    const redirectTimer = setTimeout(() => {
      clearBooking();
      // Clear any other related data
      localStorage.removeItem('bookingOrder');
      // Redirect to booking info for new booking
      window.location.href = '/booking/info';
    }, 3000); // Redirect after 3 seconds to allow user to see the success page
    
    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, [clearBooking]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 pb-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 border-4 border-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-600">Processing your order...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 border-4 border-green-500 rounded-lg flex items-center justify-center bg-green-50">
                  <Check className="w-16 h-16 text-green-600" strokeWidth={3} />
                </div>
              </div>
            </div>

            <p className="text-sm text-green-600 uppercase tracking-wider mb-2 font-semibold">
              BOOKING BERHASIL
            </p>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
              Terima kasih atas pesanan Anda!
            </h1>

            <p className="text-xl mb-2 text-gray-700">
              Nomor pesanan: <span className="font-bold text-green-600">{orderNumber}</span>
            </p>
          </div>

          {/* Booking Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Booking Information */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Detail Booking</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Nama</p>
                    <p className="font-semibold">{booking.name || 'Tidak tersedia'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Telepon</p>
                    <p className="font-semibold">{booking.phone || 'Tidak tersedia'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold">{booking.email || 'Tidak tersedia'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tanggal & Waktu</p>
                    <p className="font-semibold">
                      {booking.bookingDay || 'Tidak tersedia'}
                      {booking.time && ` • ${booking.time}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Jumlah Orang</p>
                    <p className="font-semibold">{booking.persons || booking.jumlah_orang || 'Tidak tersedia'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Ringkasan Pesanan</h2>
              {orderDetails && orderDetails.items ? (
                <div className="space-y-4">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <div>
                        <p className="font-semibold">{item.nama_menu}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-green-600">
                        Rp {(item.harga_menu * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">Total</p>
                      <p className="text-xl font-bold text-green-600">
                        Rp {orderDetails.totalPrice?.toLocaleString("id-ID") || '0'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Tidak ada detail pesanan tersedia</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Link to="/">Kembali ke Beranda</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                <Link to="/menu">Lihat Menu Lainnya</Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Otomatis redirect ke halaman booking baru dalam <span className="font-bold text-green-600">{countdown}</span> detik...
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingSuccess;
