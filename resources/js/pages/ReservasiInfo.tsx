import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, Phone, MessageSquare, CreditCard, ShoppingBag, XCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

interface ReservationData {
  nama_pelanggan: string;
  nomor_wa: string;
  tanggal: string;
  jam: string;
  kategori_jumlah: string;
  jumlah_orang: string;
  catatan?: string;
}

interface MenuData {
  menu_id: number;
  nama_menu: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

interface ProcessReservationPayload {
  nama_pelanggan: string;
  nomor_wa: string;
  tanggal: string;
  jam: string;
  kategori_jumlah: string;
  jumlah_orang: number;
  catatan: string;
  menus: Array<{
    menu_id: number;
    jumlah: number;
  }>;
}

interface ProcessReservationResponse {
  message: string;
  data: {
    kode_reservasi: string;
    whatsapp_url: string;
  };
}

const ReservasiReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    const resData = localStorage.getItem('reservation_data');
    const menuData = localStorage.getItem('reservation_menus');

    if (!resData) {
      toast({
        title: 'Error',
        description: 'Data reservasi tidak ditemukan',
        variant: 'destructive',
      });
      navigate('/reservasi');
      return;
    }

    setReservationData(JSON.parse(resData));
    setMenuData(menuData ? JSON.parse(menuData) : []);
  }, [navigate, toast]);

  const processReservation = async (payload: ProcessReservationPayload): Promise<ProcessReservationResponse> => {
    const response = await fetch('/api/reservations/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to process reservation');
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: processReservation,
    onSuccess: (data) => {
      const { kode_reservasi, whatsapp_url } = data.data;

      toast({
        title: 'Reservasi Berhasil! 🎉',
        description: 'Silakan konfirmasi pembayaran DP via WhatsApp',
      });

      // Clear localStorage
      localStorage.removeItem('reservation_data');
      localStorage.removeItem('reservation_menus');

      // Redirect ke success page dengan whatsapp_url
      navigate(`/reservasi/success/${kode_reservasi}`, {
        state: { whatsapp_url }
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Gagal memproses reservasi',
        variant: 'destructive',
      });
    },
  });

  const handleConfirm = () => {
    if (!reservationData) return;

    mutation.mutate({
      nama_pelanggan: reservationData.nama_pelanggan,
      nomor_wa: reservationData.nomor_wa,
      tanggal: reservationData.tanggal,
      jam: reservationData.jam,
      kategori_jumlah: reservationData.kategori_jumlah,
      jumlah_orang: parseInt(reservationData.jumlah_orang),
      catatan: reservationData.catatan || '',
      menus: menuData.map((m) => ({
        menu_id: m.menu_id,
        jumlah: m.jumlah,
      })),
    });
  };

  const handleCancelConfirm = () => {
    localStorage.removeItem('reservation_data');
    localStorage.removeItem('reservation_menus');
    
    toast({
      title: "Reservasi Dibatalkan",
      description: "Data reservasi Anda telah dihapus",
    });
    
    navigate('/');
  };

  if (!reservationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalMenuPrice = menuData.reduce((sum, m) => sum + m.subtotal, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent className="max-w-md bg-white">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Batalkan Reservasi?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Apakah Anda yakin ingin membatalkan proses reservasi ini?
              <br /><br />
              Semua data yang telah diisi akan <strong>dihapus</strong> dan Anda harus mengisi ulang dari awal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Tidak, Lanjutkan
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            >
              Ya, Batalkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Review Reservasi</h1>
          <p className="text-gray-600 mb-6">
            Periksa kembali detail reservasi Anda sebelum konfirmasi
          </p>

          {/* Reservation Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Detail Reservasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Nama Pemesan</p>
                  <p className="font-semibold">{reservationData.nama_pelanggan}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">No. WhatsApp</p>
                  <p className="font-semibold">{reservationData.nomor_wa}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Tanggal</p>
                  <p className="font-semibold">
                    {new Date(reservationData.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Jam</p>
                  <p className="font-semibold">{reservationData.jam}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Jumlah Orang</p>
                  <p className="font-semibold">{reservationData.jumlah_orang} orang</p>
                </div>
              </div>
              {reservationData.catatan && (
                <div className="flex items-start gap-3 pt-2 border-t">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Catatan</p>
                    <p className="text-sm">{reservationData.catatan}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Menu Details */}
          {menuData.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Menu yang Dipesan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  {menuData.map((menu) => (
                    <div key={menu.menu_id} className="flex justify-between items-start py-2">
                      <div className="flex-1">
                        <p className="font-medium">{menu.nama_menu}</p>
                        <p className="text-sm text-gray-600">
                          {menu.jumlah} porsi × Rp {menu.harga.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <p className="font-semibold">Rp {menu.subtotal.toLocaleString('id-ID')}</p>
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

          {/* Payment Info */}
          <Card className="mb-6 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold">DP Reservasi</h2>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">Rp 50.000</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                DP akan dikonfirmasi via WhatsApp dengan admin kami
              </p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCancelDialog(true)}
              disabled={mutation.isPending} 
              className="flex-1"
            >
              Batalkan
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={mutation.isPending} 
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {mutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Memproses...
                </>
              ) : (
                'Konfirmasi'
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500 mt-6">
            Anda akan diarahkan ke WhatsApp untuk konfirmasi pembayaran DP
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservasiReview;