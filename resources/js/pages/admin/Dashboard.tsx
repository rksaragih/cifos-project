import React from "react";
import { Card } from "@/Components/ui/card";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const fetchMenuCount = async () => {
  const response = await axios.get("/api/menus/count");
  return response.data.total_menus;
};

const fetchArticleCount = async () => {
  const response = await axios.get("/api/articles/count");
  return response.data.total_articles;
};

const Dashboard = () => {
  // gunakan React Query hooks untuk setiap data
  const {
    data: totalMenus,
    isLoading: loadingMenus,
    isError: errorMenus,
  } = useQuery({
    queryKey: ["menuCount"],
    queryFn: fetchMenuCount,
    refetchInterval: 15000, // auto refresh setiap 15 detik
  });

  const {
    data: totalArticles,
    isLoading: loadingArticles,
    isError: errorArticles,
  } = useQuery({
    queryKey: ["articleCount"],
    queryFn: fetchArticleCount,
    refetchInterval: 15000, // auto refresh setiap 15 detik
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Reservasi</div>
          <div className="text-2xl font-bold mt-2">--</div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Jumlah Menu</div>
          <div className="text-2xl font-bold mt-2">
            {loadingMenus
              ? "Loading..."
              : errorMenus
              ? "Error"
              : totalMenus ?? "--"}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Jumlah Artikel</div>
          <div className="text-2xl font-bold mt-2">
            {loadingArticles
              ? "Loading..."
              : errorArticles
              ? "Error"
              : totalArticles ?? "--"}
          </div>
        </Card>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <h2 className="font-semibold mb-4">
          Recent reservations (placeholder)
        </h2>
        <p className="text-sm text-muted-foreground">
          This area will show recent reservations and quick actions.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
