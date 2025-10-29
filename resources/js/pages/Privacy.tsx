import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { ArrowLeft, Shield, Eye, Lock, Database } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Kebijakan Privasi</h1>
            </div>
            <p className="text-muted-foreground">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Komitmen Privasi Kami</CardTitle>
              <CardDescription>
                Restoran Elegan berkomitmen untuk melindungi privasi dan keamanan informasi pribadi Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Informasi yang Kami Kumpulkan
                </h3>
                <p className="text-muted-foreground mb-2">
                  Kami mengumpulkan informasi berikut:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Informasi pribadi (nama, email, nomor telepon)</li>
                  <li>Informasi reservasi dan preferensi makanan</li>
                  <li>Data penggunaan website dan interaksi</li>
                  <li>Informasi pembayaran (diamankan dengan enkripsi)</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Penggunaan Informasi
                </h3>
                <p className="text-muted-foreground mb-2">
                  Informasi yang kami kumpulkan digunakan untuk:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Memproses reservasi dan pesanan</li>
                  <li>Memberikan layanan pelanggan yang lebih baik</li>
                  <li>Mengirimkan informasi promosi dan update menu</li>
                  <li>Meningkatkan kualitas layanan dan website</li>
                  <li>Mematuhi kewajiban hukum yang berlaku</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Keamanan Data
                </h3>
                <p className="text-muted-foreground">
                  Kami menggunakan teknologi enkripsi SSL dan protokol keamanan lainnya 
                  untuk melindungi informasi pribadi Anda. Data disimpan di server yang 
                  aman dan hanya dapat diakses oleh personel yang berwenang.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Berbagi Informasi</h3>
                <p className="text-muted-foreground">
                  Kami tidak menjual, menyewakan, atau membagikan informasi pribadi Anda 
                  kepada pihak ketiga tanpa persetujuan Anda, kecuali untuk keperluan hukum 
                  atau jika diperlukan untuk memberikan layanan yang Anda minta.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Cookie dan Teknologi Pelacakan</h3>
                <p className="text-muted-foreground">
                  Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna 
                  dan menganalisis penggunaan website. Anda dapat mengatur preferensi 
                  cookie melalui pengaturan browser Anda.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Hak Anda</h3>
                <p className="text-muted-foreground mb-2">
                  Anda memiliki hak untuk:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                  <li>Mengakses informasi pribadi yang kami simpan</li>
                  <li>Meminta koreksi atau penghapusan data</li>
                  <li>Menolak pemrosesan data untuk tujuan tertentu</li>
                  <li>Meminta portabilitas data</li>
                  <li>Mengajukan keluhan kepada otoritas yang berwenang</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Retensi Data</h3>
                <p className="text-muted-foreground">
                  Kami menyimpan informasi pribadi Anda selama diperlukan untuk memberikan 
                  layanan atau sesuai dengan kewajiban hukum. Data yang tidak diperlukan 
                  lagi akan dihapus secara aman.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Perubahan Kebijakan</h3>
                <p className="text-muted-foreground">
                  Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. 
                  Perubahan akan diberitahukan melalui website atau email. Kami mendorong 
                  Anda untuk meninjau kebijakan ini secara berkala.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold mb-3">Kontak</h3>
                <p className="text-muted-foreground">
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini atau ingin 
                  menggunakan hak-hak Anda, silakan hubungi kami di:
                </p>
                <div className="mt-2 p-4 bg-muted rounded-lg">
                  <p className="text-sm">
                    Email: privacy@restoranelegan.com<br />
                    Telepon: (021) 1234-5678<br />
                    Alamat: Jl. Restoran Elegan No. 123, Jakarta
                  </p>
                </div>
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

export default Privacy;


