export default function Integrations() {
  const tools = [
    { name: "Excel", color: "bg-green-100 text-green-600" },
    { name: "Google Sheets", color: "bg-emerald-100 text-emerald-600" },
    { name: "Slack", color: "bg-rose-100 text-rose-600" },
    { name: "Trello", color: "bg-blue-100 text-blue-600" },
    { name: "SAP", color: "bg-blue-50 text-sky-700" },
    { name: "Odoo", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">
              Terhubung dengan <span className="text-indigo-600">Sistem Favorit</span> Anda
            </h2>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Sikawan dapat diintegrasikan dengan berbagai aplikasi manajemen HR dan Payroll untuk memastikan alur kerja Anda tetap sinkron tanpa input manual.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl hover:shadow-xl transition-all duration-300 group">
                <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center font-black text-xs mb-4 group-hover:scale-110 transition-transform`}>
                  {tool.name.charAt(0)}
                </div>
                <span className="text-slate-400 font-bold text-sm tracking-tight">{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
