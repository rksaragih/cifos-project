import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { useBooking } from "@/Components/BookingContext";

const BookingInfo = () => {
  const navigate = useNavigate();
  const { booking, setBooking, clearBooking } = useBooking();

  const [formData, setFormData] = useState({
    name: booking.name ?? "",
    phone: booking.phone ?? "",
    email: booking.email ?? "",
    bookingDay: booking.bookingDay ?? "",
    time: booking.time ?? "",
    kategori_jumlah: booking.kategori_jumlah ?? "Kecil",
    jumlah_orang: booking.jumlah_orang ?? "",
    catatan: booking.catatan ?? ""
  });

  useEffect(() => {
    // sync if booking updated elsewhere
    setFormData({
      name: booking.name ?? "",
      phone: booking.phone ?? "",
      email: booking.email ?? "",
      bookingDay: booking.bookingDay ?? "",
      time: booking.time ?? "",
      kategori_jumlah: booking.kategori_jumlah ?? "Kecil",
      jumlah_orang: booking.jumlah_orang ?? "",
      catatan: booking.catatan ?? ""
    });
  }, [booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // save booking info to context/localStorage and proceed to pick menu step
    // ensure kategori_jumlah syncs with jumlah_orang
    const jumlah = Number((formData as any).jumlah_orang || 0);
    let kategori = formData.kategori_jumlah;
    if (jumlah >= 11) kategori = 'Besar';
    else if (jumlah >= 5) kategori = 'Sedang';
    else kategori = 'Kecil';
    setBooking({ ...formData, kategori_jumlah: kategori });
    navigate('/booking/menu');
  };

  const handleClear = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      bookingDay: "",
      time: "",
      kategori_jumlah: "Kecil",
      jumlah_orang: "",
      catatan: ""
    });
    // Also clear the booking context
    clearBooking();
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto mt-12">
            <div className="bg-white shadow-sm rounded-lg border">
              <div className="px-8 py-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-center">Personal info</h1>
                <p className="text-sm text-center text-muted-foreground mb-6">Mohon isi data diri anda pada kolom dibawah ini</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name" className="text-xs font-semibold mb-2 block uppercase">Name</Label>
                    <Input 
                      id="name"
                      placeholder="Nama pemesan"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="border-green-600 focus:ring-0 focus:border-green-600 rounded-md"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-xs font-semibold mb-2 block uppercase">Phone</Label>
                      <Input 
                        id="phone"
                        type="tel"
                        placeholder="Nomor telpon"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="border-green-600 focus:ring-0 focus:border-green-600 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs font-semibold mb-2 block uppercase">Email</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="border-green-600 focus:ring-0 focus:border-green-600 rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="tanggal" className="text-xs font-semibold mb-2 block uppercase">Reservation Day</Label>
                      <Input
                        id="bookingDay"
                        type="date"
                        placeholder="Pilih hari reservasi"
                        value={formData.bookingDay}
                        onChange={(e) => setFormData({...formData, bookingDay: e.target.value})}
                        className="border-green-600 focus:ring-0 focus:border-green-600 rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time" className="text-xs font-semibold mb-2 block uppercase">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({...formData, time: e.target.value})}
                        className="border-green-600 focus:ring-0 focus:border-green-600 rounded-md"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jumlah_orang" className="text-xs font-semibold mb-2 block uppercase">Jumlah Orang</Label>
                      <Input
                        id="jumlah_orang"
                        type="number"
                        min={1}
                        placeholder="Berapa orang?"
                        value={(formData as any).jumlah_orang}
                        onChange={(e) => {
                          const val = e.target.value;
                          let kategori = 'Kecil';
                          const num = Number(val || 0);
                          if (num >= 11) kategori = 'Besar';
                          else if (num >= 5) kategori = 'Sedang';
                          setFormData({...formData, jumlah_orang: val, kategori_jumlah: kategori});
                        }}
                        className="border-green-600 focus:ring-0 focus:border-green-600 rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="kategori_jumlah" className="text-xs font-semibold mb-2 block uppercase">Kategori</Label>
                      <div>
                        <select id="kategori_jumlah" value={(formData as any).kategori_jumlah} onChange={(e) => setFormData({...formData, kategori_jumlah: e.target.value})} className="w-full border border-green-600 rounded-md p-2">
                          <option value="Kecil">Kecil (1-4 orang)</option>
                          <option value="Sedang">Sedang (5-10 orang)</option>
                          <option value="Besar">Besar (11+ orang)</option>
                        </select>
                      </div>
                    </div>
                  </div>



                  <div>
                    <Label htmlFor="catatan" className="text-xs font-semibold mb-2 block uppercase">Catatan Tambahan</Label>
                    <Textarea
                      id="catatan"
                      placeholder="Permintaan khusus, alergi makanan, atau informasi lainnya..."
                      value={(formData as any).catatan}
                      onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                      className="border-green-600 focus:ring-0 focus:border-green-600 min-h-[72px] resize-none rounded-md"
                    />
                  </div>

                  <div className="flex items-center justify-start gap-4 pt-4">
                    <Button 
                      type="submit"
                      className="bg-emerald-800 hover:bg-emerald-900 text-white px-6 py-2 rounded-full"
                    >
                      Next Page
                    </Button>
                    <button type="button" onClick={handleClear} className="text-sm text-muted-foreground">✕ Clear all</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingInfo;
