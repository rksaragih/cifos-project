import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";

const Footer = () => {
  return (
    <footer className="bg-green-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-xl mb-4">CIFOS</h3>
            <h4 className="font-semibold mb-3">Contact us</h4>
            <ul className="space-y-2 text-sm text-white/90">
              <li>sweetdeli@gmail.com</li>
              <li>+1-2345-6789</li>
              <li>123 Ave, New York, USA</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Products</h4>
            <ul className="space-y-2 text-sm text-white/90">
              {["Auctor volutpat.", "Fermentum turpis.", "Mi consequat.", "Amet venenatis.", "Convallis porttitor."].map((item, i) => (
                <li key={i}><Link to="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">About</h4>
            <ul className="space-y-2 text-sm text-white/90">
              {["Egestas vitae.", "Viverra lorem ac.", "Eget ac tellus.", "Erat nulla.", "Vulputate proin."].map((item, i) => (
                <li key={i}><Link to="#" className="hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Get the app</h4>
            <div className="space-y-3">
              <a href="#" className="block">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" className="h-10"/>
              </a>
              <a href="#" className="block">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10"/>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <Select defaultValue="english">
                <SelectTrigger className="w-[130px] bg-transparent border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="indonesian">Indonesian</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-white/80">Copyright © 2020. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
