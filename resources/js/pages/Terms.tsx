import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { ArrowLeft, FileText, Shield } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Syarat dan Ketentuan</h1>
            </div>
            <p className="text-muted-foreground">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Syarat Penggunaan</CardTitle>
              <CardDescription>
                Dengan menggunakan layanan Restoran Elegan, Anda menyetujui syarat dan ketentuan berikut:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3">1. Penerimaan Syarat</h3>
                <p className="text-muted-foreground">
                  Dengan mengakses dan menggunakan website Restoran Elegan, Anda menerima dan menyetujui 
                  untuk terikat dengan syarat dan ketentuan penggunaan yang berlaku.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">2. Penggunaan Layanan</h3>
                <p className="text-muted-foreground mb-2">
                  Anda dapat menggunakan layanan kami untuk:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Melihat menu dan informasi restoran</li>
                  <li>Melakukan reservasi meja</li>
                  <li>Membaca artikel dan tips kuliner</li>
                  <li>Berinteraksi dengan konten yang tersedia</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">3. Akun Pengguna</h3>
                <p className="text-muted-foreground">
                  Saat membuat akun, Anda bertanggung jawab untuk menjaga kerahasiaan informasi 
                  akun dan password. Anda juga bertanggung jawab untuk semua aktivitas yang 
                  terjadi di bawah akun Anda.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">4. Reservasi dan Pembatalan</h3>
                <p className="text-muted-foreground">
                  Reservasi dapat dibatalkan maksimal 2 jam sebelum waktu yang dijadwalkan. 
                  Pembatalan yang dilakukan kurang dari 2 jam akan dikenakan biaya pembatalan 
                  sesuai dengan kebijakan restoran.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">5. Pembayaran</h3>
                <p className="text-muted-foreground">
                  Pembayaran dapat dilakukan secara tunai atau menggunakan kartu kredit/debit 
                  yang diterima. Kami berhak menolak pembayaran yang tidak valid atau mencurigakan.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">6. Perubahan Syarat</h3>
                <p className="text-muted-foreground">
                  Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan 
                  diberitahukan melalui website atau email. Penggunaan berkelanjutan setelah 
                  perubahan dianggap sebagai persetujuan terhadap syarat yang baru.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">7. Kontak</h3>
                <p className="text-muted-foreground">
                  Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, 
                  silakan hubungi kami di info@restoranelegan.com atau (021) 1234-5678.
                </p>
              </section>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline">
              <Link to="/register" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Kembali ke Pendaftaran
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;


