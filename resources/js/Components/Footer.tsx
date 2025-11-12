import React from "react";
import { Link } from "react-router-dom";
import footerBg from "@/assets/ciawi-food-station.jpg";

const Footer = () => {
  return (
    <footer className="text-white bg-green-800">
      <div className="relative overflow-hidden">

        <div className="relative container mx-auto px-10 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-white">
            {/* Column 1: About Company + Opening Hours */}
            <div>
              <div className="mb-8">
                <h3 className="text-lg md:text-xl font-semibold mb-4">About Company</h3>
                <p className="text-sm text-white/90 leading-relaxed max-w-md">
                  CIFOS (Ciawi Food Station) adalah tempat makan di Ciawi, Bogor yang menghadirkan berbagai hidangan lezat dengan cita rasa khas dan suasana nyaman.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-4">Opening Hours</h3>
                <div className="text-sm text-white/90 space-y-1">
                  <p>Monday - Thursday : 10:00 AM - 21:00 PM</p>
                  <p>Friday - Sunday : 10:00 AM - 22:00 PM</p>
                </div>
              </div>
            </div>

            {/* Column 2: Useful Links */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Links</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
                <li><Link to="/reservasi" className="hover:text-white">Reservasi</Link></li>
                <li><Link to="/artikel" className="hover:text-white">Artikel</Link></li>
                <li><Link to="/tentang-kami" className="hover:text-white">Tentang Kami</Link></li>
                <li><Link to="/contact" className="hover:text-white">Kontak Kami</Link></li>
              </ul>
            </div>
            
            {/* Column 3: Contact Us */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Contact us</h3>
              <div className="text-sm text-white/90 space-y-2">
                <p>sweetdeli@gmail.com</p>
                <p>+62 877-4601-0838</p>
                <p className="leading-relaxed">
                  Puncak Rd No.477, Bendungan, Ciawi Bogor Regency, West Java 16720
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
