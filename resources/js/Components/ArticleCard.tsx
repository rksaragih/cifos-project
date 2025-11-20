import React from "react";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

interface ArticleCardProps {
  id: number;
  judul: string;
  topik: string;
  isi: string;
  foto?: string;
  author?: string;
  tanggal?: Date;
}

const ArticleCard = ({ id, judul, topik, isi, foto, author, tanggal }: ArticleCardProps) => {
  // Truncate content for preview
  const preview = isi.length > 150 ? isi.substring(0, 150) + "..." : isi;

  return (
    <Card className="overflow-hidden hover:shadow-elegant transition-all duration-300 group">
      <Link to={`/artikel/${id}`}>
        <div className="relative h-56 overflow-hidden">
          <img
            src={foto || "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=1000&q=80"}
            alt={judul}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <Badge className="absolute top-3 right-3 bg-secondary text-secondary-foreground">
            {topik}
          </Badge>
        </div>
        <CardContent className="p-5">
          <h3 className="font-bold text-xl mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {judul}
          </h3>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{author}</span>
              </div>
            )}
            {tanggal && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(tanggal).toLocaleDateString("id-ID")}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ArticleCard;
