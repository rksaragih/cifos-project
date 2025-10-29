import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  CalendarCheck, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  TrendingUp,
  Package
} from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Menu",
      value: "48",
      icon: UtensilsCrossed,
      trend: "+12%",
      color: "text-blue-600"
    },
    {
      title: "Reservations",
      value: "124",
      icon: CalendarCheck,
      trend: "+8%",
      color: "text-green-600"
    },
    {
      title: "Articles",
      value: "32",
      icon: FileText,
      trend: "+5%",
      color: "text-purple-600"
    },
    {
      title: "Users",
      value: "1,234",
      icon: Users,
      trend: "+15%",
      color: "text-orange-600"
    }
  ];

  const quickActions = [
    {
      title: "Menu Management",
      description: "Add, edit, or remove menu items",
      icon: UtensilsCrossed,
      link: "/admin/menu",
      color: "bg-blue-500"
    },
    {
      title: "Reservations",
      description: "Manage table bookings",
      icon: CalendarCheck,
      link: "/admin/reservations",
      color: "bg-green-500"
    },
    {
      title: "Articles",
      description: "Create and publish content",
      icon: FileText,
      link: "/admin/articles",
      color: "bg-purple-500"
    },
    {
      title: "Orders",
      description: "Track customer orders",
      icon: Package,
      link: "/admin/orders",
      color: "bg-orange-500"
    },
    {
      title: "Analytics",
      description: "View performance reports",
      icon: BarChart3,
      link: "/admin/analytics",
      color: "bg-pink-500"
    },
    {
      title: "Settings",
      description: "Configure system settings",
      icon: Settings,
      link: "/admin/settings",
      color: "bg-gray-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
              <LayoutDashboard className="w-8 h-8" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your restaurant today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-elegant transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-secondary flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.trend}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Commonly used features for quick access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="block p-4 rounded-lg border border-border hover:border-primary hover:shadow-elegant transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${action.color} text-white`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">Order #12345{i}</p>
                        <p className="text-sm text-muted-foreground">2 items • $45.99</p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reservations</CardTitle>
                <CardDescription>Today's table bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">Table {i * 2}</p>
                        <p className="text-sm text-muted-foreground">18:00 • 4 people</p>
                      </div>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
