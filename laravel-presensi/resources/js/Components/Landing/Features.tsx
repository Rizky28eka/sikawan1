import { Fingerprint, MapPin, BarChart3, Clock, ShieldCheck, Smartphone } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Fingerprint,
      title: "Presensi Biometrik Wajah",
      desc: "Verifikasi kehadiran dengan AI Recognition tercepat. Anti-fake photo dan anti-split screen.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      icon: MapPin,
      title: "Smart Geofencing",
      desc: "Batasi lokasi presensi berdasarkan koordinat GPS yang akurat untuk setiap cabang atau site.",
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      icon: Clock,
      title: "Manajemen Shift",
      desc: "Atur jadwal kerja tim yang dinamis, lembur, dan shift malam dengan sangat mudah.",
      color: "text-amber-600",
      bg: "bg-amber-50"
    },
    {
      icon: BarChart3,
      title: "Laporan Real-Time",
      desc: "Pantau kehadiran tim secara live dari dashboard admin. Data akurat siap ekspor kapan saja.",
      color: "text-rose-600",
      bg: "bg-rose-50"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      desc: "Karyawan dapat melakukan presensi langsung dari smartphone mereka tanpa perangkat tambahan.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: ShieldCheck,
      title: "Keamanan Enterprise",
      desc: "Enkripsi data end-to-end memastikan privasi wajah dan data personal karyawan terlindungi.",
      color: "text-violet-600",
      bg: "bg-violet-50"
    }
  ];

  return (
    <section id="fitur" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-sm mb-4">Fitur Utama</h2>
          <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Solusi Presensi Paling <br /> <span className="text-indigo-600">Lengkap & Fleksibel</span>
          </h3>
          <p className="text-lg text-slate-500 font-medium">
            Dirancang untuk membantu HR mengelola ribuan karyawan dengan satu dashboard yang intuitif dan cerdas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="group p-10 bg-white rounded-[2rem] border border-slate-100 hover:border-indigo-200 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className={`w-14 h-14 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{f.title}</h4>
              <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
