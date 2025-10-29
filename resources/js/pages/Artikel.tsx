import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ArticleCard from "@/Components/ArticleCard";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";

const Artikel = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("Semua");

  // Mock data - akan diganti dengan API Laravel
  const topics = ["Semua", "Kuliner", "Tips", "Resep", "Berita"];

  const articles = [
    {
      id: 1,
      judul: "Resep Rahasia Nasi Goreng Kami",
      topik: "Kuliner",
      isi: "Nasi goreng adalah salah satu hidangan favorit di Indonesia. Kami membagikan rahasia di balik kelezatan nasi goreng special kami yang sudah terkenal. Dengan bumbu pilihan dan teknik memasak yang tepat, nasi goreng kami selalu menjadi favorit pelanggan. Rahasia utamanya adalah penggunaan kecap manis berkualitas tinggi dan api yang pas saat menggoreng.",
      author: "Chef Ahmad",
      tanggal: "2024-01-15",
    },
    {
      id: 2,
      judul: "Tips Memilih Bahan Segar untuk Masakan",
      topik: "Tips",
      isi: "Kualitas bahan adalah kunci dari masakan yang lezat. Berikut adalah tips dari chef kami untuk memilih bahan-bahan segar berkualitas tinggi. Perhatikan warna, aroma, dan tekstur dari setiap bahan yang akan Anda beli. Untuk daging, pastikan warnanya cerah dan tidak berbau menyengat. Untuk sayuran, pilih yang masih segar dan tidak layu.",
      author: "Chef Sarah",
      tanggal: "2024-01-10",
    },
    {
      id: 3,
      judul: "Sejarah Sate di Indonesia",
      topik: "Kuliner",
      isi: "Sate merupakan salah satu kuliner khas Indonesia yang sudah mendunia. Mari kita telusuri sejarah dan perkembangan sate di nusantara. Dari Madura hingga Padang, setiap daerah memiliki cara unik dalam membuat sate. Bumbu kacang yang khas dan cara membakar yang tepat membuat sate Indonesia berbeda dari negara lain.",
      author: "Chef Ahmad",
      tanggal: "2024-01-05",
    },
    {
      id: 4,
      judul: "Menu Baru Musim Ini",
      topik: "Berita",
      isi: "Kami dengan bangga memperkenalkan menu baru untuk musim ini. Nikmati inovasi kuliner terbaru dari dapur kami. Menu spesial kali ini terinspirasi dari cita rasa Nusantara dengan sentuhan modern. Tersedia untuk waktu terbatas, jadi jangan sampai ketinggalan!",
      author: "Tim Redaksi",
      tanggal: "2024-01-01",
    },
    {
      id: 5,
      judul: "Cara Membuat Sambal Matah Khas Bali",
      topik: "Resep",
      isi: "Sambal matah adalah sambal khas Bali yang segar dan pedas. Berikut adalah resep lengkap untuk membuat sambal matah di rumah. Bahan utamanya adalah bawang merah, cabai rawit, serai, dan terasi. Semua bahan dicampur mentah sehingga menghasilkan rasa yang segar dan aromanya sangat menggugah selera.",
      author: "Chef Sarah",
      tanggal: "2023-12-28",
    },
    {
      id: 6,
      judul: "Manfaat Rempah-Rempah dalam Masakan Indonesia",
      topik: "Tips",
      isi: "Rempah-rempah bukan hanya membuat masakan lebih lezat, tetapi juga memiliki banyak manfaat kesehatan. Indonesia kaya akan berbagai jenis rempah seperti kunyit, jahe, lengkuas, dan kayu manis. Setiap rempah memiliki khasiat tersendiri, mulai dari anti-inflamasi hingga meningkatkan imunitas tubuh.",
      author: "Chef Ahmad",
      tanggal: "2023-12-20",
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.isi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = selectedTopic === "Semua" || article.topik === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-hero py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground">
            Artikel & Berita
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Tips kuliner, resep spesial, dan berita terbaru dari restoran kami
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-muted/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari artikel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Topic Filter */}
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-12 flex-1">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Menampilkan {filteredArticles.length} artikel
              {selectedTopic !== "Semua" && ` dengan topik "${selectedTopic}"`}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Tidak ada artikel yang ditemukan.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Artikel;
