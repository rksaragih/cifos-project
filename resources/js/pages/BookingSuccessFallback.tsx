import { Link } from "react-router-dom";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Button } from "@/Components/ui/button";
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";

const BookingSuccessFallback = () => {
  const [orderNumber, setOrderNumber] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Generate order number immediately
    const generatedOrderNumber = `#${Date.now().toString().slice(-6)}`;
    setOrderNumber(generatedOrderNumber);
    
    // Set loading to false after a short delay to show the success page
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 pt-20 pb-12 flex items-center justify-center">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="w-32 h-32 border-4 border-gray-200 rounded-lg flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-600">Processing your order...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-12 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-green-500 rounded-lg flex items-center justify-center bg-green-50">
                <Check className="w-16 h-16 text-green-600" strokeWidth={3} />
              </div>
            </div>
          </div>

          <p className="text-sm text-green-600 uppercase tracking-wider mb-2 font-semibold">
            ORDER SUCCESSFUL
          </p>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Thank you for your order!
          </h1>

          <p className="text-xl mb-2 text-gray-700">
            Order number is: <span className="font-bold text-green-600">{orderNumber}</span>
          </p>
          
          <p className="text-gray-600 mb-8">
            You can track your order in "Cart" section
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              <Link to="/booking/cart">View Cart</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingSuccessFallback;







