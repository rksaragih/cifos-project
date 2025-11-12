import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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
import SpecialMenuCard from "@/Components/SpecialMenuCard";

interface MenuItem {
    id: number;
    nama_menu: string;
    harga_menu: number;
    foto_menu: string;
    tersedia: boolean;
}

const Index: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const navigate = useNavigate();
    const { setBooking } = useBooking();

    const [specialityMenus, setSpecialityMenus] = useState<MenuItem[]>([]);
    const [loadingSpeciality, setLoadingSpeciality] = useState(true);
    const [errorSpeciality, setErrorSpeciality] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecialityMenus = async () => {
            try {
                const response = await axios.get("/api/menus/speciality");
                if (Array.isArray(response.data)) {
                    setSpecialityMenus(response.data);
                } else {
                    console.error(
                        "API returned non-array data for speciality menus:",
                        response.data
                    );
                    setErrorSpeciality("Invalid data format from API.");
                }
            } catch (error) {
                console.error("Error fetching speciality menus:", error);
                setErrorSpeciality("Failed to load speciality menus.");
            } finally {
                setLoadingSpeciality(false);
            }
        };

        fetchSpecialityMenus();
    }, []);

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

    const featuredMenus: MenuItem[] = specialityMenus;

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
                                Menu Eksklusif
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
                        {loadingSpeciality ? (
                            <p>Loading speciality menus...</p>
                        ) : errorSpeciality ? (
                            <p className="text-red-500">{errorSpeciality}</p>
                        ) : (
                            <div className="flex gap-2">
                                {Array.isArray(featuredMenus) &&
                                    featuredMenus.map((menu: MenuItem) => (
                                        <div
                                            key={menu.id}
                                            className="flex-shrink-0 min-w-full sm:min-w-[calc(50%-0.25rem)] md:min-w-[calc(50%-0.25rem)] lg:min-w-[calc(33.333%-0.33rem)]"
                                        >
                                            <SpecialMenuCard
                                                nama_menu={menu.nama_menu}
                                                harga_menu={menu.harga_menu}
                                                foto_menu={menu.foto_menu}
                                                tersedia={menu.tersedia} // Assuming exclusive menus are always available
                                                onClick={() => {}}
                                            />
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {Array.isArray(specialityMenus) &&
                            specialityMenus.map((_, index) => (
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
            <Footer />
        </div>
    );
};

export default Index;
