import React, { useState, useEffect } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ArticleCard from "@/Components/ArticleCard";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Search } from "lucide-react";

const Artikel = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("Semua");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [topics, setTopics] = useState(["Semua"]);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            let apiUrl = "/api/articles";

            // Apply search and filter only if they are active
            if (searchQuery) {
                params.append("title", searchQuery);
                apiUrl = "/api/articles/search";
            }
            if (selectedTopic !== "Semua") {
                params.append("topic", selectedTopic);
                apiUrl = "/api/articles/search";
            }

            const url = `${apiUrl}${
                params.toString() ? `?${params.toString()}` : ""
            }`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setArticles(data.data || data); // Adjust based on API response structure
        } catch (error) {
            console.error("Error fetching articles:", error);
            setArticles([]); // Clear articles on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(); // Initial fetch when component mounts

        const intervalId = setInterval(fetchArticles, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [searchQuery, selectedTopic]); // Re-run effect if search query or selected topic changes

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Header */}
            <section className="pt-20 pb-2">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8"></div>
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
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
                    </div>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-12 flex-1">
                <div className="container mx-auto px-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground text-lg">
                                Loading articles...
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <ArticleCard key={article.id} {...article} />
                            ))}
                        </div>
                    )}
                    {!loading && articles.length === 0 && (
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
