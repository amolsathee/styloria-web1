import logo from "@/assets/logo.svg";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground py-12 px-4">
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <img src={logo} alt="Styloria" className="h-12 brightness-0 invert" />
        <div className="flex flex-wrap justify-center gap-6 text-base opacity-70">
          <a href="#home" className="hover:opacity-100 transition-opacity">Home</a>
          <a href="#services" className="hover:opacity-100 transition-opacity">Services</a>
          <a href="#bridal" className="hover:opacity-100 transition-opacity">Bridal</a>
          <a href="/gallery" className="hover:opacity-100 transition-opacity">Gallery</a>
          <a href="/offers" className="hover:opacity-100 transition-opacity">Gallery</a>
          <a href="#contact" className="hover:opacity-100 transition-opacity">Contact</a>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-8 pt-8 text-center text-sm opacity-50 flex items-center justify-center gap-1">
        © 2026 Styloria. Made with <Heart size={14} className="text-primary" /> in Pune
      </div>
    </div>
  </footer>
);

export default Footer;
