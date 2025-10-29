import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/Components/contexts/Navbar";
import Footer from "@/Components/contexts/Footer";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import MenuCard from "@/Components/contexts/MenuCard";
import { useToast } from "@/Components/hooks/use-toast";
import { useBooking } from "@/Components/contexts/BookingContext";
import useEmblaCarousel from 'embla-carousel-react';

const BookingMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { booking, clearBooking } = useBooking();
  const [menuQuantities, setMenuQuantities] = useState<Record<number, number>>({});
  
  const categories = [
    { id: "recommended", name: "Recommended" },
    { id: "bestseller", name: "Best Seller" },
    { id: "allproduct", name: "All Product" }
  ];

  const menuItems = [
    {
      id: 1,
      nama_menu: "Nasi Goreng Special",
      harga_menu: 45000,
      tersedia: true,
      deskripsi: "Nasi goreng dengan potongan ayam, udang, dan telur yang dimasak dengan bumbu rempah pilihan.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 2,
      nama_menu: "Sate Ayam Madura",
      harga_menu: 50000,
      tersedia: true,
      deskripsi: "Sate ayam khas Madura dengan bumbu kacang yang gurih dan lontong hangat.",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 3,
      nama_menu: "Mie Goreng Seafood",
      harga_menu: 48000,
      tersedia: true,
      deskripsi: "Mie goreng dengan aneka seafood segar seperti udang, cumi, dan kerang.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 4,
      nama_menu: "Lumpia Semarang",
      harga_menu: 35000,
      tersedia: true,
      deskripsi: "Lumpia khas Semarang dengan isian rebung, udang, dan telur.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 5,
      nama_menu: "Tahu Isi",
      harga_menu: 25000,
      tersedia: true,
      deskripsi: "Tahu putih yang diisi dengan sayuran segar dan daging cincang, digoreng krispi.",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 6,
      nama_menu: "Es Teh Manis",
      harga_menu: 10000,
      tersedia: true,
      deskripsi: "Teh manis dingin yang menyegarkan, cocok menemani hidangan Anda.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 7,
      nama_menu: "Jus Alpukat",
      harga_menu: 18000,
      tersedia: true,
      deskripsi: "Jus alpukat segar dengan susu dan gula aren, creamy dan nikmat.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 8,
      nama_menu: "Es Krim Vanilla",
      harga_menu: 20000,
      tersedia: true,
      deskripsi: "Es krim vanilla premium dengan topping pilihan.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 9,
      nama_menu: "Gado-Gado",
      harga_menu: 35000,
      tersedia: true,
      deskripsi: "Salad sayuran segar dengan bumbu kacang yang gurih dan kerupuk.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 10,
      nama_menu: "Rendang Daging",
      harga_menu: 65000,
      tersedia: true,
      deskripsi: "Daging sapi yang dimasak dengan bumbu rempah khas Padang hingga empuk.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 11,
      nama_menu: "Ayam Bakar",
      harga_menu: 55000,
      tersedia: true,
      deskripsi: "Ayam bakar dengan bumbu kecap yang manis dan gurih.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 12,
      nama_menu: "Soto Ayam",
      harga_menu: 30000,
      tersedia: true,
      deskripsi: "Soto ayam dengan kuah bening dan bumbu rempah yang segar.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 13,
      nama_menu: "Nasi Uduk",
      harga_menu: 25000,
      tersedia: true,
      deskripsi: "Nasi uduk dengan lauk pauk lengkap dan sambal kacang.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 14,
      nama_menu: "Bakso Malang",
      harga_menu: 28000,
      tersedia: true,
      deskripsi: "Bakso dengan kuah kaldu yang gurih dan mie kuning.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 15,
      nama_menu: "Pecel Lele",
      harga_menu: 32000,
      tersedia: true,
      deskripsi: "Lele goreng dengan sambal terasi dan lalapan segar.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: 16,
      nama_menu: "Rawon",
      harga_menu: 40000,
      tersedia: true,
      deskripsi: "Rawon dengan daging sapi dan kuah hitam yang khas.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
    },
  ];

  const handleQuantityChange = (menuId: number, quantity: number) => {
    setMenuQuantities(prev => ({
      ...prev,
      [menuId]: quantity
    }));
    
    if (quantity > 0) {
      toast({
        title: "Quantity updated",
        description: `Quantity updated to ${quantity}`
      });
    }
  };

  const getTotalQuantity = () => {
    return Object.values(menuQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    return Object.entries(menuQuantities).reduce((sum, [menuId, qty]) => {
      const menu = menuItems.find(m => m.id === parseInt(menuId));
      return sum + (menu ? menu.harga_menu * qty : 0);
    }, 0);
  };

  const handleOrder = () => {
    // Prepare order data
    const orderData = {
      orderNumber: `#${Date.now().toString().slice(-6)}`,
      booking: booking,
      items: Object.entries(menuQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([menuId, qty]) => {
          const menu = menuItems.find(m => m.id === parseInt(menuId));
          return {
            id: menu?.id,
            nama_menu: menu?.nama_menu,
            harga_menu: menu?.harga_menu,
            quantity: qty,
            deskripsi: menu?.deskripsi,
            image: menu?.image
          };
        }),
      totalPrice: getTotalPrice(),
      totalQuantity: getTotalQuantity(),
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };

    // Save order to localStorage
    localStorage.setItem('bookingOrder', JSON.stringify(orderData));

    // Show success toast
    toast({
      title: "Pesanan berhasil!",
      description: `Pesanan Anda dengan nomor ${orderData.orderNumber} telah dikonfirmasi`
    });

    // Navigate to success page
    navigate('/booking/success');
  };

  const [visibleStart, setVisibleStart] = useState(0);
  const itemsPerView = 4;

  // Embla for horizontal carousels
  const [recomRef, emblaRecom] = useEmblaCarousel({ loop: false, align: 'start' });
  const [bestRef, emblaBest] = useEmblaCarousel({ loop: false, align: 'start' });

  const scrollRecomPrev = useCallback(() => emblaRecom && emblaRecom.scrollPrev(), [emblaRecom]);
  const scrollRecomNext = useCallback(() => emblaRecom && emblaRecom.scrollNext(), [emblaRecom]);
  const scrollBestPrev = useCallback(() => emblaBest && emblaBest.scrollPrev(), [emblaBest]);
  const scrollBestNext = useCallback(() => emblaBest && emblaBest.scrollNext(), [emblaBest]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Pick Your Menu</h1>
              <p className="text-gray-600 mt-2">
                Booking untuk: <span className="font-semibold">{booking.name}</span> • 
                {booking.bookingDay && ` ${booking.bookingDay}`} • 
                {booking.persons && ` ${booking.persons} orang`}
              </p>
            </div>
            {getTotalQuantity() > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold">{getTotalQuantity()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="text-2xl font-bold text-green-600">Rp {getTotalPrice().toLocaleString("id-ID")}</p>
                </div>
              </div>
            )}
          </div>

          {/* Recommended (carousel) */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={scrollRecomPrev}><ChevronLeft className="w-5 h-5" /></Button>
                <Button variant="outline" size="icon" onClick={scrollRecomNext}><ChevronRight className="w-5 h-5" /></Button>
              </div>
            </div>
            <div className="overflow-hidden" ref={recomRef as any}>
              <div className="flex gap-5">
                {menuItems.slice(0,8).map(item => (
                  <div className="min-w-[260px] flex-shrink-0" key={item.id}>
                    <MenuCard 
                      nama_menu={item.nama_menu} 
                      harga_menu={item.harga_menu} 
                      foto_menu={item.image} 
                      tersedia={item.tersedia} 
                      quantity={menuQuantities[item.id] || 0}
                      onQuantityChange={(qty) => handleQuantityChange(item.id, qty)} 
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
                <Button variant="outline" size="icon" onClick={scrollBestPrev}><ChevronLeft className="w-5 h-5" /></Button>
                <Button variant="outline" size="icon" onClick={scrollBestNext}><ChevronRight className="w-5 h-5" /></Button>
              </div>
            </div>
            <div className="overflow-hidden" ref={bestRef as any}>
              <div className="flex gap-5">
                {menuItems.slice(4,12).map(item => (
                  <div className="min-w-[260px] flex-shrink-0" key={item.id}>
                    <MenuCard 
                      nama_menu={item.nama_menu} 
                      harga_menu={item.harga_menu} 
                      foto_menu={item.image} 
                      tersedia={item.tersedia} 
                      quantity={menuQuantities[item.id] || 0}
                      onQuantityChange={(qty) => handleQuantityChange(item.id, qty)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Product */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">All Product</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {menuItems.map(item => (
                <MenuCard 
                  key={item.id} 
                  nama_menu={item.nama_menu} 
                  harga_menu={item.harga_menu} 
                  foto_menu={item.image} 
                  tersedia={item.tersedia} 
                  quantity={menuQuantities[item.id] || 0}
                  onQuantityChange={(qty) => handleQuantityChange(item.id, qty)} 
                />
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="mx-auto">Load more 100+</Button>
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating Order button when there are items selected */}
      {getTotalQuantity() > 0 && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            onClick={handleOrder} 
            className="bg-emerald-800 hover:bg-emerald-900 text-white rounded-full px-6 py-3 shadow-lg flex items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Pesan ({getTotalQuantity()})
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingMenu;
