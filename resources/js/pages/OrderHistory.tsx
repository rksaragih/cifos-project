import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/Components/contexts/Navbar";
import Footer from "@/Components/contexts/Footer";
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useOrderHistory, Order } from "@/Components/contexts/OrderHistoryContext";
import { Calendar, Clock, Package, CheckCircle, XCircle, AlertCircle, ChefHat } from "lucide-react";

const OrderHistory = () => {
  const { orders, updateOrderStatus } = useOrderHistory();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <Package className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Menunggu Konfirmasi';
      case 'preparing': return 'Sedang Disiapkan';
      case 'ready': return 'Siap Diambil';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedOrder(order)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {formatDate(order.orderDate)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total Item:</span>
            <span className="font-medium">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span className="font-medium">{formatCurrency(order.total)}</span>
          </div>
          {order.discount && order.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Diskon:</span>
              <span className="font-medium">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold border-t pt-2">
            <span>Total:</span>
            <span>{formatCurrency(order.finalTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const OrderDetailModal = ({ order }: { order: Order }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Pesanan {order.orderNumber}</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {formatDate(order.orderDate)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Item Pesanan</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.price)}</div>
                    <div className="text-sm text-muted-foreground">x{item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Ringkasan Pesanan</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>{formatCurrency(order.finalTotal)}</span>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          {order.customerInfo && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Informasi Pelanggan</h3>
              <div className="space-y-2 text-sm">
                <div><span className="font-medium">Nama:</span> {order.customerInfo.name}</div>
                <div><span className="font-medium">Telepon:</span> {order.customerInfo.phone}</div>
                <div><span className="font-medium">Email:</span> {order.customerInfo.email}</div>
              </div>
            </div>
          )}

          {/* Status Actions */}
          {order.status === 'pending' && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Aksi</h3>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  variant="destructive"
                >
                  Batalkan Pesanan
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const allOrders = orders;
  const activeOrders = orders.filter(order => !['completed', 'cancelled'].includes(order.status));
  const completedOrders = orders.filter(order => order.status === 'completed');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Riwayat Pesanan</h1>
            <p className="text-muted-foreground">Lihat dan kelola pesanan Anda</p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum ada pesanan</h3>
              <p className="text-muted-foreground mb-6">Mulai pesan makanan favorit Anda</p>
              <Button asChild>
                <Link to="/booking/menu">Lihat Menu</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">Semua ({allOrders.length})</TabsTrigger>
                <TabsTrigger value="active">Aktif ({activeOrders.length})</TabsTrigger>
                <TabsTrigger value="completed">Selesai ({completedOrders.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {allOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </TabsContent>
              
              <TabsContent value="active" className="mt-6">
                {activeOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada pesanan aktif</p>
                  </div>
                ) : (
                  activeOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="mt-6">
                {completedOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Belum ada pesanan yang selesai</p>
                  </div>
                ) : (
                  completedOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Footer />

      {selectedOrder && <OrderDetailModal order={selectedOrder} />}
    </div>
  );
};

export default OrderHistory;




