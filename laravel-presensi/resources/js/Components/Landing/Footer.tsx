import { Link } from '@inertiajs/react';
import { ShieldCheck, Instagram, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Sikawan
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Sistem manajemen HR modern yang memberdayakan perusahaan dengan teknologi biometrik dan otomatisasi cerdas.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Produk</h4>
            <ul className="space-y-4">
              {["Presensi Wajah", "Geofencing", "Payroll Otomatis", "Manajemen Cuti"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Perusahaan</h4>
            <ul className="space-y-4">
              {["Tentang Kami", "Karir", "Blog", "Kontak"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Ikuti Kami</h4>
            <div className="flex gap-4 mb-8">
              {[Instagram, Twitter, Linkedin, Github].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
            <p className="text-xs text-slate-400 font-medium">© 2026 Sikawan. All rights reserved.</p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex gap-6 text-xs font-medium text-slate-400">
             <Link href="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</Link>
             <Link href="#" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</Link>
             <Link href="#" className="hover:text-slate-600 transition-colors">Cookie Policy</Link>
           </div>
           <p className="text-xs text-slate-400">Dibuat dengan ❤️ untuk Masa Depan Kerja.</p>
        </div>
      </div>
    </footer>
  );
}
