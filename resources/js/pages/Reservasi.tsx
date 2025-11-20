import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Calendar, Clock, Users, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

// UI Components for Date Picker
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar as CalendarPicker } from "@/Components/ui/calendar";

import "react-day-picker/dist/style.css";

const Reservasi = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Helper function to format date as YYYY-MM-DD without timezone shift
  const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    nomor_wa: "",
    tanggal: "",
    jam: "",
    kategori_jumlah: "<10",
    jumlah_orang: "",
    catatan: "",
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);
  const [blackoutDates, setBlackoutDates] = useState<string[]>([]);

  // Fetch blackout dates
  React.useEffect(() => {
    const fetchBlackoutDates = async () => {
      try {
        const res = await fetch('/api/blackout-dates', {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });
        console.log('Blackout fetch response:', res.status, res.ok);
        if (res.ok) {
          const result = await res.json();
          console.log('Blackout dates result:', result);
          setBlackoutDates(result.data || []);
          console.log('Blackout dates loaded:', result.data);
        } else {
          const text = await res.text();
          console.error('Blackout fetch failed:', res.status, text);
        }
      } catch (err) {
        console.error('Failed to load blackout dates:', err);
      }
    };
    fetchBlackoutDates();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.nama_pelanggan || !formData.nomor_wa || !formData.tanggal || !formData.jam || !formData.jumlah_orang) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    // Validasi blackout dates
    if (blackoutDates.includes(formData.tanggal)) {
      toast({
        title: "Error",
        description: "Tanggal yang dipilih tidak tersedia (blackout date)",
        variant: "destructive",
      });
      return;
    }

    // Validasi jam operasional (10:00 - 22:00)
    const [jamHour] = formData.jam.split(':').map(Number);
    if (jamHour < 10 || jamHour > 22) {
      toast({
        title: "Error",
        description: "Jam reservasi harus antara 10:00 - 22:00 (jam operasional)",
        variant: "destructive",
      });
      return;
    }

    // Simpan ke localStorage
    localStorage.setItem('reservation_data', JSON.stringify(formData));

    toast({
      title: "Berhasil!",
      description: "Data reservasi tersimpan. Silakan pilih menu.",
    });

    // Navigate with React Router
    navigate('/reservasi/menu');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Form Reservasi</CardTitle>
              <CardDescription>
                Isi form di bawah ini untuk melakukan reservasi. Anda akan diarahkan untuk memilih menu selanjutnya.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nama Pelanggan */}
                <div className="space-y-2">
                  <Label htmlFor="nama_pelanggan" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Nama Lengkap <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nama_pelanggan"
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.nama_pelanggan}
                    onChange={(e) => handleChange("nama_pelanggan", e.target.value)}
                    maxLength={30}
                    required
                  />
                </div>

                {/* Nomor WhatsApp */}
                <div className="space-y-2">
                  <Label htmlFor="nomor_wa" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Nomor WhatsApp <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nomor_wa"
                    type="text"
                    placeholder="contoh: 081234567890"
                    value={formData.nomor_wa}
                    onChange={(e) => {
                      const val = e.target.value;

                      // Hanya izinkan angka (0-9)
                      if (/^\d*$/.test(val) && val.length <= 15) {
                        handleChange("nomor_wa", val);
                      }
                    }}
                    required
                    maxLength={15}
                  />
                </div>

                {/* Tanggal & Jam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal <span className="text-destructive">*</span>
                    </Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          id="tanggal"
                          className="w-full justify-start text-left font-normal"
                          type="button"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.tanggal 
                            ? new Date(formData.tanggal + "T00:00:00").toLocaleDateString('id-ID', {
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
                            formData.tanggal
                              ? new Date(formData.tanggal + "T00:00:00")
                              : undefined
                          }
                          onSelect={(date) => {
                            if (!date) return;
                            const iso = formatDateString(date);
                            handleChange("tanggal", iso);
                            setIsCalendarOpen(false);
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="jam" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Jam <span className="text-destructive">*</span>
                    </Label>

                    <Popover open={isTimeOpen} onOpenChange={setIsTimeOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {formData.jam || "Pilih Jam"}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="p-4 bg-white rounded-lg shadow-lg z-[9999] w-[260px]">
                        <div className="flex justify-between gap-4">

                          {/* JAM */}
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-2">Jam</p>
                            <div className="h-40 overflow-y-scroll scrollbar-none snap-y snap-mandatory">
                              {Array.from({ length: 12 }).map((_, i) => {
                                const h = String(i + 10).padStart(2, "0");
                                return (
                                  <div
                                    key={h}
                                    onClick={() => {
                                      const m = formData.jam.split(":")[1] || "00";
                                      handleChange("jam", `${h}:${m}`);
                                    }}
                                    className={`snap-center px-3 py-2 text-center rounded-md cursor-pointer transition
                                        ${
                                          formData.jam.startsWith(h)
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
                            <div className="h-40 overflow-y-scroll scrollbar-none snap-y snap-mandatory">
                              {Array.from({ length: 60 }).map((_, i) => {
                                const m = String(i).padStart(2, "0");
                                return (
                                  <div
                                    key={m}
                                    onClick={() => {
                                      const h = formData.jam.split(":")[0] || "00";
                                      handleChange("jam", `${h}:${m}`);
                                    }}
                                    className={`snap-center px-3 py-2 text-center rounded-md cursor-pointer transition
                                        ${
                                          formData.jam.endsWith(m)
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
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setIsTimeOpen(false)}
                          >
                            Pilih
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Kategori Jumlah & Jumlah Orang */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jumlah_orang">
                      Jumlah Orang <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jumlah_orang"
                      type="text"
                      value={formData.jumlah_orang}
                      placeholder="Berapa orang?"
                      onChange={(e) => {
                        const val = e.target.value;

                        // hanya angka 1-2 digit
                        if (/^\d{0,2}$/.test(val)) {
                          handleChange("jumlah_orang", val);

                          // auto update kategori
                          if (val !== "") {
                            if (Number(val) < 10) handleChange("kategori_jumlah", "<10");
                            else handleChange("kategori_jumlah", ">10");
                          }
                        }
                      }}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="kategori_jumlah">
                      Kategori Jumlah <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.kategori_jumlah}
                      onValueChange={(value) => handleChange("kategori_jumlah", value)}
                    >
                      <SelectTrigger id="kategori_jumlah" disabled>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border rounded-md shadow-xl z-[9999]">
                        <SelectItem value="<10">&lt;10 (Menu Opsional)</SelectItem>
                        <SelectItem value=">10">&gt;10 (Menu Wajib)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Catatan */}
                <div className="space-y-2">
                  <Label htmlFor="catatan" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Catatan Tambahan
                  </Label>
                  <Textarea
                    id="catatan"
                    placeholder="Permintaan khusus, alergi makanan, atau informasi lainnya..."
                    value={formData.catatan}
                    onChange={(e) => handleChange("catatan", e.target.value)}
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" variant="default" size="lg" className="w-full">
                    Lanjut ke Pemilihan Menu
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Dengan melanjutkan, Anda menyetujui untuk dihubungi melalui WhatsApp untuk konfirmasi reservasi.
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Jam Operasional
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Senin - Kamis: 10:00 - 21:00</p>
                  <p>Jumat - Minggu: 10:00 - 22:00</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-primary" />
                  Kontak Darurat
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>WhatsApp: +62 877-4601-0838</p>
                  <p>Email: sweetdeli@gmail.com</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reservasi;