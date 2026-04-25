import { Link } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar({ auth }: { auth: any }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/80 backdrop-blur-md py-3 shadow-sm" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Sikawan
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {["Fitur", "Harga", "Testimoni", "FAQ"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {item}
            </Link>
          ))}
          <div className="flex items-center gap-4 ml-4">
            {auth.user ? (
               <Link href={route('dashboard')} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href={route('login')} className="text-sm font-medium text-slate-600 hover:text-indigo-600">
                  Log in
                </Link>
                <Link href={route('register')} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all">
                  Mulai Sekarang
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
          {["Fitur", "Harga", "Testimoni", "FAQ"].map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} className="text-base font-medium text-slate-600" onClick={() => setIsMobileMenuOpen(false)}>
              {item}
            </Link>
          ))}
          <hr className="border-slate-100" />
          {auth.user ? (
            <Link href={route('dashboard')} className="w-full py-3 text-center font-semibold text-white bg-indigo-600 rounded-xl">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={route('login')} className="w-full py-3 text-center font-semibold text-slate-600 border border-slate-200 rounded-xl">
                Log in
              </Link>
              <Link href={route('register')} className="w-full py-3 text-center font-semibold text-white bg-indigo-600 rounded-xl">
                Mulai Sekarang
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
