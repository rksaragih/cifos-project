import React from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
// import menuPlaceholder from "@/assets/menu-placeholder.jpg";

const ArtikelDetail = () => {
  const { id } = useParams();

  // Mock data - akan diganti dengan API Laravel
  // Dalam implementasi sebenarnya, data akan di-fetch berdasarkan ID
  const article = {
    id: Number(id),
    judul: "Resep Rahasia Nasi Goreng Kami",
    topik: "Kuliner",
    isi: `Nasi goreng adalah salah satu hidangan favorit di Indonesia yang sudah mendunia. Kami dengan bangga membagikan rahasia di balik kelezatan nasi goreng special kami yang sudah terkenal dan menjadi favorit pelanggan selama bertahun-tahun.

## Rahasia Utama

Rahasia utama dari nasi goreng special kami terletak pada beberapa hal:

1. **Pemilihan Beras Berkualitas**: Kami menggunakan beras premium yang sudah dinasi dan didinginkan semalam. Nasi yang dingin akan menghasilkan tekstur yang lebih terpisah dan tidak lembek saat digoreng.

2. **Bumbu Pilihan**: Kecap manis berkualitas tinggi adalah kunci. Kami menggunakan kecap manis yang dibuat khusus dengan takaran gula aren yang pas, memberikan rasa manis yang tidak berlebihan namun sangat menggugah selera.

3. **Teknik Memasak**: Api besar adalah suatu keharusan. Dengan api yang tinggi, nasi akan tergoreng dengan sempurna dan menghasilkan aroma wangi khas yang menggugah selera.

## Bahan-Bahan

- 3 piring nasi putih (sudah dingin)
- 3 siung bawang putih, cincang halus
- 5 siung bawang merah, iris tipis
- 2 butir telur
- 100 gram ayam, potong dadu kecil
- 3 sdm kecap manis
- 1 sdm kecap asin
- Garam dan merica secukupnya
- Daun bawang, iris tipis
- Minyak goreng secukupnya

## Cara Membuat

1. Panaskan minyak dalam wajan dengan api besar
2. Tumis bawang putih dan bawang merah hingga harum
3. Masukkan ayam, masak hingga berubah warna
4. Sisihkan ke pinggir, masukkan telur dan orak-arik
5. Masukkan nasi, aduk rata dengan api besar
6. Tambahkan kecap manis, kecap asin, garam, dan merica
7. Aduk cepat hingga semua bumbu merata
8. Tambahkan daun bawang, aduk sebentar
9. Angkat dan sajikan hangat

## Tips Tambahan

- Gunakan spatula yang lebar untuk mengaduk nasi agar lebih mudah
- Jangan terlalu sering mengaduk, biarkan nasi sedikit kecoklatan untuk rasa yang lebih nikmat
- Tambahkan sedikit margarin di akhir untuk aroma yang lebih harum

Selamat mencoba! Jika Anda ingin merasakan langsung nasi goreng special kami, jangan ragu untuk berkunjung ke restoran kami.`,
    foto: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
    author: "Chef Ahmad",
    tanggal: "2024-01-15",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Back Button */}
      <section className="py-6 mt-16 border-b border-border">
        <div className="container mx-auto px-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/artikel">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Artikel
            </Link>
          </Button>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-12 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Badge className="mb-4">{article.topik}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {article.judul}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(article.tanggal).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden shadow-elegant">
            <img
              src={article.foto}
              alt={article.judul}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {article.isi.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-primary">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              } else if (paragraph.includes("\n- ")) {
                const items = paragraph.split("\n").filter((line) => line.startsWith("- "));
                return (
                  <ul key={index} className="list-disc pl-6 space-y-2 mb-6">
                    {items.map((item, i) => (
                      <li key={i} className="text-muted-foreground">
                        {item.replace("- ", "")}
                      </li>
                    ))}
                  </ul>
                );
              } else if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split("\n").filter((line) => line.match(/^\d+\./));
                return (
                  <ol key={index} className="list-decimal pl-6 space-y-2 mb-6">
                    {items.map((item, i) => (
                      <li key={i} className="text-muted-foreground">
                        {item.replace(/^\d+\.\s*/, "")}
                      </li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={index} className="mb-4 text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-12 p-8 bg-gradient-accent rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Ingin Mencoba Langsung?
            </h3>
            <p className="text-muted-foreground mb-6">
              Kunjungi restoran kami dan rasakan kelezatan menu special kami
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="default" size="lg">
                <Link to="/menu">Lihat Menu</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/reservasi">Reservasi Sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ArtikelDetail;
