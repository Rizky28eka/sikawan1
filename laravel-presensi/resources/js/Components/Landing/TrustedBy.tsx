export default function TrustedBy() {
  const partners = [
    { name: "Bank Negara", logo: "BN" },
    { name: "TechCorp", logo: "TC" },
    { name: "EduCenter", logo: "EC" },
    { name: "IndoRetail", logo: "IR" },
    { name: "GreenEnergy", logo: "GE" },
    { name: "SmartLogistik", logo: "SL" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-12">
          Dipercaya oleh raturan perusahaan inovatif
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner) => (
            <div key={partner.name} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-xl group-hover:bg-indigo-600 transition-colors">
                {partner.logo}
              </div>
              <span className="text-xl font-bold text-slate-900">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
