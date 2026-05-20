import { useState } from 'react'
import { X, FolderKanban, Users, LogOut, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import api from '../utils/api'

const statusColor = {
  'active': '#22C55E',
  'on_hold': '#F59F0B',
  'completed': '#3B82F6'
}

const Slidebar = ({ isOpen, setIsOpen, theme, projects, activeProject, setActiveProject, darkMode, refreshProjects }) => {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', status: 'active' })

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('Nama project wajib diisi'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/projects', form)
      setForm({ name: '', description: '', status: 'active' })
      setShowModal(false)
      if (refreshProjects) refreshProjects()
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal membuat project')
    } finally {
      setLoading(false)
    }
  }

  const overlayStyle = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 50,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '16px',
  }

  const modalStyle = {
    background: theme.surface,
    borderRadius: '16px',
    border: `1px solid ${theme.border}`,
    padding: '24px',
    width: '100%',
    maxWidth: '420px',
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${theme.border}`,
    background: darkMode ? '#0F172A' : '#F8FAFC',
    color: theme.text,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <>
      <aside style={{ width: '260px', minWidth: '260px' }} className="fixed md:relative z-20 h-full">
        <div style={{ background: theme.surface, borderRight: `1px solid ${theme.border}` }}
          className="p-4 h-full flex flex-col overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <div className="font-bold text-lg" style={{ color: theme.text }}>MyProjectKu</div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} style={{ color: theme.text }} />
            </button>
          </div>

          {/* Project section */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold" style={{ color: theme.muted }}>PROJECT AKTIF</p>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  background: theme.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  width: '24px', height: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
                title="Tambah Project"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-1">
              {projects && projects.length > 0 ? projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setActiveProject(p); setIsOpen(false) }}
                  className="w-full text-left p-3 rounded-xl transition-all"
                  style={{
                    background: activeProject?.id === p.id ? theme.accent : 'transparent',
                    color: activeProject?.id === p.id ? '#fff' : theme.text,
                    borderLeft: `3px solid ${activeProject?.id === p.id ? theme.accent : 'transparent'}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <FolderKanban size={16} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{p.name}</div>
                      <div className="flex items-center gap-1 text-xs opacity-70">
                        <div className="w-2 h-2 rounded-full"
                          style={{ background: statusColor[p.status] || theme.muted }} />
                        {p.status}
                      </div>
                    </div>
                  </div>
                </button>
              )) : (
                <p className="text-xs py-2 text-center" style={{ color: theme.muted }}>
                  Belum ada project
                </p>
              )}
            </div>
          </div>

          {/* Logout */}
          <div className="mt-auto">
            <button
              onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }}
              className="w-full flex items-center gap-2 p-3 rounded-xl text-sm"
              style={{ color: theme.muted }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 md:hidden" />
      )}

      {/* Modal tambah project */}
      {showModal && (
        <div style={overlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: theme.text }}>
                  Buat Project Baru
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: theme.muted }}>
                  Isi detail project kamu
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.muted, padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.muted, marginBottom: '6px' }}>
                  Nama Project *
                </label>
                <input
                  style={inputStyle}
                  placeholder="Contoh: Gedung A - Lantai 3"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.muted, marginBottom: '6px' }}>
                  Deskripsi
                </label>
                <textarea
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                  placeholder="Deskripsi singkat project..."
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: theme.muted, marginBottom: '6px' }}>
                  Status
                </label>
                <select
                  style={inputStyle}
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {error && (
                <div style={{
                  background: '#FCEBEB', color: '#A32D2D',
                  padding: '10px 12px', borderRadius: '8px', fontSize: '13px',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <AlertCircle size={14} /> {error}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px',
                    border: `1px solid ${theme.border}`, background: 'transparent',
                    color: theme.muted, cursor: 'pointer',
                  }}
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', fontSize: '14px',
                    border: 'none', background: theme.accent,
                    color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1, fontWeight: '600',
                  }}
                >
                  {loading ? 'Menyimpan...' : '+ Buat Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Slidebar