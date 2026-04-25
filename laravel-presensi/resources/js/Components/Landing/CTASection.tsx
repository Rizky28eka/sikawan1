import { Link } from '@inertiajs/react';

export default function CTASection({ auth }: { auth: any }) {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] -ml-40 -mb-40"></div>
           
           <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                Ubah Manajemen <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">Kehadiran Tim Anda</span> Hari Ini
              </h2>
              <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Bergabunglah dengan ratusan perusahaan yang telah memodernisasi cara kerja mereka dengan sistem presensi AI yang aman dan efisien.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href={auth.user ? route('dashboard') : route('register')} 
                  className="w-full sm:w-auto px-10 py-5 text-xl font-bold text-white bg-indigo-600 rounded-full hover:bg-white hover:text-indigo-600 transition-all shadow-xl shadow-indigo-500/10"
                >
                  {auth.user ? 'Ke Dashboard' : 'Mulai Coba Gratis'}
                </Link>
                <button className="w-full sm:w-auto px-10 py-5 text-xl font-bold text-slate-300 hover:text-white transition-all">
                  Lihat Dokumentasi API
                </button>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
