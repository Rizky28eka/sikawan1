import { Check, X } from "lucide-react";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "15rb",
      period: "per karyawan / bulan",
      desc: "Cocok untuk UMKM dengan jumlah karyawan terbatas.",
      features: [
        "Face Recognition Attendance",
        "Mobile App Access",
        "Geofencing Standard",
        "Laporan Bulanan PDF",
        { title: "Dashboard Monitoring", included: false }
      ],
      cta: "Mulai Sekarang",
      popular: false
    },
    {
      name: "Pro",
      price: "25rb",
      period: "per karyawan / bulan",
      desc: "Solusi optimal untuk perusahaan berkembang.",
      features: [
        "Semua di Starter",
        "Advanced Geofencing",
        "Shift Management",
        "Live Dashboard Monitoring",
        "Ekspor Excel & CSV",
      ],
      cta: "Coba Gratis 14 Hari",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "kontak kami",
      desc: "Fitur lengkap & custom integrasi untuk skala besar.",
      features: [
        "Semua di Pro",
        "Unlimited Branch Office",
        "Integrasi API Payroll",
        "Dedicated Account Manager",
        "On-Premise Deployment",
      ],
      cta: "Hubungi Sales",
      popular: false
    }
  ];

  return (
    <section id="harga" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Investasi <span className="text-indigo-600">Terbaik</span> untuk Tim Anda</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Pilih paket sesuai kebutuhan bisnis Anda. Harga transparan tanpa biaya tersembunyi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative p-10 rounded-[2.5rem] border ${plan.popular ? 'border-indigo-600 shadow-2xl shadow-indigo-100 ring-2 ring-indigo-600/10' : 'border-slate-100 shadow-xl'} bg-white transition-transform hover:-translate-y-2`}>
              {plan.popular && (
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">
                  Paling Populer
                </div>
              )}
              <h4 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h4>
              <p className="text-sm text-slate-400 font-medium mb-8 leading-relaxed">{plan.desc}</p>
              
              <div className="flex items-baseline gap-1 mb-10">
                <span className="text-4xl font-black text-slate-900">{plan.price !== "Custom" ? `Rp${plan.price}` : plan.price}</span>
                {plan.price !== "Custom" && <span className="text-slate-400 font-bold text-sm tracking-tight">{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-12">
                {plan.features.map((feature: any, idx) => {
                   const isString = typeof feature === 'string';
                   const isIncluded = isString ? true : feature.included;
                   const title = isString ? feature : feature.title;

                   return (
                    <li key={idx} className="flex items-start gap-3">
                      {isIncluded ? <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" /> : <X className="w-5 h-5 text-slate-300 flex-shrink-0" />}
                      <span className={`text-sm font-semibold ${isIncluded ? 'text-slate-700' : 'text-slate-400 line-through'}`}>{title}</span>
                    </li>
                   )
                })}
              </ul>

              <button className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${plan.popular ? 'bg-indigo-600 text-white hover:bg-black shadow-lg shadow-indigo-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
