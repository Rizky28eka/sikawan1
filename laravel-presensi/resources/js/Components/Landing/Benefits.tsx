import { ShieldCheck, Zap, TrendingUp, Heart } from "lucide-react";

export default function Benefits() {
  const benefits = [
    {
      icon: ShieldCheck,
      title: "Zero Fraud",
      desc: "Hapus kecurangan 'titip absen' dengan verifikasi wajah AI yang akurat."
    },
    {
      icon: Zap,
      title: "Real-time Monitoring",
      desc: "Pantau kehadiran tim secara live, di mana pun dan kapan pun."
    },
    {
      icon: TrendingUp,
      title: "Meningkatkan Produktivitas",
      desc: "Budayakan kedisiplinan yang berdampak langsung pada performa bisnis."
    },
    {
      icon: Heart,
      title: "Employee Experience",
      desc: "Proses presensi yang mudah dan modern memberikan pengalaman positif bagi tim."
    }
  ];

  return (
    <section className="py-24 bg-indigo-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-32 -mt-32"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
              Mengapa Bisnis Anda Membutuhkan <span className="text-indigo-400">Sikawan?</span>
            </h2>
            <p className="text-xl text-indigo-100/70 mb-12 leading-relaxed">
              Kami membawa manajemen SDM Anda ke level berikutnya dengan otomatisasi cerdas yang menghemat waktu dan biaya operasional.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {benefits.map((b, i) => (
                <div key={i} className="space-y-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <b.icon className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h4 className="text-xl font-bold">{b.title}</h4>
                  <p className="text-indigo-100/60 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group p-4">
             <div className="absolute inset-0 bg-indigo-500/10 rounded-[3rem] blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
             <div className="relative aspect-square bg-slate-800 rounded-[3rem] border border-white/5 flex items-center justify-center p-8">
                <div className="text-center space-y-6">
                   <div className="inline-flex items-center justify-center w-32 h-32 bg-indigo-600/30 rounded-full border border-indigo-500/50">
                      <TrendingUp className="w-16 h-16 text-indigo-400" />
                   </div>
                   <div className="space-y-2">
                      <div className="text-4xl font-black">45%</div>
                      <p className="text-indigo-200/60 font-medium">Peningkatan Efisiensi Admin HR</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
