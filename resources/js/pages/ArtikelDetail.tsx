import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
// import menuPlaceholder from "@/assets/menu-placeholder.jpg";

const ArtikelDetail = () => {
    const { id } = useParams();

    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`/api/articles/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Article not found");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setArticle(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-lg text-muted-foreground">
                    Loading article...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-lg text-destructive">Error: {error}</p>
                {error === "Article not found" && (
                    <Button asChild className="mt-4">
                        <Link to="/artikel">Kembali ke Artikel</Link>
                    </Button>
                )}
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center">
                <p className="text-lg text-muted-foreground">
                    Article not found.
                </p>
                <Button asChild className="mt-4">
                    <Link to="/artikel">Kembali ke Artikel</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Back Button */}
            <section className="py-6 mt-16 border-b border-border">
                <div className="container mx-auto px-4">
                    <Button asChild variant="ghost" size="sm">
                        <Link to="/artikel">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Kembali ke Artikel
                        </Link>
                    </Button>
                </div>
            </section>

            {/* Article Content */}
            <article className="py-12 flex-1">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            {article.judul}
                        </h1>
                    </div>

                    {/* Featured Image */}
                    <div className="mb-8 rounded-lg overflow-hidden shadow-elegant">
                        <img
                            src={article.foto}
                            alt={article.judul}
                            className="w-full h-[400px] object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div 
                            className="article-content"
                            dangerouslySetInnerHTML={{ __html: article.isi }}
                        />
                    </div>

                </div>
            </article>

            <Footer />
        </div>
    );
};

export default ArtikelDetail;
