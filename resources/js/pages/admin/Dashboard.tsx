import React, { useEffect, useState } from "react";
import { Card } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Eye, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

type ReservationMenu = {
  id: number;
  menu_id: number;
  jumlah: number;
  subtotal: number;
  menu: {
    id: number;
    nama_menu: string;
    harga_menu: number;
    foto_menu?: string;
    category?: {
      nama: string;
    };
  };
};

type Reservation = {
  kode_reservasi: string;
  nama_pelanggan: string;
  nomor_wa: string;
  tanggal: string;
  jam: string;
  kategori_jumlah: string;
  jumlah_orang: number;
  catatan?: string;
  total_dp: number;
  status_dp: 'pending' | 'paid' | 'failed';
  status_reservasi: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  reservation_menus?: ReservationMenu[];
};

const fetchMenuCount = async () => {
  const response = await axios.get("/api/menus/count");
  return response.data.total_menus;
};

const fetchArticleCount = async () => {
  const response = await axios.get("/api/articles/count");
  return response.data.total_articles;
};

const fetchReservations = async () => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.get("/api/admin/reservations", {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  // Filter: status_reservasi = pending/confirmed OR status_dp = pending
  const filtered = response.data.data.filter((r: Reservation) => {
    return (
      r.status_reservasi === 'pending' || 
      r.status_reservasi === 'confirmed' || 
      r.status_dp === 'pending'
    );
  });
  
  return filtered;
};

const fetchReservationStats = async () => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.get("/api/admin/reservations/statistics", {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  return response.data;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: Reservation | null;
  }>({ open: false, data: null });

  const {
    data: totalMenus,
    isLoading: loadingMenus,
    isError: errorMenus,
  } = useQuery({
    queryKey: ["menuCount"],
    queryFn: fetchMenuCount,
    refetchInterval: 15000,
  });

  const {
    data: totalArticles,
    isLoading: loadingArticles,
    isError: errorArticles,
  } = useQuery({
    queryKey: ["articleCount"],
    queryFn: fetchArticleCount,
    refetchInterval: 15000,
  });

  const {
    data: reservations = [],
    isLoading: loadingReservations,
    isError: errorReservations,
    refetch: refetchReservations
  } = useQuery({
    queryKey: ["dashboardReservations"],
    queryFn: fetchReservations,
    refetchInterval: 10000, // Auto refresh every 10 seconds
  });

  const {
    data: reservationStats,
    isLoading: loadingStats,
  } = useQuery({
    queryKey: ["reservationStats"],
    queryFn: fetchReservationStats,
    refetchInterval: 15000,
  });

  // View Detail
  const handleViewDetail = async (kode: string) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/reservations/${kode}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch detail');
      
      const result = await res.json();
      setDetailModal({ open: true, data: result.data });
    } catch (err: any) {
      console.error('Error fetching detail:', err);
    }
  };

  // Status Badge Component
  const StatusBadge = ({ type, status }: { type: 'reservasi' | 'dp', status: string }) => {
    const colors = {
      reservasi: {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
      },
      dp: {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        failed: 'bg-red-100 text-red-800'
      }
    };

    const colorClass = type === 'reservasi' 
      ? colors.reservasi[status as keyof typeof colors.reservasi]
      : colors.dp[status as keyof typeof colors.dp];

    return (
      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
        {status}
      </span>
    );
  };

  // Format currency
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Total Reservasi</div>
          <div className="text-2xl font-bold mt-2">
            {loadingStats
              ? "Loading..."
              : reservationStats?.total ?? "--"}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Jumlah Menu</div>
          <div className="text-2xl font-bold mt-2">
            {loadingMenus
              ? "Loading..."
              : errorMenus
              ? "Error"
              : totalMenus ?? "--"}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Jumlah Artikel</div>
          <div className="text-2xl font-bold mt-2">
            {loadingArticles
              ? "Loading..."
              : errorArticles
              ? "Error"
              : totalArticles ?? "--"}
          </div>
        </Card>
      </div>

      {/* Reservations Section */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-lg">Reservasi yang Perlu Ditindaklanjuti</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Menampilkan reservasi dengan status <span className="font-semibold">pending/confirmed</span> atau DP <span className="font-semibold">pending</span>
            </p>
          </div>
          <Button
            onClick={() => navigate('/admin/reservasi')}
            className="flex items-center gap-2"
          >
            Lihat Semua Reservasi
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {loadingReservations ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-600">Loading reservations...</p>
          </div>
        ) : errorReservations ? (
          <div className="p-8 text-center text-red-600">
            <p>Gagal memuat data reservasi</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white">
                  <th className="p-3 text-left">Kode</th>
                  <th className="p-3 text-left">Nama</th>
                  <th className="p-3 text-left">No. WA</th>
                  <th className="p-3 text-left">Tanggal & Jam</th>
                  <th className="p-3 text-left">Jumlah</th>
                  <th className="p-3 text-left">Total Menu</th>
                  <th className="p-3 text-left">DP</th>
                  <th className="p-3 text-left">Status DP</th>
                  <th className="p-3 text-left">Status Reservasi</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r: Reservation) => {
                  const totalMenu = r.reservation_menus?.reduce((sum, item) => sum + Number(item.subtotal), 0) || 0;
                  
                  return (
                    <tr key={r.kode_reservasi} className="border-t even:bg-gray-50 hover:bg-gray-100">
                      <td className="p-3 font-mono text-xs">{r.kode_reservasi}</td>
                      <td className="p-3">{r.nama_pelanggan}</td>
                      <td className="p-3">{r.nomor_wa}</td>
                      <td className="p-3">
                        <div className="text-xs">
                          <div>{formatDate(r.tanggal)}</div>
                          <div className="text-gray-500">{r.jam}</div>
                        </div>
                      </td>
                      <td className="p-3">{r.jumlah_orang} orang</td>
                      <td className="p-3">
                        {totalMenu > 0 ? formatCurrency(totalMenu) : '-'}
                      </td>
                      <td className="p-3">{formatCurrency(r.total_dp)}</td>
                      <td className="p-3">
                        <StatusBadge type="dp" status={r.status_dp} />
                      </td>
                      <td className="p-3">
                        <StatusBadge type="reservasi" status={r.status_reservasi} />
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetail(r.kode_reservasi)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  );
                })}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      🎉 Tidak ada reservasi yang perlu ditindaklanjuti
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {reservations.length > 0 && (
              <div className="p-3 bg-gray-50 text-sm text-gray-600 border-t">
                Menampilkan {reservations.length} reservasi yang perlu ditindaklanjuti
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailModal.open && detailModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setDetailModal({ open: false, data: null })}
          />
          <div className="relative bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Detail Reservasi</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setDetailModal({ open: false, data: null })}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Info Dasar */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600">Kode Reservasi</p>
                  <p className="font-mono font-semibold">{detailModal.data.kode_reservasi}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tanggal Booking</p>
                  <p className="font-semibold">{formatDate(detailModal.data.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Nama Pelanggan</p>
                  <p className="font-semibold">{detailModal.data.nama_pelanggan}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">No. WhatsApp</p>
                  <p className="font-semibold">{detailModal.data.nomor_wa}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Tanggal Reservasi</p>
                  <p className="font-semibold">{formatDate(detailModal.data.tanggal)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Jam</p>
                  <p className="font-semibold">{detailModal.data.jam}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Kategori</p>
                  <p className="font-semibold">{detailModal.data.kategori_jumlah}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Jumlah Orang</p>
                  <p className="font-semibold">{detailModal.data.jumlah_orang} orang</p>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Status Reservasi</p>
                  <StatusBadge type="reservasi" status={detailModal.data.status_reservasi} />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Status DP</p>
                  <StatusBadge type="dp" status={detailModal.data.status_dp} />
                </div>
              </div>

              {/* Catatan */}
              {detailModal.data.catatan && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Catatan</p>
                  <p className="text-sm">{detailModal.data.catatan}</p>
                </div>
              )}

              {/* Menu Items */}
              {detailModal.data.reservation_menus && detailModal.data.reservation_menus.length > 0 && (
                <div>
                  <p className="font-semibold mb-2">Menu yang Dipesan:</p>
                  <div className="space-y-2">
                    {detailModal.data.reservation_menus.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {item.menu.foto_menu && (
                            <img
                              src={item.menu.foto_menu}
                              alt={item.menu.nama_menu}
                              className="w-12 h-12 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-sm">{item.menu.nama_menu}</p>
                            <p className="text-xs text-gray-600">
                              {formatCurrency(item.menu.harga_menu)} x {item.jumlah}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg font-bold">
                      <span>Total Menu:</span>
                      <span>{formatCurrency(detailModal.data.reservation_menus.reduce((sum, item) => sum + Number(item.subtotal), 0))}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* DP Info */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total DP:</span>
                  <span className="text-lg font-bold text-green-700">
                    {formatCurrency(detailModal.data.total_dp)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <Button 
                variant="outline"
                onClick={() => {
                  setDetailModal({ open: false, data: null });
                  navigate('/admin/reservasi');
                }}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Buka di Halaman Reservasi
              </Button>
              <Button onClick={() => setDetailModal({ open: false, data: null })}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;