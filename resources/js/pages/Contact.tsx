import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MapPin as MapIcon, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/Components/ui/alert-dialog";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    topic: "",
    name: "",
    email: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic || !formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Format email tidak valid",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Tampilkan pop-up sukses
        setShowSuccessDialog(true);

        // Reset form
        setFormData({ 
          topic: "", 
          name: "", 
          email: "", 
          description: "" 
        });
      } else {
        throw new Error(data.message || "Gagal mengirim pesan");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Terjadi kesalahan saat mengirim pesan",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const TikTokIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d="M224 72a48.05 48.05 0 0 1-48-48h-32v140a36 36 0 1 1-36-36v-32a68 68 0 1 0 68 68V88a80.12 80.12 0 0 0 48 16Z" />
    </svg>
  );

  const topicLabels: { [key: string]: string } = {
    inquiry: "Pertanyaan Umum",
    feedback: "Masukan",
    complaint: "Komplain"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Success Dialog/Pop-up */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="max-w-md bg-white">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <AlertDialogTitle className="text-center text-2xl">
              Pesan Berhasil Terkirim!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-base">
              Terima kasih telah menghubungi kami. Kami akan segera membalas pesan Anda melalui email dalam 1-2 hari kerja.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="w-full bg-green-600 hover:bg-green-700">
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
            {/* Form Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-3">Contact us</h1>
                <p className="text-secondary text-lg">
                  Kami ingin mendengar pertanyaan, masukan, atau pendapat dari Anda.
                  Kirimkan pesan kepada kami dan kami akan segera membalasnya.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="topic" className="text-sm font-medium mb-2 block">
                    Topik <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.topic} onValueChange={(value) => setFormData({...formData, topic: value})}>
                    <SelectTrigger className="w-full bg-white text-gray-900">
                      <SelectValue placeholder="Pilih topik" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg z-50">
                      <SelectItem value="inquiry" className="focus:bg-gray-100 data-[highlighted]:bg-gray-100">Pertanyaan Umum</SelectItem> 
                      <SelectItem value="feedback" className="focus:bg-gray-100 data-[highlighted]:bg-gray-100">Masukan</SelectItem>
                      <SelectItem value="complaint" className="focus:bg-gray-100 data-[highlighted]:bg-gray-100">Komplain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Nama <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="name"
                      placeholder="Nama lengkap Anda"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full"
                      maxLength={50}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                    Deskripsi (opsional)
                  </Label>
                  <Textarea 
                    id="description"
                    placeholder="Tuliskan pesan Anda di sini..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full min-h-[120px] resize-none"
                    maxLength={1000}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Mengirim...</>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      KIRIM
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact details & location */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Kontak Kami</CardTitle>
                  <CardDescription>Hubungi kami untuk informasi lebih lanjut</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Telepon</h3>
                      <a 
                        href="https://wa.me/6287746010838" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        +62 877-4601-0838
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a 
                        href="mailto:sweetdeli@gmail.com"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        sweetdeli@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Jam Operasional</h3>
                      <div className="text-muted-foreground space-y-1">
                        <p>Senin - Kamis: 10:00 - 21:00</p>
                        <p>Jumat - Minggu: 10:00 - 22:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Lokasi Kami</CardTitle>
                  <CardDescription>Kunjungi restoran kami</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapIcon className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Alamat</h3>
                      <p className="text-muted-foreground">
                      Jl. Raya Puncak No.477, Bendungan, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720
                      </p>
                    </div>
                  </div>

                  <Button asChild className="w-full" variant="outline">
                    <a
                      href="https://maps.app.goo.gl/ibcmU7HJBxSaA1gu5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MapIcon className="w-4 h-4 mr-2" />
                      Lihat di Google Maps
                    </a>
                  </Button>

                  <div className="mt-6">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.892261514713!2d106.85205909999999!3d-6.6602727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c975081859e1%3A0x82c4bfbc21776031!2sCifos%20ciawi!5e0!3m2!1sen!2sid!4v1760724292116!5m2!1sen!2sid"
                      width="100%"
                      height="200"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>

              <Card className="w-full">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Ikuti Kami</CardTitle>
                  <CardDescription>
                    Tetap terhubung dengan kami melalui media sosial
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <Button asChild variant="outline" size="lg" className="gap-2 w-full">
                      <a
                        href="https://www.instagram.com/cifos_ciawi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </a>
                    </Button>

                    {/* TikTok */}
                    <Button asChild variant="outline" size="lg" className="gap-2 w-full">
                      <a
                        href="https://www.tiktok.com/@cifos.ciawi?is_from_webapp=1&sender_device=pc"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <TikTokIcon className="w-5 h-5" />
                        TikTok
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;