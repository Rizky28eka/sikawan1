import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Budi Santoso",
      role: "HR Manager di TechCorp",
      content: "Sikawan telah merombak total cara kami memantau kehadiran karyawan. Sangat akurat dan tidak ada lagi masalah titip absen.",
      avatar: "BS"
    },
    {
      name: "Siska Putri",
      role: "Operations Director di RetailIndo",
      content: "Dashboard-nya sangat intuitif. Sekarang saya bisa melihat laporan kehadiran harian hanya dalam hitungan detik dari HP.",
      avatar: "SP"
    },
    {
      name: "Andi Wijaya",
      role: "Owner di KedaiKopi Group",
      content: "Untuk bisnis dengan banyak cabang seperti milik saya, fitur geofencing dan face recognition Sikawan sangatlah membatu.",
      avatar: "AW"
    }
  ];

  return (
    <section id="testimoni" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Cerita <span className="text-indigo-600">Sukses</span> Pengguna</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan Sikawan.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div key={i} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
              <Quote className="w-10 h-10 text-indigo-100 mb-6 group-hover:text-indigo-600 transition-colors" />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 italic">"{r.content}"</p>
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                    {r.avatar}
                 </div>
                 <div>
                    <h5 className="font-bold text-slate-900">{r.name}</h5>
                    <p className="text-xs text-slate-400 font-bold">{r.role}</p>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
