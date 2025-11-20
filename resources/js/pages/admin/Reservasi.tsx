import React, { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash, Eye, Calendar, Users, Clock, DollarSign, Download, Phone } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel
} from '@/Components/ui/alert-dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/Components/ui/popover';
import { Calendar as CalendarPicker } from '@/Components/ui/calendar';

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

type Statistics = {
  total: number;
  today: number;
  this_month: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  total_dp_paid: number;
  total_dp_pending: number;
};

const ReservasiAdmin = () => {
  const { toast } = useToast();
  
  // Helper function to format date as YYYY-MM-DD without timezone shift
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDP, setFilterDP] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [isEditDateOpen, setIsEditDateOpen] = useState(false);
  const [isEditTimeOpen, setIsEditTimeOpen] = useState(false);
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);
  
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    data: Reservation | null;
  }>({ open: false, data: null });

  const [editModal, setEditModal] = useState<{
    open: boolean;
    data: Reservation | null;
  }>({ open: false, data: null });

  const [editForm, setEditForm] = useState({
    nama_pelanggan: '',
    nomor_wa: '',
    tanggal: '',
    jam: '',
    jumlah_orang: '',
    status_reservasi: '',
    status_dp: '',
    catatan: ''
  });

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    kode: '',
    name: ''
  });

  const [availableMenus, setAvailableMenus] = useState<any[]>([]);
  const [editMenuItems, setEditMenuItems] = useState<{
    menu_id: number;
    jumlah: number;
    harga: number;
  }[]>([]);
  const [isEditingMenus, setIsEditingMenus] = useState(false);

  // Fetch Reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token');
      
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status_reservasi', filterStatus);
      if (filterDP !== 'all') params.append('status_dp', filterDP);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      if (search) params.append('search', search);

      const url = `/api/admin/reservations?${params.toString()}`;
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch reservations');

      const data = await res.json();
      setReservations(data.data || []);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Gagal memuat data reservasi',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch Statistics
  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/reservations/statistics', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to fetch statistics');
      const data = await res.json();
      setStatistics(data);
    } catch (err: any) {
      console.error('Statistics error:', err);
    }
  };

  // Fetch Available Menus
  const fetchAvailableMenus = async () => {
    try {
      const res = await fetch('/api/menus');
      if (!res.ok) throw new Error('Failed to fetch menus');
      const data = await res.json();
      setAvailableMenus(data.filter((m: any) => m.tersedia));
    } catch (err: any) {
      console.error('Failed to load menus:', err);
    }
  };

  // Fetch Blackout Dates
  const fetchBlackoutDates = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/blackout-dates', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      if (!res.ok) throw new Error('Failed to fetch blackout dates');
      const result = await res.json();
      setBlackoutDates(result.data || []);
      console.log('Blackout dates loaded:', result.data);
    } catch (err: any) {
      console.error('Failed to load blackout dates:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchReservations();
    fetchStatistics();
    fetchBlackoutDates();
  }, [filterStatus, filterDP, startDate, endDate]);

  // Fetch blackout dates once on mount
  useEffect(() => {
    fetchBlackoutDates();
  }, []);

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        fetchReservations();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [search]);

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
      toast({
        title: 'Error',
        description: err.message || 'Gagal memuat detail',
        variant: 'destructive'
      });
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (reservation: Reservation) => {
    // Format tanggal - handle timezone issue
    let formattedDate = '';
    if (reservation.tanggal) {
      // Ambil tanggal tanpa timezone conversion
      // Treat as local date string
      if (reservation.tanggal.includes('T')) {
        // ISO datetime - ambil date part aja
        formattedDate = reservation.tanggal.split('T')[0];
      } else if (reservation.tanggal.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // Sudah format YYYY-MM-DD - langsung pakai
        formattedDate = reservation.tanggal;
      } else {
        // Fallback: parse tapi paksa ke UTC supaya ga shift timezone
        const parts = reservation.tanggal.split('-');
        if (parts.length === 3) {
          formattedDate = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
        }
      }
    }

    setEditForm({
      nama_pelanggan: reservation.nama_pelanggan,
      nomor_wa: reservation.nomor_wa,
      tanggal: formattedDate,
      jam: reservation.jam,
      jumlah_orang: String(reservation.jumlah_orang),
      status_reservasi: reservation.status_reservasi,
      status_dp: reservation.status_dp,
      catatan: reservation.catatan || ''
    });

    // Load existing menu items
    if (reservation.reservation_menus && reservation.reservation_menus.length > 0) {
      setEditMenuItems(
        reservation.reservation_menus.map(item => ({
          menu_id: item.menu_id,
          jumlah: item.jumlah,
          harga: item.menu.harga_menu
        }))
      );
    } else {
      setEditMenuItems([]);
    }

    // Fetch available menus
    fetchAvailableMenus();
    
    // Fetch blackout dates
    fetchBlackoutDates();

    setEditModal({ open: true, data: reservation });

  };

  // Submit Edit
  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal.data) return;

    // Validasi form sebelum submit
    if (!editForm.tanggal || !editForm.jam || !editForm.jumlah_orang) {
      toast({
        title: 'Error',
        description: 'Tanggal, Jam, dan Jumlah Orang wajib diisi',
        variant: 'destructive'
      });
      return;
    }

    // Validasi blackout dates
    if (blackoutDates.includes(editForm.tanggal)) {
      toast({
        title: 'Error',
        description: 'Tanggal yang dipilih adalah blackout date dan tidak dapat digunakan untuk reservasi',
        variant: 'destructive'
      });
      return;
    }

    const jumlah = parseInt(editForm.jumlah_orang);
    if (isNaN(jumlah) || jumlah < 1) {
      toast({
        title: 'Error',
        description: 'Jumlah orang harus minimal 1',
        variant: 'destructive'
      });
      return;
    }

    // Validasi format jam (HH:MM)
    const jamRaw = editForm.jam.trim();
    const jamParts = jamRaw.split(':').filter(Boolean);
    let finalJam = '00:00';

    if (jamParts.length >= 2) {
      const hh = jamParts[0].padStart(2, '0').slice(-2);
      const mm = jamParts[1].padStart(2, '0').slice(-2);
      finalJam = `${hh}:${mm}`;
    } else if (jamParts.length === 1) {
      const hh = jamParts[0].padStart(2, '0').slice(-2);
      finalJam = `${hh}:00`;
    }
    
    const jamRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!jamRegex.test(finalJam)) {
      toast({
        title: 'Error',
        description: 'Format jam tidak valid. Gunakan format HH:MM (contoh: 14:30)',
        variant: 'destructive'
      });
      return;
    }

    // Validasi jam operasional (10:00 - 22:00)
    const [jamHour, jamMinute] = finalJam.split(':').map(Number);
    if (jamHour < 10 || jamHour > 22) {
      toast({
        title: 'Error',
        description: 'Jam reservasi harus antara 10:00 - 22:00 (jam operasional)',
        variant: 'destructive'
      });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      
      // Prepare payload dengan format yang benar
      const payload: any = {
        nama_pelanggan: editForm.nama_pelanggan.trim(),
        nomor_wa: editForm.nomor_wa.trim(),
        tanggal: editForm.tanggal.trim(),
        jam: finalJam,
        jumlah_orang: jumlah,
        status_reservasi: editForm.status_reservasi,
        status_dp: editForm.status_dp,
        catatan: editForm.catatan ? editForm.catatan.trim() : null
      };

      console.log('Sending payload:', payload); // Debug log

      const res = await fetch(`/api/admin/reservations/${editModal.data.kode_reservasi}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Validation errors:', err); // Debug log
        
        // Show detailed error messages
        if (err.errors) {
          const errorMessages = Object.entries(err.errors)
            .map(([field, messages]) => `${field}: ${(messages as string[]).join(', ')}`)
            .join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(err.message || 'Failed to update');
      }

      toast({
        title: 'Berhasil',
        description: 'Reservasi berhasil diupdate'
      });

      setEditModal({ open: false, data: null });
      fetchReservations();
      fetchStatistics();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Gagal mengupdate reservasi',
        variant: 'destructive'
      });
    }
  };

  // Handle Menu Item Changes
  const handleAddMenuItem = () => {
    if (availableMenus.length === 0) return;
    const firstMenu = availableMenus[0];
    setEditMenuItems([
      ...editMenuItems,
      { menu_id: firstMenu.id, jumlah: 1, harga: firstMenu.harga_menu }
    ]);
  };

  const handleRemoveMenuItem = (index: number) => {
    setEditMenuItems(editMenuItems.filter((_, i) => i !== index));
  };

  const handleMenuItemChange = (index: number, field: 'menu_id' | 'jumlah', value: number) => {
    const updated = [...editMenuItems];
    updated[index][field] = value;
    
    // Update harga jika menu_id berubah
    if (field === 'menu_id') {
      const menu = availableMenus.find(m => m.id === value);
      if (menu) updated[index].harga = menu.harga_menu;
    }
    
    setEditMenuItems(updated);
  };

  // Submit Menu Updates
  const handleSubmitMenuUpdate = async () => {
    if (!editModal.data) return;

    // Validasi: jika kategori >10, minimal harus ada 1 menu
    if (editModal.data.kategori_jumlah === '>10' && editMenuItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Minimal harus ada 1 menu untuk kategori >10 orang',
        variant: 'destructive'
      });
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const payload = {
        menus: editMenuItems.map(item => ({
          menu_id: item.menu_id,
          jumlah: item.jumlah
        }))
      };

      const res = await fetch(`/api/admin/reservations/${editModal.data.kode_reservasi}/menus`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update menus');
      }

      const result = await res.json();

      setEditModal(prev => ({
        ...prev,
        data: result.data
      }));

      toast({
        title: 'Berhasil',
        description: 'Menu berhasil diupdate'
      });

      setIsEditingMenus(false);
      fetchReservations();

    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Gagal mengupdate menu',
        variant: 'destructive'
      });
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteDialog.kode) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/admin/reservations/${deleteDialog.kode}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete');
      }

      toast({
        title: 'Deleted',
        description: `Reservasi ${deleteDialog.kode} berhasil dihapus`
      });

      setDeleteDialog({ open: false, kode: '', name: '' });
      fetchReservations();
      fetchStatistics();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Gagal menghapus reservasi',
        variant: 'destructive'
      });
    }
  };

  // Export to CSV
  const handleExportCSV = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      
      // Build query string with filters
      const queryParams = new URLSearchParams();
      if (filterStatus !== 'all') {
        queryParams.append('status_reservasi', filterStatus);
      }
      if (filterDP !== 'all') {
        queryParams.append('status_dp', filterDP);
      }
      if (startDate) {
        queryParams.append('start_date', startDate);
      }
      if (endDate) {
        queryParams.append('end_date', endDate);
      }
      if (search) {
        queryParams.append('search', search);
      }

      const url = `/api/admin/reservations/export?${queryParams.toString()}`;
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/csv'
        }
      });

      if (!res.ok) {
        throw new Error('Failed to export');
      }

      // Get the blob from response
      const blob = await res.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `reservasi_cifos_${new Date().toISOString().split('T')[0]}.csv`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: 'Success',
        description: 'Data reservasi berhasil diexport ke CSV'
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Gagal export data',
        variant: 'destructive'
      });
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
    <div className="w-full">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reservasi</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
              </div>
              <Calendar className="h-10 w-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hari Ini</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.today}</p>
              </div>
              <Clock className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bulan Ini</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.this_month}</p>
              </div>
              <Users className="h-10 w-10 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters & Actions */}
      <div className="bg-white border rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div>
            <Input
              placeholder="Cari kode/nama/nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full"
              maxLength={30}
            />
          </div>

          {/* Filter Status Reservasi */}
          <div>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Semua Status Reservasi</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Filter Status DP */}
          <div>
            <select
              className="w-full border rounded-md px-3 py-2 text-sm bg-white"
              value={filterDP}
              onChange={(e) => setFilterDP(e.target.value)}
            >
              <option value="all">Semua DP</option>
              <option value="pending">DP Pending</option>
              <option value="paid">DP Paid</option>
              <option value="failed">DP Failed</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  type="button"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {startDate 
                    ? new Date(startDate + "T00:00:00").toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short', 
                        year: 'numeric'
                      })
                    : "Dari Tanggal"
                  }
                </Button>
              </PopoverTrigger>

              <PopoverContent 
                className="w-auto overflow-hidden p-0 border bg-white shadow-lg" 
                align="start"
                sideOffset={8}
              >
                <CalendarPicker
                  mode="single"
                  selected={startDate ? new Date(startDate + "T00:00:00") : undefined}
                  onSelect={(date) => {
                    if (!date) return;
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const iso = `${year}-${month}-${day}`;
                    setStartDate(iso);
                    setIsStartDateOpen(false);
                  }}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < today) return true;
                    const dateStr = formatDateString(date);
                    return blackoutDates.includes(dateStr);
                  }}
                  modifiers={{
                    blackout: (date) => {
                      const dateStr = formatDateString(date);
                      return blackoutDates.includes(dateStr);
                    }
                  }}
                  modifiersClassNames={{
                    blackout: 'line-through opacity-40 bg-red-50 text-red-400'
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date */}
          <div>
            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  type="button"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {endDate 
                    ? new Date(endDate + "T00:00:00").toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short', 
                        year: 'numeric'
                      })
                    : "Sampai Tanggal"
                  }
                </Button>
              </PopoverTrigger>

              <PopoverContent 
                className="w-auto overflow-hidden p-0 border bg-white shadow-lg" 
                align="start"
                sideOffset={8}
              >
                <CalendarPicker
                  mode="single"
                  selected={endDate ? new Date(endDate + "T00:00:00") : undefined}
                  onSelect={(date) => {
                    if (!date) return;
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const iso = `${year}-${month}-${day}`;
                    setEndDate(iso);
                    setIsEndDateOpen(false);
                  }}
                  disabled={(date) => {
                    if (!startDate) return false;
                    const start = new Date(startDate + "T00:00:00");
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (date < start) return true;
                    if (date < today) return true;
                    const dateStr = formatDateString(date);
                    return blackoutDates.includes(dateStr);
                  }}
                  modifiers={{
                    blackout: (date) => {
                      const dateStr = formatDateString(date);
                      return blackoutDates.includes(dateStr);
                    }
                  }}
                  modifiersClassNames={{
                    blackout: 'line-through opacity-40 bg-red-50 text-red-400'
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearch('');
              setFilterStatus('all');
              setFilterDP('all');
              setStartDate('');
              setEndDate('');
            }}
          >
            Reset Filter
          </Button>
          <Button
            size="sm"
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-lg overflow-auto">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-sm text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
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
                {reservations.map((r) => {
                  const totalMenu = r.reservation_menus?.reduce((sum, item) => sum + Number(item.subtotal), 0) || 0;
                  
                  return (
                    <tr key={r.kode_reservasi} className="border-t even:bg-gray-50">
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
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetail(r.kode_reservasi)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenEdit(r)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteDialog({
                              open: true,
                              kode: r.kode_reservasi,
                              name: r.nama_pelanggan
                            })}
                            disabled={!['pending', 'cancelled'].includes(r.status_reservasi)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {reservations.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-500">
                      Tidak ada data reservasi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-3 bg-gray-50 text-sm text-gray-600">
              Menampilkan {reservations.length} reservasi
            </div>
          </>
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

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setDetailModal({ open: false, data: null })}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.open && editModal.data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setEditModal({ open: false, data: null })}
          />
          <div className="relative bg-white w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-6 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Edit Reservasi</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditModal({ open: false, data: null })}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitEdit}>
              <div className="space-y-4">
                {/* Nama Pelanggan dan Nomor WA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-nama" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Nama Pelanggan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-nama"
                      type="text"
                      value={editForm.nama_pelanggan}
                      onChange={(e) => setEditForm({ ...editForm, nama_pelanggan: e.target.value })}
                      placeholder="Nama lengkap"
                      maxLength={30}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-nomor" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="edit-nomor"
                      type="text"
                      value={editForm.nomor_wa}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setEditForm({ ...editForm, nomor_wa: val });
                        }
                      }}
                      placeholder="081234567890"
                      maxLength={15}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Tanggal with Calendar Picker */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-tanggal" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal <span className="text-red-500">*</span>
                    </Label>
                    <Popover open={isEditDateOpen} onOpenChange={setIsEditDateOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          id="edit-tanggal"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {editForm.tanggal 
                            ? new Date(editForm.tanggal + "T00:00:00").toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long', 
                                year: 'numeric'
                              })
                            : "Pilih tanggal"
                          }
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent 
                        className="w-auto overflow-hidden p-0 border bg-white shadow-lg" 
                        align="start"
                        sideOffset={8}
                      >
                        <CalendarPicker
                          mode="single"
                          selected={
                            editForm.tanggal
                              ? new Date(editForm.tanggal + "T00:00:00")
                              : undefined
                          }
                          onSelect={(date) => {
                            if (!date) return;
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const iso = `${year}-${month}-${day}`;
                            setEditForm({ ...editForm, tanggal: iso });
                            setIsEditDateOpen(false);
                          }}
                          disabled={(date) => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                              if (date < today) return true;
  
                              // Disable blackout dates
                              const dateStr = formatDateString(date);
                              return blackoutDates.includes(dateStr);
                          }}
                          modifiers={{
                            blackout: (date) => {
                              const dateStr = formatDateString(date);
                              return blackoutDates.includes(dateStr);
                            }
                          }}
                          modifiersClassNames={{
                            blackout: 'line-through opacity-40 bg-red-50 text-red-400'
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Jam with Time Picker */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-jam" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Jam <span className="text-red-500">*</span>
                    </Label>

                    <Popover open={isEditTimeOpen} onOpenChange={setIsEditTimeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="edit-jam"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {editForm.jam || "Pilih Jam"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-4 bg-white rounded-lg shadow-lg z-[9999] w-[260px]">
                        <div className="flex justify-between gap-4">
                          {/* JAM */}
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-2">Jam</p>
                            <div className="h-40 overflow-y-scroll scrollbar-thin snap-y snap-mandatory">
                              {Array.from({ length: 12 }).map((_, i) => {
                                const h = String(i + 10).padStart(2, "0");
                                const currentHour = editForm.jam ? editForm.jam.split(":")[0] : "";
                                return (
                                  <div
                                    key={h}
                                    onClick={() => {
                                      const parts = editForm.jam?.split(":") || [];
                                      const m = parts[1] && parts[1].length === 2 ? parts[1] : "00";
                                      setEditForm({ ...editForm, jam: `${h}:${m}` });
                                    }}
                                    className={`snap-center px-3 py-2 text-center rounded-md cursor-pointer transition
                                        ${
                                          currentHour === h
                                            ? "bg-green-600 text-white"
                                            : "hover:bg-green-100"
                                        }`}
                                  >
                                    {h}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* MENIT */}
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-2">Menit</p>
                            <div className="h-40 overflow-y-scroll scrollbar-thin snap-y snap-mandatory">
                              {Array.from({ length: 60 }).map((_, i) => {
                                const m = String(i).padStart(2, "0");
                                const currentMinute = editForm.jam ? editForm.jam.split(":")[1] : "";
                                return (
                                  <div
                                    key={m}
                                    onClick={() => {
                                      const parts = editForm.jam?.split(":") || [];
                                      const h = parts[0] && parts[0].length === 2 ? parts[0] : "00";
                                      setEditForm({ ...editForm, jam: `${h}:${m}` });
                                    }}
                                    className={`snap-center px-3 py-2 text-center rounded-md cursor-pointer transition
                                        ${
                                          currentMinute === m
                                            ? "bg-green-600 text-white"
                                            : "hover:bg-green-100"
                                        }`}
                                  >
                                    {m}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-3">
                          <Button
                            type="button"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setIsEditTimeOpen(false)}
                          >
                            Pilih
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {/* Jumlah Orang */}
                <div>
                  <Label>Jumlah Orang</Label>
                  <Input
                    type="text"
                    value={editForm.jumlah_orang}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d{0,2}$/.test(val)) 
                        {setEditForm({ ...editForm, jumlah_orang: val })
                      }  
                    }}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status Reservasi</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={editForm.status_reservasi}
                      onChange={(e) => setEditForm({ ...editForm, status_reservasi: e.target.value })}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <Label>Status DP</Label>
                    <select
                      className="w-full border rounded-md px-3 py-2"
                      value={editForm.status_dp}
                      onChange={(e) => setEditForm({ ...editForm, status_dp: e.target.value })}
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Catatan</Label>
                  <textarea
                    className="w-full border rounded-md px-3 py-2"
                    rows={3}
                    value={editForm.catatan}
                    onChange={(e) => setEditForm({ ...editForm, catatan: e.target.value })}
                    placeholder="Catatan tambahan..."
                  />
                </div>

                {/* Menu Items Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Menu yang Dipesan</Label>
                    {!isEditingMenus ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingMenus(true)}
                      >
                        Edit Menu
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setIsEditingMenus(false);
                            // Reset to original
                            if (editModal.data?.reservation_menus) {
                              setEditMenuItems(
                                editModal.data.reservation_menus.map(item => ({
                                  menu_id: item.menu_id,
                                  jumlah: item.jumlah,
                                  harga: item.menu.harga_menu
                                }))
                              );
                            }
                          }}
                        >
                          Batal
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleSubmitMenuUpdate}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Simpan Menu
                        </Button>
                      </div>
                    )}
                  </div>

                  {isEditingMenus ? (
                    // Edit Mode
                    <div className="space-y-2">
                      {editMenuItems.map((item, index) => (
                        <div key={index} className="flex gap-2 items-center p-3 bg-gray-50 rounded-lg">
                          <select
                            className="flex-1 border rounded-md px-2 py-1 text-sm"
                            value={item.menu_id}
                            onChange={(e) => handleMenuItemChange(index, 'menu_id', Number(e.target.value))}
                          >
                            {availableMenus.map(menu => (
                              <option key={menu.id} value={menu.id}>
                                {menu.nama_menu} - {formatCurrency(menu.harga_menu)}
                              </option>
                            ))}
                          </select>
                          <Input
                            type="number"
                            min="1"
                            value={item.jumlah}
                            onChange={(e) => handleMenuItemChange(index, 'jumlah', Number(e.target.value))}
                            className="w-20"
                          />
                          <div className="text-sm font-semibold w-32 text-right">
                            {formatCurrency(item.harga * item.jumlah)}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveMenuItem(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddMenuItem}
                        className="w-full"
                      >
                        + Tambah Menu
                      </Button>

                      <div className="p-3 bg-blue-50 rounded-lg font-bold flex justify-between">
                        <span>Total Menu:</span>
                        <span>{formatCurrency(editMenuItems.reduce((sum, item) => sum + (item.harga * item.jumlah), 0))}</span>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="space-y-2">
                      {editModal.data?.reservation_menus && editModal.data.reservation_menus.length > 0 ? (
                        <>
                          {editModal.data.reservation_menus.map((item) => (
                            <div key={item.id} className="flex justify-between p-2 bg-gray-50 rounded text-sm">
                              <span>{item.menu.nama_menu} x{item.jumlah}</span>
                              <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                            </div>
                          ))}
                          <div className="p-2 bg-blue-50 rounded font-bold flex justify-between text-sm">
                            <span>Total:</span>
                            <span>{formatCurrency(editModal.data.reservation_menus.reduce((sum, item) => sum + Number(item.subtotal), 0))}</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Belum ada menu dipilih</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditModal({ open: false, data: null })}
                >
                  Batal
                </Button>
                <Button type="submit">
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(v) => {
        if (!v) setDeleteDialog({ open: false, kode: '', name: '' });
      }}>
        <AlertDialogContent className="max-w-md bg-white">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <Trash className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <AlertDialogTitle className="text-center text-2xl text-red-700">
              Hapus Reservasi?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-base">
              Apakah Anda yakin ingin menghapus reservasi <b>{deleteDialog.kode}</b> atas nama <b>{deleteDialog.name}</b>?
              <br />
              <span className="text-xs text-red-600 mt-2 block">
                Hanya reservasi dengan status pending atau cancelled yang dapat dihapus.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="w-full border border-gray-300">
              Batal
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ReservasiAdmin;