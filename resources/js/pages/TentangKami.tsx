import Navbar from "@/Components/contexts/Navbar";
import Footer from "@/Components/contexts/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/Components/ui/button";

const TentangKami = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Tentang Kami</h1>
          <p className="text-lg text-muted-foreground mb-6">
            CIFOS adalah platform restoran dan reservasi yang didesain untuk menghadirkan pengalaman kuliner terbaik.
            Kami menggabungkan pilihan menu berkualitas, kemudahan pemesanan, dan layanan pelanggan yang ramah untuk membantu Anda
            menikmati waktu makan yang tak terlupakan bersama keluarga dan teman.
          </p>

          <section className="space-y-4 text-left">
            <h2 className="text-2xl font-semibold">Misi kami</h2>
            <p className="text-muted-foreground">Memberikan akses ke pengalaman kuliner berkualitas melalui layanan yang mudah digunakan, transparansi, dan dedikasi terhadap citarasa.</p>

            <h2 className="text-2xl font-semibold">Apa yang kami tawarkan</h2>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Menu beragam dari bahan pilihan dan resep berkualitas.</li>
              <li>Sistem reservasi online yang cepat dan aman.</li>
              <li>Informasi restoran, jam operasional, dan lokasi yang mudah diakses.</li>
            </ul>

            <h2 className="text-2xl font-semibold">Nilai kami</h2>
            <p className="text-muted-foreground">Kualitas, kenyamanan, dan integritas. Kami percaya bahwa makanan menyatukan orang — dan setiap detail penting untuk pengalaman tersebut.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TentangKami;
