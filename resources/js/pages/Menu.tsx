import React, { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import MenuCard from "@/Components/MenuCard";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";

const Menu = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
    const [searchQuery, setSearchQuery] = useState<string>("");

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

    const fetchSearchResults = async (query: string) => {
        if (!query) return [];
        const response = await fetch(`/api/menus/search?name=${query}`);
        if (!response.ok) {
            throw new Error("Failed to fetch search results");
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
        enabled: !!categories.length && !searchQuery, // Only fetch if categories are loaded and no search query
    });

    const {
        data: recommendedMenus = [],
        isLoading: isLoadingRecommendedMenus,
    } = useQuery({
        queryKey: ["recommendedMenus", selectedCategoryId],
        queryFn: () =>
            fetchRecommendedMenus(categoryIdForFetch as number | "Semua"),
        enabled: !!categories.length && !searchQuery,
    });

    const { data: bestSellerMenus = [], isLoading: isLoadingBestSellerMenus } =
        useQuery({
            queryKey: ["bestSellerMenus", selectedCategoryId],
            queryFn: () =>
                fetchBestSellerMenus(categoryIdForFetch as number | "Semua"),
            enabled: !!categories.length && !searchQuery,
        });

    const { data: searchResults = [], isLoading: isLoadingSearchResults } =
        useQuery({
            queryKey: ["searchResults", searchQuery],
            queryFn: () => fetchSearchResults(searchQuery),
            enabled: !!searchQuery, // Only fetch if there's a search query
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

    const displayMenus = searchQuery
        ? searchResults
        : selectedCategory === "Semua"
        ? menus.slice(0, visibleCount)
        : menus;

    const showLoadMoreButton =
        !searchQuery &&
        selectedCategory === "Semua" &&
        menus.length > INITIAL_DISPLAY_COUNT &&
        visibleCount < menus.length;

    const onLoadMore = () => {
        setVisibleCount(menus.length);
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

                    {/* Category Filter and Search Bar */}
                    <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between mb-8 gap-3">
                        <div className="flex overflow-x-auto whitespace-nowrap py-2 gap-3 scrollbar-hide">
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
                                        setSearchQuery(""); // Clear search when category changes
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

                    {/* Recommended (carousel) */}
                    {!searchQuery && recommendedMenus.length > 0 && (
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
                                <div className="flex gap-4">
                                    {recommendedMenus.map((m: any) => (
                                        <div
                                            className="min-w-[260px] flex-shrink-0"
                                            key={m.id}
                                        >
                                            <MenuCard
                                                nama_menu={m.nama_menu}
                                                harga_menu={m.harga_menu}
                                                foto_menu={m.foto_menu}
                                                tersedia={m.tersedia}
                                                kategori={
                                                    m.category
                                                        ? m.category.nama
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
                    {!searchQuery && bestSellerMenus.length > 0 && (
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
                                <div className="flex gap-4">
                                    {bestSellerMenus.map((m: any) => (
                                        <div
                                            className="min-w-[260px] flex-shrink-0"
                                            key={m.id}
                                        >
                                            <MenuCard
                                                nama_menu={m.nama_menu}
                                                harga_menu={m.harga_menu}
                                                foto_menu={m.foto_menu}
                                                tersedia={m.tersedia}
                                                kategori={
                                                    m.category
                                                        ? m.category.nama
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

                    {/* All Product / Search Results */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-6">
                            {searchQuery
                                ? `Search Results for "${searchQuery}"`
                                : selectedCategory === "Semua"
                                ? "All Product"
                                : selectedCategory}
                        </h2>
                        {displayMenus.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {displayMenus.map((m: any) => (
                                    <MenuCard
                                        key={m.id}
                                        nama_menu={m.nama_menu}
                                        harga_menu={m.harga_menu}
                                        foto_menu={m.foto_menu}
                                        tersedia={m.tersedia}
                                        kategori={
                                            m.category ? m.category.nama : ""
                                        }
                                        onClick={() => {}}
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
                                <p className="text-gray-400 text-sm mt-2">
                                    {searchQuery
                                        ? "Coba kata kunci lain"
                                        : "Silakan pilih kategori lain"}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="text-center mt-8">
                        {showLoadMoreButton && (
                            <Button
                                variant="outline"
                                className="mx-auto"
                                onClick={onLoadMore}
                            >
                                Load more
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
