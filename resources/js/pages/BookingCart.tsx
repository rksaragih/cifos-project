import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/Components/contexts/Navbar";
import Footer from "@/Components/contexts/Footer";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { useCart } from "@/Components/contexts/CartContext";
import { useOrderHistory } from "@/Components/contexts/OrderHistoryContext";
import { Minus, Plus, Heart, X, ArrowLeft, Check, History } from "lucide-react";

const BookingCart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, toggleFavorite, getTotal, getCartForOrder, clearCart } = useCart();
  const { orders, addOrder } = useOrderHistory();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "HAPPY") {
      setDiscount(0.1);
      setAppliedPromo("HAPPY");
    }
  };

  const subtotal = getTotal();
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const handleCheckout = () => {
    // Create order from cart items
    const cartItems = getCartForOrder();
    const subtotal = getTotal();
    const discountAmount = subtotal * discount;
    const finalTotal = subtotal - discountAmount;

    // Add order to order history with pending status
    const newOrder = addOrder({
      items: cartItems,
      total: subtotal,
      discount: discountAmount,
      finalTotal: finalTotal,
      status: 'pending'
    });

    // Clear the cart
    clearCart();

    // Navigate to success page
    navigate('/booking/success');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold mb-6">Cart & Order History</h1>

          <Tabs defaultValue="cart" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                </svg>
                Cart ({items.length})
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="w-4 h-4" />
                Order History ({orders.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cart" className="mt-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button asChild>
                    <Link to="/booking/menu">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cart Table */}
                  <div className="bg-muted/30 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-12 gap-4 font-semibold mb-4 pb-2 border-b">
                      <div className="col-span-5">Item</div>
                      <div className="col-span-2 text-center">Price</div>
                      <div className="col-span-2 text-center">Quantity</div>
                      <div className="col-span-2 text-center">Total Price</div>
                      <div className="col-span-1"></div>
                    </div>

                    {items.map(item => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b last:border-0">
                        <div className="col-span-5 flex items-center gap-3">
                          <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center text-white flex-shrink-0">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="col-span-2 text-center">${item.price}</div>
                        <div className="col-span-2">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="col-span-2 text-center font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="col-span-1 flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleFavorite(item.id)}
                            className={item.isFavorite ? "text-destructive" : ""}
                          >
                            <Heart className={`w-5 h-5 ${item.isFavorite ? "fill-current" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <X className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Promo and Checkout */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex gap-2 flex-1 max-w-md">
                      <span className="text-sm font-medium py-2">Promocode</span>
                      <div className="relative flex-1">
                        <Input
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="pr-10"
                        />
                        {appliedPromo && (
                          <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                        )}
                      </div>
                      <Button 
                        onClick={applyPromoCode}
                        variant="outline"
                      >
                        Apply
                      </Button>
                    </div>
                    {appliedPromo && (
                      <p className="text-sm text-secondary">Congrats! You have 10% discount</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild>
                      <Link to="/booking/menu">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to shopping
                      </Link>
                    </Button>
                    <div className="flex items-center gap-6">
                      {discount > 0 && (
                        <span className="text-sm">Discount: <span className="font-semibold">${discountAmount.toFixed(2)}</span></span>
                      )}
                      <span className="text-lg">Total Price: <span className="font-bold text-2xl">${total.toFixed(2)}</span></span>
                      <Button 
                        className="bg-secondary hover:bg-secondary/90 text-white px-8"
                        onClick={handleCheckout}
                      >
                        Check out
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              {orders.length === 0 ? (
                <div className="text-center py-16">
                  <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No order history</h3>
                  <p className="text-muted-foreground mb-6">Your completed orders will appear here</p>
                  <Button asChild>
                    <Link to="/booking/menu">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{order.orderNumber}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'completed' ? 'Completed' :
                           order.status === 'pending' ? 'Pending' :
                           order.status === 'preparing' ? 'Preparing' :
                           order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(order.orderDate).toLocaleDateString('id-ID')}</span>
                        <span className="font-medium">${order.finalTotal.toFixed(2)}</span>
                      </div>
                      <div className="mt-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to="/order-history">View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {orders.length > 5 && (
                    <div className="text-center">
                      <Button variant="outline" asChild>
                        <Link to="/order-history">View All Orders</Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingCart;
