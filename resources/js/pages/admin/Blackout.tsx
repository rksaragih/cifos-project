import React, { useEffect, useState } from "react";
import { Button } from "@/Components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, Trash2, Info } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/Components/ui/alert-dialog";

const AdminBlackout = () => {
    const { toast } = useToast();
    
    // Helper function to format date as YYYY-MM-DD without timezone shift
    const formatDateString = (year: number, month: number, day: number): string => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [blackoutDates, setBlackoutDates] = useState<Set<string>>(new Set<string>());
    const [originalBlackoutDates, setOriginalBlackoutDates] = useState<Set<string>>(new Set<string>());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clearDialogOpen, setClearDialogOpen] = useState(false);

    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    // Fetch blackout dates from API
    const fetchBlackoutDates = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('admin_token');
            const res = await fetch('/api/blackout-dates', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) throw new Error('Failed to fetch blackout dates');

            const result = await res.json();
            // Ensure the fetched data is treated as array of strings
            const datesArray: string[] = (result.data || []) as string[];
            const datesSet = new Set<string>(datesArray);
            setBlackoutDates(datesSet);
            setOriginalBlackoutDates(new Set<string>(datesSet)); // Keep original for comparison
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Gagal memuat data blackout',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlackoutDates();
    }, []);

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    // Navigate months
    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // Toggle date blackout
    const toggleDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const dateStr = formatDateString(year, month, day);
        
        // Don't allow blackout for past dates
        const selectedDate = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            toast({
                title: 'Tidak Diizinkan',
                description: 'Tidak dapat mengatur blackout untuk tanggal yang sudah lewat',
                variant: 'destructive'
            });
            return;
        }

        setBlackoutDates(prev => {
            const newSet = new Set(prev);
            if (newSet.has(dateStr)) {
                newSet.delete(dateStr);
            } else {
                newSet.add(dateStr);
            }
            return newSet;
        });
    };

    // Check if date is in the past
    const isPastDate = (day: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const date = new Date(year, month, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    // Check if date is today
    const isToday = (day: number) => {
        const today = new Date();
        return (
            day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear()
        );
    };

    // Save blackout dates
    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('admin_token');
            
            const res = await fetch('/api/blackout-dates', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    dates: Array.from(blackoutDates)
                })
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                let errMsg = text;
                try {
                    const j = JSON.parse(text || '{}');
                    errMsg = j.message || JSON.stringify(j) || text;
                } catch (e) {
                    // not JSON
                }
                console.error('Save blackout error', res.status, errMsg);
                throw new Error(`(${res.status}) ${errMsg || 'Failed to save'}`);
            }

            // Reload from server to ensure UI matches DB
            await fetchBlackoutDates();

            toast({
                title: 'Berhasil',
                description: 'Blackout dates berhasil disimpan'
            });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Gagal menyimpan blackout dates',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    // Clear all blackout dates
    const performClearAll = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem('admin_token');
            
            const res = await fetch('/api/blackout-dates', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) {
                const text = await res.text().catch(() => '');
                let errMsg = text;
                try {
                    const j = JSON.parse(text || '{}');
                    errMsg = j.message || JSON.stringify(j) || text;
                } catch (e) {
                    // not JSON
                }
                console.error('Clear blackout error', res.status, errMsg);
                throw new Error(`(${res.status}) ${errMsg || 'Failed to clear'}`);
            }

            // Reload to reflect cleared state from server
            await fetchBlackoutDates();

            toast({
                title: 'Berhasil',
                description: 'Semua blackout dates berhasil dihapus'
            });
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Gagal menghapus blackout dates',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
            setClearDialogOpen(false);
        }
    };

    // Reset to original
    const handleReset = () => {
        setBlackoutDates(new Set(originalBlackoutDates));
        toast({
            title: 'Reset',
            description: 'Perubahan dibatalkan'
        });
    };

    // Check if there are unsaved changes
    const hasChanges = () => {
        if (blackoutDates.size !== originalBlackoutDates.size) return true;
        for (let date of blackoutDates) {
            if (!originalBlackoutDates.has(date)) return true;
        }
        return false;
    };

    // Render calendar
    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
        const days = [];

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="h-20 w-20" />);
        }

        // Actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = formatDateString(year, month, day);
            const isBlackout = blackoutDates.has(dateStr);
            const isPast = isPastDate(day);
            const isTodayDate = isToday(day);

            days.push(
                <button
                    key={day}
                    onClick={() => toggleDate(day)}
                    disabled={isPast || loading}
                    className={`
                        h-20 w-20 rounded-md font-medium text-xs flex items-center justify-center
                        transition-transform duration-200 relative
                        ${isPast 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : isBlackout
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow transform hover:scale-105'
                                : 'bg-green-500 text-white hover:bg-green-600 shadow transform hover:scale-105'
                        }
                        ${isTodayDate && !isPast ? 'ring-2 ring-blue-400 ring-offset-1' : ''}
                        ${loading ? 'opacity-50 cursor-wait' : ''}
                    `}
                >
                    <span className="select-none">{day}</span>
                    {isTodayDate && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full" />
                    )}
                </button>
            );
        }

        return days;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
                    <p className="text-gray-600">Loading calendar...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-6xl h-full flex flex-col">
            <AlertDialog open={clearDialogOpen} onOpenChange={(v) => setClearDialogOpen(v)}>
                <AlertDialogContent className="max-w-md bg-white">
                    <AlertDialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="rounded-full bg-red-100 p-3">
                                <Trash2 className="h-12 w-12 text-red-600" />
                            </div>
                        </div>

                        <AlertDialogTitle className="text-center text-2xl text-red-700">
                            Hapus Semua Tanggal Non-Aktif?
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-center text-base">
                            Apakah Anda yakin ingin menghapus semua tanggal non-aktif? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="w-full border border-gray-300">
                            Batal
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={performClearAll}
                            className="w-full bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            {/* Header */}
            <div className="bg-white border-b px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Tanggal Non-Aktif</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Kelola tanggal yang tidak tersedia untuk reservasi
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {hasChanges() && (
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                disabled={saving}
                            >
                                Reset
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => setClearDialogOpen(true)}
                            disabled={saving || blackoutDates.size === 0}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus Semua Tanggal Non-Aktif
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={saving || !hasChanges()}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
                <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-blue-900 font-medium">Cara Menggunakan:</p>
                        <ul className="text-blue-800 mt-1 space-y-1 list-disc list-inside">
                            <li><span className="font-semibold text-green-700">Hijau</span> = Tanggal tersedia untuk reservasi</li>
                            <li><span className="font-semibold text-red-600">Merah</span> = Tanggal di-nonaktif (tidak bisa reservasi)</li>
                            <li>Klik tanggal untuk mengubah status</li>
                            <li>Klik "Simpan Perubahan" untuk menyimpan</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 border-b px-6 py-3">
                <div className="flex items-center gap-8 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span className="text-gray-700">
                            <span className="font-semibold">{blackoutDates.size}</span> Tanggal Non-Aktif
                        </span>
                    </div>
                    {hasChanges() && (
                        <div className="flex items-center gap-2 text-orange-600">
                            <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                            <span className="font-medium">Ada perubahan yang belum disimpan</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Calendar */}
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Month Navigation */}
                    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="outline"
                                onClick={previousMonth}
                                className="flex items-center gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Sebelumnya
                            </Button>
                            
                            <h2 className="text-2xl font-bold text-gray-900">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            
                            <Button
                                variant="outline"
                                onClick={nextMonth}
                                className="flex items-center gap-2"
                            >
                                Berikutnya
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        {/* Day Names */}
                        <div className="grid grid-cols-7 gap-1 mb-4 text-xs">
                            {dayNames.map((day) => (
                                <div
                                    key={day}
                                    className="text-center font-bold text-gray-700 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Days */}
                        <div className="grid grid-cols-7 gap-2 justify-items-center">
                            {renderCalendar()}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Keterangan:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-500 rounded-lg shadow-sm"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Tersedia</p>
                                    <p className="text-sm text-gray-600">Tanggal dapat digunakan untuk reservasi</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-500 rounded-lg shadow-sm"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Non-Aktif</p>
                                    <p className="text-sm text-gray-600">Tanggal tidak tersedia untuk reservasi</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg shadow-sm"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Tanggal Lewat</p>
                                    <p className="text-sm text-gray-600">Tanggal yang sudah berlalu (tidak dapat diubah)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-green-500 rounded-lg shadow-sm ring-4 ring-blue-400 ring-offset-2"></div>
                                <div>
                                    <p className="font-medium text-gray-900">Hari Ini</p>
                                    <p className="text-sm text-gray-600">Tanggal hari ini ditandai dengan ring biru</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBlackout;