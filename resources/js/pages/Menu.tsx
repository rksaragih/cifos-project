import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import MenuCard from "@/Components/MenuCard";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";

const Menu = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

    const fetchCategories = async () => {
        const response = await fetch("/api/categories");
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        return [{ id: 0, nama: "Semua" }, ...data];
    };

    const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const fetchMenus = async (categoryId: number | string = "Semua") => {
        let url = "/api/menus";
        if (categoryId !== "Semua" && typeof categoryId === "number") {
            url = `/api/menus/filter-by-category?category_id=${categoryId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch menus");
        }
        const data = await response.json();
        return data;
    };

    const fetchRecommendedMenus = async (
        categoryId: number | string = "Semua"
    ) => {
        let url = "/api/menus/recommended";
        if (categoryId !== "Semua" && typeof categoryId === "number") {
            url = `/api/menus/recommended-by-category?category_id=${categoryId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch recommended menus");
        }
        const data = await response.json();
        return data;
    };

    const fetchBestSellerMenus = async (
        categoryId: number | string = "Semua"
    ) => {
        let url = "/api/menus/best-seller";
        if (categoryId !== "Semua" && typeof categoryId === "number") {
            url = `/api/menus/best-seller-by-category?category_id=${categoryId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Failed to fetch best seller menus");
        }
        const data = await response.json();
        return data;
    };

    const selectedCategoryId = categories.find(
        (cat) => cat.nama === selectedCategory
    )?.id;

    const categoryIdForFetch =
        selectedCategory === "Semua" ? "Semua" : selectedCategoryId;

    const { data: menus = [], isLoading: isLoadingMenus } = useQuery({
        queryKey: ["menus", selectedCategoryId],
        queryFn: () => fetchMenus(categoryIdForFetch as number | "Semua"),
        enabled: !!categories.length, // Only fetch if categories are loaded
    });

    const {
        data: recommendedMenus = [],
        isLoading: isLoadingRecommendedMenus,
    } = useQuery({
        queryKey: ["recommendedMenus", selectedCategoryId],
        queryFn: () =>
            fetchRecommendedMenus(categoryIdForFetch as number | "Semua"),
        enabled: !!categories.length,
    });

    const { data: bestSellerMenus = [], isLoading: isLoadingBestSellerMenus } =
        useQuery({
            queryKey: ["bestSellerMenus", selectedCategoryId],
            queryFn: () =>
                fetchBestSellerMenus(categoryIdForFetch as number | "Semua"),
            enabled: !!categories.length,
        });

    useEffect(() => {
        const categoryIdParam = searchParams.get("category_id");
        if (categoryIdParam) {
            const category = categories.find(
                (cat) => cat.id === parseInt(categoryIdParam)
            );
            if (category) {
                setSelectedCategory(category.nama);
            } else {
                setSelectedCategory("Semua");
            }
        } else {
            setSelectedCategory("Semua");
        }
    }, [searchParams, categories]);

    // Embla carousel hooks for Recommended & Best sections
    const [recommendedRef, emblaRecommended] = useEmblaCarousel({
        loop: false,
        align: "start",
    });
    const [bestRef, emblaBest] = useEmblaCarousel({
        loop: false,
        align: "start",
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

    // Show filtered menus in All Product section when category is selected
    const INITIAL_DISPLAY_COUNT = 12;
    const [visibleCount, setVisibleCount] = useState<number>(
        INITIAL_DISPLAY_COUNT
    );

    useEffect(() => {
        // Reset visible count when category changes
        setVisibleCount(INITIAL_DISPLAY_COUNT);
    }, [selectedCategory]);

    const displayMenus =
        selectedCategory === "Semua" ? menus.slice(0, visibleCount) : menus;

    const hasMore = selectedCategory === "Semua" && menus.length > visibleCount;
    const isShowingAll =
        selectedCategory === "Semua" && menus.length <= visibleCount;

    const onLoadMore = () => {
        if (hasMore) {
            setVisibleCount((c) =>
                Math.min(menus.length, c + INITIAL_DISPLAY_COUNT)
            );
        } else {
            // Collapse back to initial
            setVisibleCount(INITIAL_DISPLAY_COUNT);
            // optional: scroll to top of all products
        }
    };

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
                                    variant={
                                        selectedCategory === category.nama
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => {
                                        setSelectedCategory(category.nama);
                                        navigate(
                                            `/menu?category_id=${category.id}`
                                        );
                                    }}
                                    className="rounded-full"
                                >
                                    {category.nama}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Recommended (carousel) */}
                    {recommendedMenus.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">
                                    Recommended
                                </h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={scrollRecommendedPrev}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={scrollRecommendedNext}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div
                                className="overflow-hidden"
                                ref={recommendedRef as any}
                            >
                                <div className="flex gap-5">
                                    {recommendedMenus.map((m: any) => (
                                        <div
                                            className="min-w-[260px] flex-shrink-0"
                                            key={m.id}
                                        >
                                            <MenuCard
                                                nama_menu={m.nama_menu}
                                                harga_menu={m.harga_menu}
                                                foto_menu={m.image}
                                                tersedia={m.tersedia}
                                                kategori={
                                                    m.kategori
                                                        ? m.kategori.nama
                                                        : ""
                                                }
                                                onClick={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Best Seller (carousel) */}
                    {bestSellerMenus.length > 0 && (
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">
                                    Best Seller
                                </h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={scrollBestPrev}
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={scrollBestNext}
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>

                            <div
                                className="overflow-hidden"
                                ref={bestRef as any}
                            >
                                <div className="flex gap-5">
                                    {bestSellerMenus.map((m: any) => (
                                        <div
                                            className="min-w-[260px] flex-shrink-0"
                                            key={m.id}
                                        >
                                            <MenuCard
                                                nama_menu={m.nama_menu}
                                                harga_menu={m.harga_menu}
                                                foto_menu={m.image}
                                                tersedia={m.tersedia}
                                                kategori={
                                                    m.kategori
                                                        ? m.kategori.nama
                                                        : ""
                                                }
                                                onClick={() => {}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Product */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {selectedCategory === "Semua"
                                ? "All Product"
                                : selectedCategory}
                        </h2>
                        {displayMenus.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {displayMenus.map((m: any) => (
                                    <MenuCard
                                        key={m.id}
                                        nama_menu={m.nama_menu}
                                        harga_menu={m.harga_menu}
                                        foto_menu={m.image}
                                        tersedia={m.tersedia}
                                        kategori={
                                            m.kategori ? m.kategori.nama : ""
                                        }
                                        onClick={() => {}}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">
                                    Tidak ada menu untuk kategori "
                                    {selectedCategory}"
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Silakan pilih kategori lain
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-8">
                        {menus.length > 0 && selectedCategory === "Semua" && (
                            <Button
                                variant="outline"
                                className="mx-auto"
                                onClick={onLoadMore}
                            >
                                {hasMore
                                    ? `Load more ${Math.max(
                                          100,
                                          menus.length
                                      )}+`
                                    : "Show less"}
                            </Button>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Menu;
