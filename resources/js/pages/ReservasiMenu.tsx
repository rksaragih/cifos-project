import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card } from '@/Components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Search, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';

interface Category {
  id: number;
  nama: string;
}

interface Menu {
  id: number;
  nama_menu: string;
  harga_menu: number;
  foto_menu: string;
  tersedia: boolean;
  kategori_id: number;
  rekomendasi?: boolean;
  best_seller?: boolean;
  category?: {
    id: number;
    nama: string;
  };
}

interface SelectedMenu {
  menu_id: number;
  nama_menu: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

// Component MenuCard untuk konsistensi ukuran
const MenuCard = ({ 
  menu, 
  getQuantity, 
  handleQuantityChange 
}: { 
  menu: Menu; 
  getQuantity: (id: number) => number; 
  handleQuantityChange: (menu: Menu, qty: number) => void;
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
    {/* Image - Fixed Height */}
    {menu.foto_menu && (
      <div className="relative h-48 w-full overflow-hidden flex-shrink-0">
        <img
          src={menu.foto_menu}
          alt={menu.nama_menu}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder-menu.jpg';
          }}
        />
        {getQuantity(menu.id) > 0 && (
          <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            {getQuantity(menu.id)}x
          </div>
        )}
      </div>
    )}

    {/* Content - Flex Grow */}
    <div className="p-4 flex flex-col flex-grow">
      {/* Text Content with Fixed Height */}
      <div className="mb-4 flex-grow">
        <h3 className="font-bold text-lg mb-1 line-clamp-2 min-h-[3.5rem]">
          {menu.nama_menu}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">
          {menu.category?.nama || 'Uncategorized'}
        </p>
        <p className="text-xl font-semibold text-primary">
          Rp {menu.harga_menu.toLocaleString('id-ID')}
        </p>
      </div>

      {/* Quantity Controls - Fixed at Bottom */}
      <div className="flex items-center gap-2 mt-auto">
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleQuantityChange(menu, Math.max(0, getQuantity(menu.id) - 1))}
          disabled={getQuantity(menu.id) === 0}
          className="h-9 w-9 flex-shrink-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="flex-1 text-center font-semibold text-lg">
          {getQuantity(menu.id)}
        </span>
        <Button
          size="icon"
          variant="default"
          onClick={() => handleQuantityChange(menu, getQuantity(menu.id) + 1)}
          className="h-9 w-9 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  </Card>
);

const ReservasiMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMenus, setSelectedMenus] = useState<SelectedMenu[]>([]);
  const [reservationData, setReservationData] = useState<any>(null);

  // Embla carousels
  const [recommendedRef, emblaRecommended] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });
  const [bestRef, emblaBest] = useEmblaCarousel({
    loop: false,
    align: 'start',
  });

  const scrollRecommendedPrev = useCallback(
    () => emblaRecommended && emblaRecommended.scrollPrev(),
    [emblaRecommended]
  );
  const scrollRecommendedNext = useCallback(
    () => emblaRecommended && emblaRecommended.scrollNext(),
    [emblaRecommended]
  );
  const scrollBestPrev = useCallback(
    () => emblaBest && emblaBest.scrollPrev(),
    [emblaBest]
  );
  const scrollBestNext = useCallback(
    () => emblaBest && emblaBest.scrollNext(),
    [emblaBest]
  );

  // Fetch functions
  const fetchCategories = async () => {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return [{ id: 0, nama: 'Semua' }, ...data];
  };

  const fetchMenus = async (categoryId: number | string = 'Semua') => {
    let url = '/api/menus';
    if (categoryId !== 'Semua' && typeof categoryId === 'number') {
      url = `/api/menus/filter-by-category?category_id=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch menus');
    return response.json();
  };

  const fetchRecommendedMenus = async (categoryId: number | string = 'Semua') => {
    let url = '/api/menus/recommended';
    if (categoryId !== 'Semua' && typeof categoryId === 'number') {
      url = `/api/menus/recommended-by-category?category_id=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch recommended menus');
    return response.json();
  };

  const fetchBestSellerMenus = async (categoryId: number | string = 'Semua') => {
    let url = '/api/menus/best-seller';
    if (categoryId !== 'Semua' && typeof categoryId === 'number') {
      url = `/api/menus/best-seller-by-category?category_id=${categoryId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch best seller menus');
    return response.json();
  };

  const fetchSearchResults = async (query: string) => {
    if (!query) return [];
    const response = await fetch(`/api/menus/search?name=${query}`);
    if (!response.ok) throw new Error('Failed to fetch search results');
    return response.json();
  };

  // Queries
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const selectedCategoryId = categories.find((cat) => cat.nama === selectedCategory)?.id;
  const categoryIdForFetch = selectedCategory === 'Semua' ? 'Semua' : selectedCategoryId;

  const { data: menus = [], isLoading: isLoadingMenus } = useQuery({
    queryKey: ['menus', selectedCategoryId],
    queryFn: () => fetchMenus(categoryIdForFetch as number | 'Semua'),
    enabled: !!categories.length && !searchQuery,
  });

  const { data: recommendedMenus = [] } = useQuery({
    queryKey: ['recommendedMenus', selectedCategoryId],
    queryFn: () => fetchRecommendedMenus(categoryIdForFetch as number | 'Semua'),
    enabled: !!categories.length && !searchQuery,
  });

  const { data: bestSellerMenus = [] } = useQuery({
    queryKey: ['bestSellerMenus', selectedCategoryId],
    queryFn: () => fetchBestSellerMenus(categoryIdForFetch as number | 'Semua'),
    enabled: !!categories.length && !searchQuery,
  });

  const { data: searchResults = [] } = useQuery({
    queryKey: ['searchResults', searchQuery],
    queryFn: () => fetchSearchResults(searchQuery),
    enabled: !!searchQuery,
  });

  // Effects
  useEffect(() => {
    const data = localStorage.getItem('reservation_data');
    if (!data) {
      toast({
        title: 'Error',
        description: 'Data reservasi tidak ditemukan. Silakan isi form terlebih dahulu.',
        variant: 'destructive',
      });
      navigate('/reservasi');
      return;
    }
    setReservationData(JSON.parse(data));
  }, [navigate, toast]);

  useEffect(() => {
    const categoryIdParam = searchParams.get('category_id');
    if (categoryIdParam) {
      const category = categories.find((cat) => cat.id === parseInt(categoryIdParam));
      if (category) {
        setSelectedCategory(category.nama);
      } else {
        setSelectedCategory('Semua');
      }
    } else {
      setSelectedCategory('Semua');
    }
  }, [searchParams, categories]);

  // Handlers
  const displayMenus = searchQuery ? searchResults : menus;

  const getQuantity = (menuId: number) => {
    const menu = selectedMenus.find((m) => m.menu_id === menuId);
    return menu ? menu.jumlah : 0;
  };

  const handleQuantityChange = (menu: Menu, newQuantity: number) => {
    if (newQuantity === 0) {
      setSelectedMenus((prev) => prev.filter((m) => m.menu_id !== menu.id));
    } else {
      const existingIndex = selectedMenus.findIndex((m) => m.menu_id === menu.id);
      const subtotal = menu.harga_menu * newQuantity;

      if (existingIndex >= 0) {
        const updated = [...selectedMenus];
        updated[existingIndex] = {
          menu_id: menu.id,
          nama_menu: menu.nama_menu,
          jumlah: newQuantity,
          harga: menu.harga_menu,
          subtotal,
        };
        setSelectedMenus(updated);
      } else {
        setSelectedMenus((prev) => [
          ...prev,
          {
            menu_id: menu.id,
            nama_menu: menu.nama_menu,
            jumlah: newQuantity,
            harga: menu.harga_menu,
            subtotal,
          },
        ]);
      }
    }
  };

  const handleContinue = () => {
    if (!reservationData) return;

    if (reservationData.kategori_jumlah === '>10' && selectedMenus.length === 0) {
      toast({
        title: 'Menu Wajib',
        description: 'Untuk reservasi lebih dari 10 orang, wajib memilih minimal 1 menu',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('reservation_menus', JSON.stringify(selectedMenus));
    navigate('/reservasi/review');
  };

  const handleSkip = () => {
    if (reservationData?.kategori_jumlah === '>10') {
      toast({
        title: 'Tidak Bisa Dilewati',
        description: 'Untuk reservasi >10 orang, menu wajib dipilih',
        variant: 'destructive',
      });
      return;
    }

    localStorage.setItem('reservation_menus', JSON.stringify([]));
    navigate('/reservasi/review');
  };

  const totalMenuPrice = selectedMenus.reduce((sum, m) => sum + m.subtotal, 0);
  const isRequired = reservationData?.kategori_jumlah === '>10';

  if (isLoadingCategories || isLoadingMenus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Pilih Menu untuk Reservasi</h1>
            <p className="text-gray-600">
              {isRequired
                ? '⚠️ Pilih minimal 1 menu (wajib untuk reservasi >10 orang)'
                : '📋 Pilih menu yang ingin dipesan (opsional)'}
            </p>
          </div>

          {/* Category Filter and Search Bar */}
          <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-8 gap-3">
            <div className="flex overflow-x-auto whitespace-nowrap py-2 gap-3 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.nama ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCategory(category.nama);
                    setSearchQuery('');
                    navigate(`/reservasi/menu?category_id=${category.id}`);
                  }}
                  className="rounded-full"
                >
                  {category.nama}
                </Button>
              ))}
            </div>
            <div className="w-full md:max-w-xs mb-4 md:mb-0 relative">
              <Input
                type="text"
                placeholder="Search menu..."
                className="rounded-full pl-10 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Recommended Carousel */}
          {!searchQuery && recommendedMenus.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recommended</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={scrollRecommendedPrev}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={scrollRecommendedNext}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden" ref={recommendedRef as any}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendedMenus.map((menu: Menu) => (
                    <div className="min-w-[260px] flex-shrink-0" key={menu.id}>
                      <MenuCard 
                        menu={menu} 
                        getQuantity={getQuantity} 
                        handleQuantityChange={handleQuantityChange} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Best Seller Carousel */}
          {!searchQuery && bestSellerMenus.length > 0 && ( 
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Best Seller</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={scrollBestPrev}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={scrollBestNext}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="overflow-hidden" ref={bestRef as any}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {bestSellerMenus.map((menu: Menu) => (
                    <div className="min-w-[260px] flex-shrink-0" key={menu.id}>
                      <MenuCard 
                        menu={menu} 
                        getQuantity={getQuantity} 
                        handleQuantityChange={handleQuantityChange} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* All Product / Search Results */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : selectedCategory === 'Semua'
                ? 'All Product'
                : selectedCategory}
            </h2>
            {displayMenus.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayMenus
                  .filter((m: Menu) => m.tersedia)
                  .map((menu: Menu) => (
                    <MenuCard 
                      key={menu.id}
                      menu={menu} 
                      getQuantity={getQuantity} 
                      handleQuantityChange={handleQuantityChange} 
                    />
                  ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchQuery
                    ? `Tidak ada menu ditemukan untuk "${searchQuery}"`
                    : `Tidak ada menu untuk kategori "${selectedCategory}"`}
                </p>
              </div>
            )}
          </div>

          {/* Floating Summary Card */}
          {selectedMenus.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
              <div className="container mx-auto max-w-6xl">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-bold text-lg">{selectedMenus.length} menu dipilih</p>
                      <p className="text-sm text-gray-600">
                        Total: Rp {totalMenuPrice.toLocaleString('id-ID')} (dibayar di tempat)
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleContinue} size="lg" className="px-8">
                    Lanjut Review
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons (when no menu selected) */}
          {selectedMenus.length === 0 && (
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              {!isRequired && (
                <Button variant="outline" onClick={handleSkip} className="flex-1">
                  Lewati Pemilihan Menu
                </Button>
              )}
              <Button onClick={handleContinue} className="flex-1" disabled={isRequired}>
                Lanjut ke Review
              </Button>
            </div>
          )}

          {/* Add bottom padding when floating card is visible */}
          {selectedMenus.length > 0 && <div className="h-24"></div>}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReservasiMenu;