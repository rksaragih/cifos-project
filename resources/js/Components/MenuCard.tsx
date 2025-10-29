import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Minus, Plus } from "lucide-react";

export interface MenuCardProps {
    nama_menu: string;
    harga_menu: number;
    foto_menu?: string;
    tersedia: boolean;
    kategori?: string;
    quantity?: number;
    onClick?: () => void;
    onQuantityChange?: (quantity: number) => void;
    rekomendasi?: boolean;
    best_seller?: boolean;
}

const MenuCard = ({
    nama_menu,
    harga_menu,
    foto_menu,
    tersedia,
    kategori,
    quantity = 0,
    onClick,
    onQuantityChange,
    rekomendasi,
    best_seller,
}: MenuCardProps) => {
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity < 0) return;
        onQuantityChange?.(newQuantity);
    };

    return (
        <Card
            className="rounded-lg border border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-transform duration-200"
            onClick={onClick}
        >
            <div className="relative">
                <div className="h-36 bg-[rgba(31,138,59,0.95)] flex items-center justify-center">
                    <img
                        src={
                            foto_menu ||
                            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80"
                        }
                        alt={nama_menu}
                        className="h-full w-full object-cover opacity-90"
                    />
                </div>
                {!tersedia && (
                    <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                        <Badge variant="destructive" className="text-sm">
                            Tidak Tersedia
                        </Badge>
                    </div>
                )}
                {kategori && (
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                        {kategori}
                    </Badge>
                )}
                {rekomendasi && (
                    <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                        Rekomendasi
                    </Badge>
                )}
                {best_seller && (
                    <Badge className="absolute bottom-3 left-3 bg-red-500 text-white">
                        Best Seller
                    </Badge>
                )}
            </div>

            <CardContent className="p-5 pb-6 relative bg-white">
                <h3 className="font-semibold text-sm mb-3 text-foreground">
                    {nama_menu}
                </h3>
                <div className="flex items-center justify-between">
                    <p className="text-primary font-bold text-lg">
                        Rp {harga_menu.toLocaleString("id-ID")}
                    </p>
                </div>

                {/* Quantity controls */}
                {tersedia && onQuantityChange && (
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(quantity - 1);
                            }}
                            disabled={quantity <= 0}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>

                        <span className="text-lg font-semibold min-w-[2rem] text-center">
                            {quantity}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleQuantityChange(quantity + 1);
                            }}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default MenuCard;
