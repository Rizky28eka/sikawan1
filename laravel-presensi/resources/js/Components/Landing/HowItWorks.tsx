import { UserPlus, Settings, Scan, BarChart } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Daftarkan Perusahaan",
      desc: "Buat akun perusahaan Anda dan setup profil admin dalam hitungan menit."
    },
    {
      icon: Settings,
      title: "Input Data Karyawan",
      desc: "Tambahkan data karyawan dan daftarkan sampel wajah mereka ke dalam sistem."
    },
    {
      icon: Scan,
      title: "Mulai Presensi",
      desc: "Karyawan melakukan presensi melalui aplikasi dengan verifikasi wajah cepat."
    },
    {
      icon: BarChart,
      title: "Pantau Laporan",
      desc: "Lihat ringkasan kehadiran dan otomatisasi payroll langsung dari dashboard."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
            Bagaimana <span className="text-indigo-600">Sikawan Bekerja?</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Implementasi yang mudah dan cepat untuk segera meningkatkan efisiensi operasional tim Anda.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-24 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
          
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center mb-8 shadow-xl group-hover:border-indigo-600 group-hover:bg-indigo-600 transition-all duration-300 relative">
                <step.icon className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
