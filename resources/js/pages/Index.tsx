import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/Components/ui/button";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import useEmblaCarousel from "embla-carousel-react";
import { UtensilsCrossed, Clock, Users, Star } from "lucide-react";
import { useBooking } from "@/Components/BookingContext";
// If you prefer bundler-managed asset, put the image at `resources/js/assets/ciawi-food-station.jpg`
// and uncomment the import below. Using the bundler ensures cache-busting and optimization.
import ciawiFoodStation from "@/assets/ciawi-food-station.jpg";
import cifosBarbershop from "@/assets/cifos-barbershop.jpg";
import kopiTemanAkrab from "@/assets/kopi-teman-akrab.jpg";
import sizzleImg from "@/assets/sizzle.jpg";
import kopitiamImg from "@/assets/kopitiam.jpg";
import MenuCard from "@/Components/MenuCard";

const Index: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const navigate = useNavigate();
    const { setBooking } = useBooking();

    // Embla for Exclusive Food (one item per click)
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
    });

    useEffect(() => {
        const api = emblaApi;
        if (!api) return;
        const onSelect = () => setCurrentSlide(api.selectedScrollSnap());
        api.on("select", onSelect);
        onSelect();
        // also update prev/next availability
        const updateButtons = () => {
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        };
        api.on("select", updateButtons);
        updateButtons();
        return () => {
            if (api) {
                api.off("select", onSelect);
                api.off("select", updateButtons);
            }
        };
    }, [emblaApi]);

    // (removed Instagram embed script loader since we now use a local image)

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Mock data (kept small for demo)
    const featuredMenus = [
        {
            id: 1,
            nama_menu: "Nasi Goreng Special",
            harga_menu: 45000,
            deskripsi: "Nasi goreng dengan potongan ayam, udang, dan telur.",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80",
        },
        {
            id: 2,
            nama_menu: "Sate Ayam Madura",
            harga_menu: 50000,
            deskripsi: "Sate ayam khas Madura dengan bumbu kacang.",
            image: "https://images.unsplash.com/photo-1563379091339-03246963d96a?auto=format&fit=crop&w=1000&q=80",
        },
        {
            id: 3,
            nama_menu: "Mie Goreng Seafood",
            harga_menu: 48000,
            deskripsi: "Mie goreng dengan aneka seafood segar.",
            image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1000&q=80",
        },
        {
            id: 4,
            nama_menu: "Lumpia Semarang",
            harga_menu: 35000,
            deskripsi: "Lumpia khas Semarang dengan isian rebung dan udang.",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80",
        },
        {
            id: 5,
            nama_menu: "Tahu Isi",
            harga_menu: 25000,
            deskripsi: "Tahu isi goreng krispi.",
            image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1000&q=80",
        },
        {
            id: 6,
            nama_menu: "Es Teh Manis",
            harga_menu: 10000,
            deskripsi: "Teh manis dingin yang menyegarkan.",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1000&q=80",
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
        <div className="min-h-screen flex flex-col overflow-x-hidden">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[520px] flex items-center overflow-hidden mt-16">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80')`,
                    }}
                />
                <div className="absolute inset-0 bg-black/45" />
                <div className="relative z-10 container mx-auto px-6">
                    <div className="max-w-2xl text-left text-white py-10">
                        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4">
                            Fresh air,
                            <br />
                            tasty bites.
                        </h1>
                        <p className="text-base md:text-lg mb-6 text-amber-90/100">
                            Makan jadi lebih nikmat ketika ditemani suasana
                            sejuk dan pemandangan indah.
                        </p>

                        <div className="flex flex-row items-center gap-4">
                            <Button
                                asChild
                                className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2"
                            >
                                <Link to="/menu">Discover Menu</Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => {
                                    setBooking({
                                        name: "",
                                        phone: "",
                                        email: "",
                                        bookingDay: "",
                                        time: "",
                                        kategori_jumlah: "Kecil",
                                        jumlah_orang: "",
                                        catatan: "",
                                    });
                                    navigate("/reservasi");
                                }}
                            >
                                Reservasi Sekarang
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-16 bg-green-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-shrink-0">
                            <div className="w-80 h-80 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                                <img
                                    src="https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1000&q=80"
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
                                Pilihan menu populer dari chef kami.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Exclusive Food (sliding cards) */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="relative mb-8">
                        <div className="text-center">
                            <p className="text-green-500 text-xl md:text-2xl font-medium mb-1">
                                Menu
                            </p>
                            <h2 className="text-4xl md:text-6xl lg:text-4xl font-extrabold text-green-800">
                                Makanan Eksklusif Kami
                            </h2>
                        </div>

                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex gap-3">
                            <button
                                aria-label="Previous"
                                onClick={scrollPrev}
                                disabled={!canScrollPrev}
                                className="w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-green-600 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    className="w-4 h-4 text-gray-700"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <button
                                aria-label="Next"
                                onClick={scrollNext}
                                disabled={!canScrollNext}
                                className="w-8 h-8 rounded-full border-2 border-green-600 bg-white text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Embla root */}
                    <div
                        className="embla overflow-hidden"
                        ref={emblaRef as any}
                    >
                        <div className="flex gap-4">
                            {featuredMenus.map((menu) => (
                                <div
                                    key={menu.id}
                                    className="flex-shrink-0 min-w-full sm:min-w-[47%] md:min-w-[48%] lg:min-w-[31%]"
                                >
                                    <MenuCard
                                        nama_menu={menu.nama_menu}
                                        harga_menu={menu.harga_menu}
                                        foto_menu={menu.image}
                                        tersedia={true} // Assuming exclusive menus are always available
                                        onClick={() => {}}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {featuredMenus.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (emblaApi) {
                                        emblaApi.scrollTo(index);
                                        setCurrentSlide(index);
                                    }
                                }}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentSlide
                                        ? "bg-green-600"
                                        : "bg-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Feature */}
            <section className="py-16 bg-green-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-green-500 text-xl md:text-2xl font-medium mb-2">
                            Fitur kami
                        </p>
                        <h2 className="text-4xl md:text-6xl lg:text-4xl font-bold text-green-800">
                            Kualitas adalah Prioritas Utama Kami
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, idx) => (
                            <div key={idx} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-800 mb-4">
                                    <feature.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl md:text-2xl lg:text-2xl font-bold text-green-800 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-green-600 text-1xl md:text-1xl lg:text-1xl leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Us? (video/banner) */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <p className="text-green-500 text-xl md:text-2xl font-medium mb-2">
                            Alasan
                        </p>
                        <h2 className="text-4xl md:text-6xl lg:text-4xl font-bold text-green-800">
                            Mengapa Memilih Kami?
                        </h2>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg">
                            {/* Using bundler-managed asset (imported above) */}
                            <img
                                src={ciawiFoodStation}
                                alt="Ciawi Food Station"
                                className="w-full h-56 md:h-72 lg:h-96 object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Image strip - full width gallery above footer (matches provided example) */}
            <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
                    <img
                        src={cifosBarbershop}
                        alt="CIFOS Barbershop"
                        className="w-full h-28 md:h-36 lg:h-60 object-cover"
                    />
                    <img
                        src={kopiTemanAkrab}
                        alt="Kopi Teman Akrab"
                        className="w-full h-28 md:h-36 lg:h-60 object-cover"
                    />
                    <img
                        src={sizzleImg}
                        alt="Sizzle"
                        className="w-full h-28 md:h-36 lg:h-60 object-cover"
                    />
                    <img
                        src={kopitiamImg}
                        alt="Kopitiam"
                        className="w-full h-28 md:h-36 lg:h-60 object-cover"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Index;
