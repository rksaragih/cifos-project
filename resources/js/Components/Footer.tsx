import React from "react";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import cifosBarbershop from "@/assets/cifos-barbershop.jpg";
import kopiTemanAkrab from "@/assets/kopi-teman-akrab.jpg";
import kopitiam from "@/assets/kopitiam.jpg";
import sizzle from "@/assets/sizzle.jpg";

const Footer = () => {
  return (
    <>
      {/* Image Gallery Section */}
      <div className="w-full bg-green-900 py-0">
        <div className="mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            <div className="relative group h-36 sm:h-44 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
              <img
                src={cifosBarbershop}
                alt="CIFOS Barbershop"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-300" />
            </div>
            <div className="relative group h-36 sm:h-44 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
              <img
                src={kopiTemanAkrab}
                alt="Kopi Teman Akrab"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-300" />
            </div>
            <div className="relative group h-36 sm:h-44 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
              <img
                src={kopitiam}
                alt="Kopitiam"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-300" />
            </div>
            <div className="relative group h-36 sm:h-44 md:h-56 lg:h-60 xl:h-64 overflow-hidden">
              <img
                src={sizzle}
                alt="Sizzle"
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/35 opacity-0 transition-opacity duration-300" />
            </div>
          </div>
        </div>
      </div>


      {/* Footer */}
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
                  <p>Senin - Kamis : 10:00 - 21:00</p>
                  <p>Jumat - Minggu : 10:00 - 22:00</p>
                </div>
              </div>
            </div>

            {/* Column 2: Useful Links */}
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg md:text-xl font-semibold mb-4">Links</h3>
              <div className="w-full md:w-auto">
                {/* Mobile: 2 columns (3 left, 3 right) */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 justify-items-center md:hidden">
                  <ul className="space-y-2 text-sm text-white/90">
                    <li><Link to="/" className="hover:text-white">Home</Link></li>
                    <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
                    <li><Link to="/reservasi" className="hover:text-white">Reservasi</Link></li>
                  </ul>
                  <ul className="space-y-2 text-sm text-white/90">
                    <li><Link to="/artikel" className="hover:text-white">Artikel</Link></li>
                    <li><Link to="/tentang-kami" className="hover:text-white">Tentang Kami</Link></li>
                    <li><Link to="/contact" className="hover:text-white">Kontak Kami</Link></li>
                  </ul>
                </div>
                {/* Desktop: single column */}
                <ul className="hidden md:block space-y-2 text-sm text-white/90">
                  <li><Link to="/" className="hover:text-white">Home</Link></li>
                  <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
                  <li><Link to="/reservasi" className="hover:text-white">Reservasi</Link></li>
                  <li><Link to="/artikel" className="hover:text-white">Artikel</Link></li>
                  <li><Link to="/tentang-kami" className="hover:text-white">Tentang Kami</Link></li>
                  <li><Link to="/contact" className="hover:text-white">Kontak Kami</Link></li>
                </ul>
              </div>
            </div>
            
            {/* Column 3: Contact Us */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-4">Contact us</h3>
              <div className="text-sm text-white/90 space-y-2 mb-6">
                <p>sweetdeli@gmail.com</p>
                <p>+62 877-4601-0838</p>
                <p className="leading-relaxed">
                  Jl. Raya Puncak No.477, Bendungan, Kec. Ciawi, Kabupaten Bogor, Jawa Barat 16720
                </p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex gap-4 mt-4">
                <a 
                  href="https://www.instagram.com/cifos_ciawi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.tiktok.com/@cifos.ciawi?is_from_webapp=1&sender_device=pc" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/90 hover:text-white transition-colors"
                  aria-label="TikTok"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
