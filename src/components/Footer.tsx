import { Facebook, Twitter, Instagram, Youtube, Linkedin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="glass-surface border-t-0 text-black pt-24 pb-12 rounded-t-[3rem] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <a href="/" className="text-3xl font-bold tracking-tighter">
            Uber
          </a>
          <p className="mt-4 text-gray-500 max-w-sm">
            Moving people and things to where they need to be, reliably and sustainably.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 text-black">
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Company</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Our offerings</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Investors</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Products</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">Ride</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Drive</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Deliver</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Eat</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Uber for Business</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Uber Freight</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Global citizenship</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Diversity and Inclusion</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Sustainability</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-bold text-lg">Travel</h4>
            <ul className="space-y-4 text-gray-500 text-sm font-medium">
              <li><a href="#" className="hover:text-black transition-colors">Airports</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Cities</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center pt-12 border-t border-black/5 gap-8">
          <div className="flex gap-6">
            <Facebook className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
            <Twitter className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
            <Instagram className="w-5 h-5 text-gray-400 hover:text-black cursor-pointer transition-colors" />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black gap-2 h-auto px-0 font-bold">
              <Globe className="w-4 h-4" /> English
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-black gap-2 h-auto px-0 font-bold">
              <Map className="w-4 h-4" /> New York
            </Button>
          </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Uber Technologies Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Map({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M14.106 5.553a2 2 0 0 0 1.788 0l2.316-1.158a2 2 0 0 1 1.789 0V18.106a2 2 0 0 1-1.788 0l-2.317-1.159a2 2 0 0 0-1.788 0l-4.212 2.106a2 2 0 0 1-1.788 0l-2.317-1.159a2 2 0 0 0-1.788 0l-2.21 1.105V5.894a2 2 0 0 1 1.788 0l2.317 1.159a2 2 0 0 0 1.788 0l4.212-2.106z" />
      <path d="M15 5.764v15" />
      <path d="M9 3.236v15" />
    </svg>
  );
}
