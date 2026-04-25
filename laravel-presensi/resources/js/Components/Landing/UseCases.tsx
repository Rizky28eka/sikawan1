import { Briefcase, Building, Users } from "lucide-react";

export default function UseCases() {
  const cases = [
    {
      icon: Briefcase,
      title: "Pemilik Perusahaan",
      desc: "Dapatkan visibilitas penuh atas kedisiplinan tim tanpa perlu bertanya setiap hari."
    },
    {
      icon: Users,
      title: "HR & Operations",
      desc: "Otomatisasi rekapitulasi kehadiran dan hitung payroll dalam hitungan detik."
    },
    {
      icon: Building,
      title: "Manajer Cabang",
      desc: "Pantau absensi di berbagai lokasi cabang secara terpusat dan akurat."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Didesain untuk <span className="text-indigo-600">Berbagai Peran</span></h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Platform fleksibel yang menjawab kebutuhan setiap level manajemen diperusahaan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {cases.map((c, i) => (
            <div key={i} className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl group">
               <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <c.icon className="w-8 h-8 text-indigo-600 group-hover:text-white" />
               </div>
               <h4 className="text-xl font-bold text-slate-900 mb-4">{c.title}</h4>
               <p className="text-slate-500 font-medium leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
