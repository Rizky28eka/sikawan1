import { Link } from '@inertiajs/react';
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";

export default function Hero({ auth }: { auth: any }) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-50 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider">AI Face Recognition V2.0 Kini Tersedia</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Kelola Absensi Lebih <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Cerdas & Akurat</span>
            </h1>
            
            <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Sikawan menggunakan teknologi pengenalan wajah berbasis AI untuk memastikan kehadiran tim Anda valid, aman, dan efisien tanpa perlu kartu fisik atau sidik jari.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link 
                href={auth.user ? route('dashboard') : route('register')} 
                className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-black hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {auth.user ? "Ke Dashboard" : "Mulai Gratis Sekarang"} 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-slate-700 bg-white border-2 border-slate-100 rounded-full hover:bg-slate-50 hover:border-slate-200 transition-all duration-300 flex items-center justify-center gap-2">
                <Play className="w-5 h-5 fill-slate-700" />
                Lihat Demo
              </button>
            </div>

            {/* Proof Points */}
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 mb-20">
              {["Tanpa Kartu Fisik", "Akurasi 99.9%", "Support Geofencing"].map((text) => (
                <div key={text} className="flex items-center gap-2 text-slate-600 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm">{text}</span>
                </div>
              ))}
            </div>
            
            {/* Dashboard Preview Mockup */}
            <div className="relative group max-w-6xl mx-auto animate-float">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-2xl">
                <div className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-md px-4 py-1.5 text-xs text-slate-400 border border-slate-100 dark:border-slate-800 mx-auto w-1/2 text-center">
                    app.sikawan.com/dashboard
                  </div>
                </div>
                {/* Dashboard Image Placeholder - In production, use high quality image */}
                <div className="bg-slate-50 dark:bg-slate-950 aspect-[16/9] flex items-center justify-center overflow-hidden">
                   <div className="w-full h-full p-8 grid grid-cols-12 gap-6 opacity-80">
                      <div className="col-span-3 space-y-4">
                        <div className="h-32 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl animate-pulse"></div>
                        <div className="h-64 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                      </div>
                      <div className="col-span-9 space-y-4">
                        <div className="h-20 bg-violet-100 dark:bg-violet-900/20 rounded-2xl animate-pulse"></div>
                        <div className="grid grid-cols-3 gap-4">
                           <div className="h-40 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                           <div className="h-40 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                           <div className="h-40 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                        </div>
                        <div className="h-48 bg-slate-200 dark:bg-white/5 rounded-2xl animate-pulse"></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  );
}
