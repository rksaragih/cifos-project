import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { CheckCircle, Calendar, Clock, Users, Phone, ShoppingBag, AlertCircle, MessageSquare } from 'lucide-react';

interface ReservationMenu {
  id: number;
  menu_id: number;
  jumlah: number;
  subtotal: string;
  menu: {
    id: number;
    nama_menu: string;
    harga_menu: string;
  };
}

interface ReservationData {
  kode_reservasi: string;
  nama_pelanggan: string;
  nomor_wa: string;
  tanggal: string;
  jam: string;
  jumlah_orang: number;
  catatan?: string;
  total_dp: string;
  status_dp: string;
  status_reservasi: string;
  reservationMenus: ReservationMenu[];
}

const ReservasiSuccess = () => {
  const { kode_reservasi } = useParams<{ kode_reservasi: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const whatsappUrl = location.state?.whatsapp_url;

  const fetchReservationDetails = async (): Promise<ReservationData> => {
    if (!kode_reservasi) {
      throw new Error('Kode reservasi tidak ditemukan');
    }

    const response = await fetch(`/api/reservations/success/${kode_reservasi}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Gagal memuat data reservasi');
    }
    
    const result = await response.json();
    return result.data;
  };

  const {
    data: reservation,
    isLoading,
    error,
  } = useQuery<ReservationData, Error>({
    queryKey: ['reservation-success', kode_reservasi],
    queryFn: fetchReservationDetails,
    enabled: !!kode_reservasi,
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data reservasi...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 max-w-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Reservasi Tidak Ditemukan</h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'Terjadi kesalahan saat memuat data'}
            </p>
            <Button onClick={() => navigate('/')}>Kembali ke Beranda</Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const totalMenuPrice =
    reservation.reservationMenus?.reduce((sum, item) => sum + parseFloat(item.subtotal), 0) || 0;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Menunggu Konfirmasi', color: 'bg-yellow-100 text-yellow-800' },
      paid: { label: 'DP Terbayar', color: 'bg-green-100 text-green-800' },
      confirmed: { label: 'Terkonfirmasi', color: 'bg-blue-100 text-blue-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Reservasi Berhasil!</h1>
            <p className="text-gray-600 text-lg">Silakan konfirmasi pembayaran DP via WhatsApp</p>
          </div>

          {/* Reservation Code */}
          <Card className="mb-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <p className="text-sm opacity-90 mb-1">Kode Reservasi Anda:</p>
              <p className="text-3xl font-bold tracking-wider mb-2">{reservation.kode_reservasi}</p>
              <div className="flex justify-center">
                {getStatusBadge(reservation.status_dp)}
              </div>
            </CardContent>
          </Card>

          {/* Reservation Details */}
          <Card className="mb-6">
            <CardContent className="pt-6 space-y-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Detail Reservasi
              </h2>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nama Pemesan</p>
                  <p className="font-semibold">{reservation.nama_pelanggan}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">No. WhatsApp</p>
                  <p className="font-semibold">{reservation.nomor_wa}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Tanggal & Jam</p>
                  <p className="font-semibold">
                    {new Date(reservation.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="font-semibold">{reservation.jam}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Jumlah Tamu</p>
                  <p className="font-semibold">{reservation.jumlah_orang} orang</p>
                </div>
              </div>

              {reservation.catatan && (
                <div className="flex items-start gap-3 pt-2 border-t">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Catatan</p>
                    <p className="text-sm">{reservation.catatan}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Menu Details */}
          {reservation.reservationMenus?.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Menu yang Dipesan
                </h2>
                <div className="space-y-2 mb-4">
                  {reservation.reservationMenus.map((item) => (
                    <div key={item.id} className="flex justify-between items-start py-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.menu.nama_menu}</p>
                        <p className="text-sm text-gray-600">
                          {item.jumlah} porsi × Rp{' '}
                          {parseFloat(item.menu.harga_menu).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-semibold">
                        Rp {parseFloat(item.subtotal).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total Menu:</span>
                  <span className="text-primary">Rp {totalMenuPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>Catatan:</strong> Menu di atas akan dibayar saat Anda datang ke restoran
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* DP Info */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">DP Reservasi</p>
                  <p className="text-2xl font-bold text-green-600 mb-2">
                    Rp {parseFloat(reservation.total_dp).toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-gray-600">
                    Status: {getStatusBadge(reservation.status_dp)}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-600" />
                Langkah Selanjutnya
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ Pesan WhatsApp telah dikirim untuk konfirmasi DP</li>
                <li>✅ Admin akan mengkonfirmasi setelah menerima pembayaran DP</li>
                <li>✅ Harap datang 10 menit sebelum waktu reservasi</li>
                <li>✅ Tunjukkan kode reservasi saat check-in</li>
                <li>✅ Hubungi kami jika ada perubahan atau pembatalan</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            {whatsappUrl && (
              <Button 
                onClick={() => window.open(whatsappUrl, '_blank')} 
                className="w-full bg-green-600 hover:bg-green-700" 
                size="lg"
              >
                💬 Konfirmasi via WhatsApp
              </Button>
            )}
            
            <Button onClick={() => navigate('/')} variant="outline" className="w-full" size="lg">
              Kembali ke Beranda
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Terima kasih telah melakukan reservasi di Ciawi Food Station! 🍽️
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservasiSuccess;