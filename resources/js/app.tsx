import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// CSS
import '../css/app.css';

// Pages
import Index from './pages/Index';
import Menu from './pages/Menu';
import Artikel from './pages/Artikel';
import ArtikelDetail from './pages/ArtikelDetail';
import Contact from './pages/Contact';
import TentangKami from './pages/TentangKami';
import Reservasi from './pages/Reservasi';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import NotFound from './pages/NotFound';

// Context Providers
import { BookingProvider } from './Components/BookingContext';

// Komponen utama aplikasi
const App = () => {
  return (
    <BrowserRouter>
      <BookingProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/artikel/:id" element={<ArtikelDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/reservasi" element={<Reservasi />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BookingProvider>
    </BrowserRouter>
  );
};

// Mount React app
const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
