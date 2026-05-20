import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen overflow-x-hidden relative">
      <div className="batik-overlay" />

      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 glass-nav">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-[#c0c1ff] tracking-tight">myProjectku</span>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-[#c0c1ff] font-bold border-b-2 border-[#c0c1ff] pb-1">Keunggulan</a>
            <a href="#" className="text-[#c7c4d7] hover:text-[#c0c1ff] smooth-transition">Harga</a>
            <a href="#" className="text-[#c7c4d7] hover:text-[#c0c1ff] smooth-transition">Panduan</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="bg-[#c0c1ff] text-[#1000a9] px-6 py-2 rounded-lg font-bold hover:brightness-110 smooth-transition active:scale-95"
          >
            Masuk
          </button>
        </div>
      </nav>

      <main className="relative pt-24 z-10">
        {/* Hero Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] hero-glow -z-10" />

        {/* Hero Section */}
        <section className="max-w-[1440px] mx-auto px-6 py-20 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#222a3d] border border-[rgba(255,255,255,0.1)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-semibold text-[#4cd7f6] tracking-widest">v2.4 Kini hadir dengan dukungan React 18</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black max-w-4xl mb-6 bg-gradient-to-br from-[#dae2fd] via-[#dae2fd] to-[#c0c1ff] bg-clip-text text-transparent leading-tight tracking-tight">
            Transparan yang menyenangkan: tempat kumpul kita orang kerja satu atap satu keluarga.
          </h1>

          <p className="text-lg text-[#c7c4d7] max-w-2xl mb-10 leading-relaxed">
            Rasakan sensasi "Flow State" bareng myProjectku. Suite manajemen masa depan yang canggih, dibuat pakai Laravel dan React, dirancang buat kecepatan dan kejelasan kerja tim.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/login')}
              className="bg-[#c0c1ff] text-[#1000a9] px-8 py-4 rounded-xl font-bold flex items-center gap-2 smooth-transition hover:shadow-[0_0_20px_rgba(192,193,255,0.4)] active:scale-95"
            >
              Mulai Projek Kamu
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="glass-card px-8 py-4 rounded-xl font-bold text-[#dae2fd] hover:bg-white/10 smooth-transition active:scale-95">
              Lihat Demo
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 w-full max-w-5xl glass-card rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] smooth-transition">
            <div className="aspect-video bg-[#060e20] p-6 flex gap-4">
              <div className="w-48 bg-[#131b2e] rounded-lg p-4 flex flex-col gap-4">
                <div className="w-full h-8 bg-[#2d3449] rounded-md" />
                <div className="flex-1 flex flex-col gap-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`w-full h-6 rounded-sm ${i===3 ? 'bg-[#c0c1ff]/20' : 'bg-[#2d3449]/40'}`} />
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-12 bg-[#131b2e] rounded-lg w-full flex items-center px-4 gap-4">
                  <div className="w-32 h-4 bg-[#2d3449] rounded-full" />
                  <div className="ml-auto flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#2d3449]" />
                    <div className="w-8 h-8 rounded-full bg-[#2d3449]" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 flex-1">
                  {['secondary', 'tertiary', 'status-done'].map((c, i) => (
                    <div key={i} className="bg-[#131b2e] rounded-lg p-4 flex flex-col gap-4">
                      <div className={`w-full h-4 rounded-full bg-[#ddb7ff]/30`} />
                      <div className="flex-1 bg-[#2d3449]/20 rounded border border-[rgba(255,255,255,0.1)]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-[1440px] mx-auto px-6 py-20">
          <div className="flex flex-col mb-16">
            <span className="text-xs font-semibold text-[#c0c1ff] tracking-widest uppercase mb-2">Kapabilitas</span>
            <h2 className="text-3xl font-bold text-[#dae2fd]">Dirancang untuk Pengalaman Mulus</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 glass-card rounded-2xl p-8 flex flex-col justify-between hover:border-[#c0c1ff]/40 smooth-transition">
              <div>
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center border border-[#3B82F6]/30">
                    <span className="material-symbols-outlined text-[#3B82F6]">terminal</span>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-[#ddb7ff]/20 flex items-center justify-center border border-[#ddb7ff]/30">
                    <span className="material-symbols-outlined text-[#ddb7ff]">javascript</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">Teknologi Enterprise: Laravel & React</h3>
                <p className="text-[#c7c4d7] max-w-md">
                  Dibangun dengan ketangguhan Laravel dan kekuatan reaktif React 18. Nikmati respon di bawah 100ms dan sinkronisasi data real-time untuk seluruh tim kamu.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                {['API-First', 'SSR Optimal', 'Tanpa Jeda'].map(tag => (
                  <span key={tag} className="px-4 py-2 rounded-full bg-[#2d3449] text-xs font-semibold border border-[rgba(255,255,255,0.1)]">{tag}</span>
                ))}
              </div>
            </div>

            <div className="md:col-span-4 glass-card rounded-2xl p-8 flex flex-col items-center text-center justify-center hover:border-[#4cd7f6]/40 smooth-transition">
              <div className="relative w-32 h-32 mb-8">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#2d3449" strokeWidth="8" />
                  <circle cx="64" cy="64" r="58" fill="transparent" stroke="#4cd7f6" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset="36.4" className="drop-shadow-[0_0_8px_rgba(76,215,246,0.6)]" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">99</span>
                  <span className="text-xs font-semibold text-[#4cd7f6]">PERF</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Performa Mantap</h3>
              <p className="text-sm text-[#c7c4d7]">Skor Lighthouse yang nggak pernah anjlok.</p>
            </div>

            <div className="md:col-span-4 glass-card rounded-2xl p-8 hover:border-[#ddb7ff]/40 smooth-transition">
              <span className="material-symbols-outlined text-[#ddb7ff] text-4xl mb-6 block">group_work</span>
              <h3 className="text-2xl font-semibold mb-2">Kolaborasi Cair</h3>
              <p className="text-sm text-[#c7c4d7]">Kehadiran live, kursor bersama, dan pembaruan tugas instan bikin semua orang tetap nyambung tanpa perlu refresh halaman.</p>
            </div>

            <div className="md:col-span-8 glass-card rounded-2xl p-8 flex items-center gap-8 hover:border-[#10B981]/40 smooth-transition">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Keamanan Terfortifikasi</h3>
                <p className="text-sm text-[#c7c4d7] mb-4">Infrastruktur patuh SOC2 Type II dengan enkripsi ujung-ke-ujung untuk semua metadata projek kamu.</p>
                <a href="#" className="text-[#c0c1ff] text-xs font-semibold inline-flex items-center gap-1 group">
                  Pelajari protokol kami
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 smooth-transition">arrow_right_alt</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1440px] mx-auto px-6 py-20">
          <div className="glass-card rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#c0c1ff]/20 blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#ddb7ff]/20 blur-[100px] pointer-events-none" />
            <h2 className="text-5xl font-black mb-6 relative z-10">Siap mencapai flow state kamu?</h2>
            <p className="text-lg text-[#c7c4d7] mb-10 max-w-2xl mx-auto relative z-10">
              Gabung bareng 2.000+ tim yang sudah upgrade alur kerja mereka ke suite manajemen tercanggih yang pernah dibuat.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <button
                onClick={() => navigate('/login')}
                className="bg-[#dae2fd] text-[#0b1326] px-10 py-5 rounded-2xl font-bold smooth-transition hover:scale-105 active:scale-95 shadow-xl"
              >
                Mulai Secara Gratis
              </button>
              <button className="glass-card px-10 py-5 rounded-2xl font-bold text-[#dae2fd] hover:bg-white/10 smooth-transition active:scale-95">
                Hubungi Sales
              </button>
            </div>
            <div className="mt-12 pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-wrap justify-center gap-x-12 gap-y-6 relative z-10">
              {['Tanpa kartu kredit', 'Coba gratis 14 hari', 'Kolaborator tak terbatas'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#10B981]">check_circle</span>
                  <span className="text-xs font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 flex flex-col md:flex-row justify-between items-center border-t border-[rgba(255,255,255,0.1)] bg-[#0b1326] mt-20 relative z-10">
        <div className="mb-4 md:mb-0">
          <span className="text-xl font-black text-[#dae2fd] block mb-1">myProjectku</span>
          <p className="text-sm text-[#c7c4d7]">© 2026 myProjectku. Built dengan hati dan semangat.</p>
        </div>
        <div className="flex gap-8 items-center">
          {['Ketentuan', 'Privasi', 'Kontak', 'Github'].map(item => (
            <a key={item} href="#" className="text-sm text-[#c7c4d7] hover:text-[#ddb7ff] smooth-transition">{item}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
