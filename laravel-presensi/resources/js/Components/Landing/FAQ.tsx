import { Plus, Minus } from "lucide-react";
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apakah data wajah karyawan aman?",
      a: "Tentu. Kami mengenkripsi data wajah menggunakan algoritma enkripsi tercanggih. Kami tidak menyimpan foto wajah asli, melainkan representasi matematis (face embedding) yang tidak bisa dikembalikan ke bentuk foto asli."
    },
    {
      q: "Apakah bisa digunakan tanpa internet (Offline)?",
      a: "Sikawan memerlukan koneksi internet stabil untuk proses sinkronisasi real-time. Namun, kami memiliki fitur caching yang memungkinkan aplikasi tetap berjalan sementara jika terjadi gangguan singkat."
    },
    {
      q: "Bagaimana jika karyawan berganti HP?",
      a: "Admin dapat me-reset device ID karyawan melalui dashboard manajemen. Karyawan kemudian dapat melakukan login di perangkat baru dengan verifikasi wajah ulang."
    },
    {
      q: "Bisa integrasi dengan sistem payroll yang kami punya?",
      a: "Sangat bisa. Sikawan menyediakan API yang terbuka untuk paket Enterprise dan fitur ekspor laporan yang kompatibel dengan berbagai software HR atau payroll populer."
    },
    {
      q: "Apakah akurasi face recognition terjamin?",
      a: "Teknologi AI kami memiliki akurasi hingga 99.9% dan dilengkapi dengan fitur liveness detection untuk mencegah kecurangan menggunakan foto atau video."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Pertanyaan <span className="text-indigo-600">Populer</span></h2>
          <p className="text-lg text-slate-500 font-medium">Temukan jawaban untuk pertanyaan yang sering diajukan seputar layanan Sikawan.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`border rounded-2xl transition-all duration-300 ${openIndex === i ? 'border-indigo-600 bg-indigo-50/20' : 'border-slate-100'}`}>
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={`text-lg font-bold ${openIndex === i ? 'text-indigo-600' : 'text-slate-900'}`}>{faq.q}</span>
                {openIndex === i ? <Minus className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-slate-400" />}
              </button>
              {openIndex === i && (
                <div className="px-8 pb-8 pt-0 animate-fade-in">
                  <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
