export default function Stats() {
  const stats = [
    { label: "Partner Perusahaan", value: "500+" },
    { label: "Karyawan Aktif", value: "25rb+" },
    { label: "Presensi Tercatat", value: "1Jt+" },
    { label: "Akurasi Sistem", value: "99.9%" },
  ];

  return (
    <section className="py-20 bg-indigo-600">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-center justify-center">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-black text-white mb-2">{stat.value}</div>
              <div className="text-indigo-100 font-bold uppercase tracking-wider text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
