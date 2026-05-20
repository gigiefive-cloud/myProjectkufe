import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login', form)
      setAuth(res.data.token, res.data.user)
      navigate('/dashboard')
      console.log(res)
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau kata sandi salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1326] text-[#dae2fd] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="batik-overlay" />

      {/* Ambient Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,193,255,0.08) 0%, rgba(111,0,190,0.03) 50%, transparent 100%)', filter: 'blur(80px)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(192,193,255,0.08) 0%, rgba(111,0,190,0.03) 50%, transparent 100%)', filter: 'blur(80px)' }} />

      {/* Floating shapes */}
      <div className="fixed top-20 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-[#c0c1ff]/10 to-transparent blur-2xl animate-pulse" />
      <div className="fixed bottom-40 left-[10%] w-48 h-48 rounded-full bg-gradient-to-tr from-[#ddb7ff]/10 to-transparent blur-3xl animate-pulse" style={{ animationDelay: '700ms' }} />

      <main className="w-full max-w-md z-10">
        {/* Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-[#c0c1ff] tracking-tighter mb-1">myProjectku</h1>
          <p className="text-sm text-[#c7c4d7] opacity-70">Aetheric Glass Management Suite</p>
        </div>

        {/* Card */}
        <div className="glass-card-login rounded-xl p-8 border-t-2 border-l border-white/5">
          <header className="mb-6">
            <h2 className="text-2xl font-semibold text-[#dae2fd] mb-1">Selamat Datang Kembali</h2>
            <p className="text-sm text-[#c7c4d7]">Yuk, masuk ke ruang kerja digitalmu.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block">Email Kerja</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[#c7c4d7]/50 text-base">mail</span>
                <input
                  type="email"
                  className="glass-input"
                  placeholder="nama@perusahaan.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block">Kata Sandi</label>
                <a href="#" className="text-xs font-semibold text-[#4cd7f6] hover:text-[#ddb7ff] smooth-transition">Lupa?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-[#c7c4d7]/50 text-base">lock</span>
                <input
                  type={showPass ? 'text' : 'password'}
                  className="glass-input pr-12"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#c7c4d7]/50 hover:text-[#dae2fd] smooth-transition">
                  <span className="material-symbols-outlined">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-[#ffb4ab] bg-[#93000a]/20 p-3 rounded border border-[#ffb4ab]/20">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#c0c1ff] text-[#1000a9] font-bold rounded-lg shadow-lg hover:brightness-110 active:scale-95 smooth-transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-[#1000a9] border-t-transparent rounded-full animate-spin" />
                  Memverifikasi...
                </>
              ) : 'Masuk ke Dashboard'}
            </button>
          </form>

          <div className="relative py-4 flex items-center my-2">
            <div className="flex-grow border-t border-[rgba(255,255,255,0.1)]" />
            <span className="flex-shrink mx-4 text-xs font-semibold text-[#c7c4d7]/40">ATAU</span>
            <div className="flex-grow border-t border-[rgba(255,255,255,0.1)]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] hover:bg-white/5 smooth-transition">
              <span className="material-symbols-outlined text-base">token</span>
              <span className="text-sm">SSO</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] hover:bg-white/5 smooth-transition">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>account_circle</span>
              <span className="text-sm">Google</span>
            </button>
          </div>

          <footer className="text-center pt-4 border-t border-[rgba(255,255,255,0.05)] mt-4">
            <p className="text-sm text-[#c7c4d7]">
              Baru di sini?{' '}
              <button onClick={() => navigate('/register')} className="text-[#4cd7f6] font-semibold hover:underline decoration-2 underline-offset-4">
                Buat Akun
              </button>
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-[#c7c4d7]/40">
              2026 myProjectku. Built dengan hati dan semangat.
            </p>
          </footer>
        </div>

        {/* Status */}
        <div className="mt-6 flex justify-center items-center gap-6 opacity-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs font-semibold">Server: Optimal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#4cd7f6]" />
            <span className="text-xs font-semibold">v2.4.12-aether</span>
          </div>
        </div>
      </main>
    </div>
  )
}
