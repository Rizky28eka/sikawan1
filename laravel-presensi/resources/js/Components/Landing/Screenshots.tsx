export default function Screenshots() {
  const screenshots = [
    { title: "Dashboard Monitoring", desc: "Pantau kehadiran tim secara real-time.", color: "bg-indigo-600" },
    { title: "Face Registration", desc: "Proses pendaftaran wajah yang simpel.", color: "bg-violet-600" },
    { title: "Report Generation", desc: "Ekspor laporan dalam berbagai format.", color: "bg-emerald-600" }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Tampilan <span className="text-indigo-600">Aplikasi</span></h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Antarmuka pengguna yang bersih, modern, dan intuitif untuk kenyamanan maksimal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {screenshots.map((s, i) => (
            <div key={i} className="group relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-white border border-slate-200">
               <div className={`absolute inset-0 ${s.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
               <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900/80 to-transparent text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h4 className="text-xl font-bold mb-1">{s.title}</h4>
                  <p className="text-sm text-slate-200">{s.desc}</p>
               </div>
               {/* Image Placeholder */}
               <div className="w-full h-full flex items-center justify-center text-slate-200 font-bold">
                  [ Screenshot {i + 1} ]
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
