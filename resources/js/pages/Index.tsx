import React from "react";
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/Components/ui/button";
import { Card, CardContent } from "@/Components/ui/card";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import MenuCard from "@/Components/MenuCard";
import ArticleCard from "@/Components/ArticleCard";
import { UtensilsCrossed, Clock, Users, Star } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

import { useBooking } from "@/Components/BookingContext";


const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { setBooking } = useBooking();

  // Embla carousel hook for Our Exclusive Food section
  const [exclusiveFoodRef, emblaExclusiveFood] = useEmblaCarousel({ 
    loop: false, 
    align: 'start',
    slidesToScroll: 1,
    containScroll: 'trimSnaps',
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 3 },
      '(min-width: 1024px)': { slidesToScroll: 3 }
    }
  });

  const scrollExclusiveFoodPrev = useCallback(() => {
    if (emblaExclusiveFood) {
      emblaExclusiveFood.scrollPrev();
      setCurrentSlide(prev => Math.max(0, prev - 1));
    }
  }, [emblaExclusiveFood]);

  const scrollExclusiveFoodNext = useCallback(() => {
    if (emblaExclusiveFood) {
      emblaExclusiveFood.scrollNext();
      setCurrentSlide(prev => Math.min(2, prev + 1));
    }
  }, [emblaExclusiveFood]);



  // Mock data - akan diganti dengan API Laravel
  const featuredMenus = [
    {
      id: 1,
      nama_menu: "Nasi Goreng Special",
      harga_menu: 45000,
      tersedia: true,
      kategori: "Makanan Utama",
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
      nama_menu: "Sate Ayam Madura",
      harga_menu: 50000,
      tersedia: true,
      kategori: "Makanan Utama",
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
      nama_menu: "Mie Goreng Seafood",
      harga_menu: 48000,
      tersedia: true,
      kategori: "Makanan Utama",
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
      nama_menu: "Es Teh Manis",
      harga_menu: 10000,
      tersedia: true,
      kategori: "Minuman",
      deskripsi: "Teh manis dingin yang menyegarkan, cocok menemani hidangan Anda.",
      bahan: ["Teh", "Gula", "Es batu"],
      rating: 4,
      review_count: 89,
      prep_time: 5,
      serving_size: 1,
      kalori: 120,
      level_pedas: "Tidak Pedas" as const,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 7,
      nama_menu: "Gado-Gado",
      harga_menu: 35000,
      tersedia: true,
      kategori: "Makanan Utama",
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
      id: 8,
      nama_menu: "Rendang Daging",
      harga_menu: 65000,
      tersedia: true,
      kategori: "Makanan Utama",
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

  const latestArticles = [
    {
      id: 1,
      judul: "Resep Rahasia Nasi Goreng Kami",
      topik: "Kuliner",
      isi: "Nasi goreng adalah salah satu hidangan favorit di Indonesia. Kami membagikan rahasia di balik kelezatan nasi goreng special kami yang sudah terkenal...",
      author: "Chef Ahmad",
      tanggal: "2024-01-15",
    },
    {
      id: 2,
      judul: "Tips Memilih Bahan Segar untuk Masakan",
      topik: "Tips",
      isi: "Kualitas bahan adalah kunci dari masakan yang lezat. Berikut adalah tips dari chef kami untuk memilih bahan-bahan segar berkualitas tinggi...",
      author: "Chef Sarah",
      tanggal: "2024-01-10",
    },
  ];

  const features = [
    {
      icon: UtensilsCrossed,
      title: "Menu Berkualitas",
      description: "Hidangan lezat dengan bahan pilihan terbaik",
    },
    {
      icon: Clock,
      title: "Pelayanan Cepat",
      description: "Pesanan Anda siap dalam waktu singkat",
    },
    {
      icon: Users,
      title: "Suasana Nyaman",
      description: "Tempat yang sempurna untuk keluarga dan teman",
    },
    {
      icon: Star,
      title: "Kualitas Terjamin",
      description: "Standar kebersihan dan rasa yang konsisten",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section (updated to match design) — moved to top */}
      <section className="relative h-[520px] flex items-center overflow-hidden mt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')` }} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 container mx-auto px-20">
          <div className="max-w-2x1 text-left text-white py-10">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">Fresh air,<br/>tasty bites.</h1>
            <p className="text-base md:text-lg mb-6 text-amber-90/100">Makan jadi lebih nikmat ketika ditemani suasana sejuk dan pemandangan indah.</p>

            <div className="flex flex-row items-center gap-4">
              <Button asChild className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2">
                <Link to="/menu">Discover Menu</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10" onClick={() => { setBooking({ name: '', phone: '', email: '', bookingDay: '', time: '', kategori_jumlah: 'Kecil', jumlah_orang: '', catatan: '' }); navigate('/reservasi'); }}>
                Reservasi Sekarang
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Hero (dark green) */}
      <section className="py-16 bg-green-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-shrink-0">
              <div className="w-80 h-80 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                  alt="Nasi Goreng" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Best sellers, people favorites!
              </h2>
              <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-2xl">
                Melarikan diri lagi sering banget nih dipikiran perasaan? buatan diding dan dididin sencha di cirebon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Exclusive Food (sliding cards) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div className="text-center flex-1">
              <p className="text-green-500 text-sm font-medium mb-2">Menu</p>
              <h2 className="text-3xl md:text-4xl font-bold text-green-800">Our Exclusive Food</h2>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={scrollExclusiveFoodPrev}
                disabled={currentSlide === 0}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-green-600 hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button 
                onClick={scrollExclusiveFoodNext}
                disabled={currentSlide >= 2}
                className="w-10 h-10 rounded-full border-2 border-green-600 bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
          
          {/* Carousel Container with Vertical Grid */}
          <div className="overflow-hidden" ref={exclusiveFoodRef as any}>
            <div className="flex">
              {/* Slide 1 */}
              <div className="min-w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredMenus.slice(0, 3).map((menu) => (
                    <div key={menu.id}>
                      <div className="bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img src={menu.image} alt={menu.nama_menu} className="w-full h-48 object-cover" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{menu.nama_menu}</h3>
                          <p className="text-gray-600 text-sm mb-4">{menu.deskripsi}</p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 border border-green-200 rounded-md px-3 py-1">
                              <span className="text-gray-800 font-medium">Rp {menu.harga_menu.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
                            onClick={() => {}}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slide 2 */}
              <div className="min-w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredMenus.slice(3, 6).map((menu) => (
                    <div key={menu.id}>
                      <div className="bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img src={menu.image} alt={menu.nama_menu} className="w-full h-48 object-cover" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{menu.nama_menu}</h3>
                          <p className="text-gray-600 text-sm mb-4">{menu.deskripsi}</p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 border border-green-200 rounded-md px-3 py-1">
                              <span className="text-gray-800 font-medium">Rp {menu.harga_menu.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
                            onClick={() => {}}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Slide 3 */}
              <div className="min-w-full flex-shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredMenus.slice(6, 8).map((menu) => (
                    <div key={menu.id}>
                      <div className="bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="relative">
                          <img src={menu.image} alt={menu.nama_menu} className="w-full h-48 object-cover" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-800 mb-2">{menu.nama_menu}</h3>
                          <p className="text-gray-600 text-sm mb-4">{menu.deskripsi}</p>
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-green-100 border border-green-200 rounded-md px-3 py-1">
                              <span className="text-gray-800 font-medium">Rp {menu.harga_menu.toLocaleString()}</span>
                            </div>
                          </div>
                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-md"
                            onClick={() => {}}
                          >
                            Order Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Empty space for last slide if needed */}
                  {featuredMenus.slice(6, 8).length < 3 && (
                    <div className="hidden lg:block"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (emblaExclusiveFood) {
                    emblaExclusiveFood.scrollTo(index);
                    setCurrentSlide(index);
                  }
                }}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Our Feature (light green) */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-800 text-sm font-medium mb-2">Our Feature</p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-800">Quality is Our First Priority</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-800 mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-green-800 mb-3">{feature.title}</h3>
                <p className="text-green-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      


      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-green-400 text-sm font-medium mb-2">The reasons</p>
            <h2 className="text-3xl md:text-4xl font-bold text-green-800">Why Choose Us?</h2>
          </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <div className="bg-gray-200 relative flex items-center justify-center" style={{ height: '600px' }}>
                  <iframe
                    src="https://www.instagram.com/p/DF0MxKHSzXN/embed/"
                    className="border-0"
                    allowTransparency={true}
                    frameBorder="0"
                    scrolling="no"
                    title="Instagram Video"
                    style={{ 
                      width: '100%', 
                      height: '100%',
                      maxHeight: '600px',
                      transform: 'scale(1)',
                      transformOrigin: 'center center'
                    }}
                  />
                  <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
              <p className="text-green-400 text-3x1 font-medium mb-2">Reservation</p>
              <h2 className="text-3xl md:text-10xl font-bold text-green-800 mb-8">
                Buat momen spesialmu lebih berkesan, reservation meja hari ini!
            </h2>
              <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg text-lg font-medium"
              onClick={() => { 
                setBooking({ 
                  name: '', 
                  phone: '', 
                  email: '', 
                  bookingDay: '', 
                  time: '', 
                  kategori_jumlah: 'Kecil', 
                  jumlah_orang: '', 
                  catatan: '' 
                }); 
                navigate('/reservasi'); 
              }}
            >
              Book
            </Button>
          </div>
        </div>
      </section>


      <Footer />

    </div>
  );
};

export default Index;
