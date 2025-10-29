import React, { useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import MenuCard from "@/Components/MenuCard";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

const Menu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  // Handle category from URL parameter
  React.useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const categoryMap: Record<string, string> = {
        'makanan': 'Makanan',
        'minuman': 'Minuman', 
        'dessert': 'Dessert',
        'appetizer': 'Appetizer',
        'snack': 'Snack'
      };
      setSelectedCategory(categoryMap[categoryParam] || 'Semua');
    }
  }, [searchParams]);

  // Embla carousel hooks for Recommended & Best sections
  const [recommendedRef, emblaRecommended] = useEmblaCarousel({ loop: false, align: 'start' });
  const [bestRef, emblaBest] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollRecommendedPrev = useCallback(() => emblaRecommended && emblaRecommended.scrollPrev(), [emblaRecommended]);
  const scrollRecommendedNext = useCallback(() => emblaRecommended && emblaRecommended.scrollNext(), [emblaRecommended]);
  const scrollBestPrev = useCallback(() => emblaBest && emblaBest.scrollPrev(), [emblaBest]);
  const scrollBestNext = useCallback(() => emblaBest && emblaBest.scrollNext(), [emblaBest]);


  // Mock data - akan diganti dengan API Laravel
  const categories = [
    { id: 1, nama: "Semua" },
    { id: 2, nama: "Makanan" },
    { id: 3, nama: "Minuman" },
    { id: 4, nama: "Dessert" },
    { id: 5, nama: "Appetizer" },
    { id: 6, nama: "Snack" },
  ];

  const menus = [
    {
      id: 1,
      kategori_id: 2,
      nama_menu: "Nasi Goreng Special",
      harga_menu: 45000,
      tersedia: true,
      kategori: "Makanan",
      deskripsi: "Nasi goreng dengan potongan ayam, udang, dan telur yang dimasak dengan bumbu rempah pilihan. Disajikan dengan kerupuk dan acar segar.",
      bahan: ["Nasi", "Ayam", "Udang", "Telur", "Bawang", "Cabai"],
      alergen: ["Telur", "Udang", "Kedelai"],
      rating: 4.5,
      review_count: 128,
      prep_time: 15,
      serving_size: 1,
      kalori: 650,
      level_pedas: "Pedas" as const,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      kategori_id: 2,
      nama_menu: "Sate Ayam Madura",
      harga_menu: 50000,
      tersedia: true,
      kategori: "Makanan",
      deskripsi: "Sate ayam khas Madura dengan bumbu kacang yang gurih dan lontong hangat. Disajikan dengan acar dan sambal.",
      bahan: ["Daging ayam", "Bumbu kacang", "Lontong", "Bawang merah goreng", "Kecap manis"],
      alergen: ["Kacang"],
      rating: 5,
      review_count: 256,
      prep_time: 20,
      serving_size: 1,
      kalori: 580,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      kategori_id: 2,
      nama_menu: "Mie Goreng Seafood",
      harga_menu: 48000,
      tersedia: true,
      kategori: "Makanan",
      deskripsi: "Mie goreng dengan aneka seafood segar seperti udang, cumi, dan kerang. Dimasak dengan bumbu spesial dan sayuran segar.",
      bahan: ["Mie kuning", "Udang", "Cumi", "Kerang", "Sayuran segar"],
      alergen: ["Seafood", "Gluten"],
      rating: 4,
      review_count: 95,
      prep_time: 18,
      serving_size: 1,
      kalori: 720,
      level_pedas: "Pedas" as const,
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      kategori_id: 3,
      nama_menu: "Lumpia Semarang",
      harga_menu: 35000,
      tersedia: true,
      kategori: "Appetizer",
      deskripsi: "Lumpia khas Semarang dengan isian rebung, udang, dan telur. Disajikan dengan saus kacang yang gurih.",
      bahan: ["Kulit lumpia", "Rebung", "Udang", "Telur", "Sayuran"],
      alergen: ["Telur", "Udang", "Kacang"],
      rating: 4,
      review_count: 67,
      prep_time: 12,
      serving_size: 5,
      kalori: 320,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      kategori_id: 3,
      nama_menu: "Tahu Isi",
      harga_menu: 25000,
      tersedia: true,
      kategori: "Appetizer",
      deskripsi: "Tahu putih yang diisi dengan sayuran segar dan daging cincang, digoreng krispi. Disajikan dengan saus cabai.",
      bahan: ["Tahu putih", "Wortel", "Kol", "Daging cincang"],
      alergen: ["Kedelai"],
      rating: 4,
      review_count: 45,
      prep_time: 10,
      serving_size: 5,
      kalori: 280,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      kategori_id: 4,
      nama_menu: "Es Teh Manis",
      harga_menu: 10000,
      tersedia: true,
      kategori: "Minuman",
      deskripsi: "Teh manis dingin yang menyegarkan, cocok menemani hidangan Anda.",
      bahan: ["Teh", "Gula", "Es batu"],
      rating: 4,
      review_count: 189,
      prep_time: 5,
      serving_size: 1,
      kalori: 120,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 7,
      kategori_id: 4,
      nama_menu: "Jus Alpukat",
      harga_menu: 18000,
      tersedia: true,
      kategori: "Minuman",
      deskripsi: "Jus alpukat segar dengan susu dan gula aren, creamy dan nikmat.",
      bahan: ["Alpukat", "Susu", "Gula aren", "Es batu"],
      alergen: ["Susu"],
      rating: 5,
      review_count: 143,
      prep_time: 7,
      serving_size: 1,
      kalori: 350,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 8,
      kategori_id: 5,
      nama_menu: "Es Krim Vanilla",
      harga_menu: 20000,
      tersedia: false,
      kategori: "Dessert",
      deskripsi: "Es krim vanilla premium dengan topping pilihan.",
      bahan: ["Susu", "Vanilla", "Gula"],
      alergen: ["Susu"],
      rating: 4,
      review_count: 78,
      prep_time: 5,
      serving_size: 1,
      kalori: 250,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 9,
      kategori_id: 2,
      nama_menu: "Gado-Gado",
      harga_menu: 35000,
      tersedia: true,
      kategori: "Makanan",
      deskripsi: "Salad sayuran segar dengan bumbu kacang yang gurih dan kerupuk.",
      bahan: ["Sayuran segar", "Bumbu kacang", "Kerupuk", "Telur"],
      alergen: ["Kacang", "Telur"],
      rating: 4.5,
      review_count: 156,
      prep_time: 12,
      serving_size: 1,
      kalori: 420,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 10,
      kategori_id: 2,
      nama_menu: "Rendang Daging",
      harga_menu: 65000,
      tersedia: true,
      kategori: "Makanan",
      deskripsi: "Daging sapi yang dimasak dengan bumbu rempah khas Padang hingga empuk.",
      bahan: ["Daging sapi", "Santan", "Bumbu rempah", "Daun jeruk"],
      rating: 5,
      review_count: 298,
      prep_time: 45,
      serving_size: 1,
      kalori: 580,
      level_pedas: "Pedas" as const,
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const filteredMenus =
    selectedCategory === "Semua"
      ? menus
      : menus.filter((menu) => menu.kategori === selectedCategory);

  // Show filtered menus in All Product section when category is selected
  const displayMenus = selectedCategory === "Semua" ? menus : filteredMenus;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Pick Your Menu</h1>
          </div>

          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.nama ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.nama)}
                  className="rounded-full"
                >
                  {category.nama}
                </Button>
              ))}
            </div>
          </div>
          {/* Recommended (carousel) */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={scrollRecommendedPrev}><ChevronLeft className="w-5 h-5"/></Button>
                <Button variant="outline" size="icon" onClick={scrollRecommendedNext}><ChevronRight className="w-5 h-5"/></Button>
              </div>
            </div>

            <div className="overflow-hidden" ref={recommendedRef as any}>
              <div className="flex gap-5">
                {(selectedCategory === "Semua" ? menus : filteredMenus).slice(0,6).map((m) => (
                  <div className="min-w-[260px] flex-shrink-0" key={m.id}>
                    <MenuCard 
                      nama_menu={m.nama_menu} 
                      harga_menu={m.harga_menu} 
                      foto_menu={m.image} 
                      tersedia={m.tersedia} 
                      kategori={m.kategori}
                      onClick={() => {}} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Best Seller (carousel) */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Best Seller</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={scrollBestPrev}><ChevronLeft className="w-5 h-5"/></Button>
                <Button variant="outline" size="icon" onClick={scrollBestNext}><ChevronRight className="w-5 h-5"/></Button>
              </div>
            </div>

            <div className="overflow-hidden" ref={bestRef as any}>
              <div className="flex gap-5">
                {(selectedCategory === "Semua" ? menus : filteredMenus).slice(4,10).map((m) => (
                  <div className="min-w-[260px] flex-shrink-0" key={m.id}>
                    <MenuCard 
                      nama_menu={m.nama_menu} 
                      harga_menu={m.harga_menu} 
                      foto_menu={m.image} 
                      tersedia={m.tersedia} 
                      kategori={m.kategori}
                      onClick={() => {}} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Product */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory === "Semua" ? "All Product" : selectedCategory}
            </h2>
            {displayMenus.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayMenus.map((m) => (
                  <MenuCard 
                    key={m.id} 
                    nama_menu={m.nama_menu} 
                    harga_menu={m.harga_menu} 
                    foto_menu={m.image} 
                    tersedia={m.tersedia} 
                    kategori={m.kategori}
                    onClick={() => {}} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Tidak ada menu untuk kategori "{selectedCategory}"</p>
                <p className="text-gray-400 text-sm mt-2">Silakan pilih kategori lain</p>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="mx-auto">Load more 100+</Button>
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
};

export default Menu;
