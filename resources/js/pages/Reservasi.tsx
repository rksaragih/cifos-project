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
import { useBooking } from "@/Components/BookingContext";

const Reservasi = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setBooking } = useBooking();
  const [formData, setFormData] = useState({
    nama_pelanggan: "",
    nomor_wa: "",
    tanggal: "",
    jam: "",
    kategori_jumlah: "Kecil",
    jumlah_orang: "",
    catatan: "",
  });

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

    // Map local form fields to booking context shape and navigate to booking menu
    const bookingPayload = {
      name: formData.nama_pelanggan,
      phone: formData.nomor_wa,
      bookingDay: formData.tanggal,
      time: formData.jam,
      kategori_jumlah: formData.kategori_jumlah,
      jumlah_orang: formData.jumlah_orang,
      catatan: formData.catatan,
    };

    // Save to booking context (which also persists to localStorage)
    setBooking(bookingPayload);

    toast({
      title: "Berhasil!",
      description: "Reservasi Anda telah diterima. Silakan pilih menu untuk dipesan.",
    });

    // Navigate to booking menu to allow ordering
    navigate('/booking/menu');
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
  {/* Reservation Form (moved up, header removed to reduce top whitespace) */}
  <section className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Form Reservasi</CardTitle>
              <CardDescription>
                Isi form di bawah ini untuk melakukan reservasi. Tim kami akan menghubungi Anda untuk konfirmasi.
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
                    type="tel"
                    placeholder="contoh: 081234567890"
                    value={formData.nomor_wa}
                    onChange={(e) => handleChange("nomor_wa", e.target.value)}
                    required
                  />
                </div>

                {/* Tanggal & Jam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tanggal" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Tanggal <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="tanggal"
                      type="date"
                      value={formData.tanggal}
                      onChange={(e) => handleChange("tanggal", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jam" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Jam <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jam"
                      type="time"
                      value={formData.jam}
                      onChange={(e) => handleChange("jam", e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Kategori Jumlah & Jumlah Orang */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kategori_jumlah">Kategori</Label>
                    <Select
                      value={formData.kategori_jumlah}
                      onValueChange={(value) => handleChange("kategori_jumlah", value)}
                    >
                      <SelectTrigger id="kategori_jumlah">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kecil">Kecil (1-4 orang)</SelectItem>
                        <SelectItem value="Sedang">Sedang (5-10 orang)</SelectItem>
                        <SelectItem value="Besar">Besar (11+ orang)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jumlah_orang">
                      Jumlah Orang <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="jumlah_orang"
                      type="number"
                      min="1"
                      placeholder="Berapa orang?"
                      value={formData.jumlah_orang}
                      onChange={(e) => handleChange("jumlah_orang", e.target.value)}
                      required
                    />
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
                    Kirim Reservasi
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  Dengan mengirim reservasi, Anda menyetujui untuk dihubungi melalui WhatsApp untuk konfirmasi.
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
                  <p>Senin - Jumat: 10:00 - 22:00</p>
                  <p>Sabtu - Minggu: 09:00 - 23:00</p>
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
                  <p>WhatsApp: +62 812-3456-7890</p>
                  <p>Telepon: (021) 1234-5678</p>
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
