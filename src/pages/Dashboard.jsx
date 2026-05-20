import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const statusColor = {
  todo: 'bg-[#c7c4d7]/10 text-[#c7c4d7] border-[#c7c4d7]/20',
  in_progress: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  review: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  done: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
}

const statusLabel = { todo: 'To Do', in_progress: 'Sedang Jalan', review: 'Review', done: 'Selesai' }

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeProject, setActiveProject] = useState(null)
  const [showNewProject, setShowNewProject] = useState(false)
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'active' })
  const [mobileNav, setMobileNav] = useState(false)

  const hour = new Date().getHours()
  const greeting = hour < 11 ? 'Selamat Pagi' : hour < 15 ? 'Selamat Siang' : hour < 19 ? 'Selamat Sore' : 'Selamat Malam'

  useEffect(() => { fetchProjects() }, [])
  useEffect(() => { if (activeProject) fetchTasks(activeProject.id) }, [activeProject])

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      const data = res.data?.data || res.data || []
      setProjects(data)
      if (data.length > 0) setActiveProject(data[0])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTasks = async (projectId) => {
    try {
      const res = await api.get(`/projects/${projectId}/tasks`)
      setTasks(res.data?.data || res.data || [])
    } catch (err) { console.error(err) }
  }

  const handleCreateProject = async (e) => {
    e.preventDefault()
    try {
      await api.post('/projects', newProject)
      setNewProject({ name: '', description: '', status: 'active' })
      setShowNewProject(false)
      fetchProjects()
    } catch (err) { console.error(err) }
  }

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  const activeTasks = tasks.filter(t => t.status !== 'done').length
  const doneTasks = tasks.filter(t => t.status === 'done').length

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen relative">
      <div className="batik-overlay" />

      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 glass-nav">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileNav(!mobileNav)}>
            <span className="material-symbols-outlined text-[#c0c1ff]">menu</span>
          </button>
          <span className="text-xl font-black text-[#c0c1ff]">myProjectku</span>
          <nav className="hidden lg:flex items-center gap-6 ml-8">
            <span className="text-[#c0c1ff] font-bold border-b-2 border-[#c0c1ff] pb-1">Dashboard</span>
            <a href="#" className="text-[#c7c4d7] hover:text-[#c0c1ff] smooth-transition">Fitur</a>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <input className="bg-[#171f33] border border-[rgba(255,255,255,0.1)] rounded-lg py-2 pl-10 pr-4 text-sm text-[#dae2fd] w-64 focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]" placeholder="Cari apa saja..." />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#c7c4d7] text-lg">search</span>
          </div>
          <button className="p-2 text-[#c7c4d7] hover:text-[#c0c1ff]">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-[#6f00be] border border-[#c0c1ff] flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Sidebar Desktop */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#131b2e] border-r border-[rgba(255,255,255,0.1)] z-40 pt-20`}>
        <div className="px-6 py-6 border-b border-[rgba(255,255,255,0.1)]">
          <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest mb-3">Proyek Aktif</p>
          {projects.map(p => (
            <button key={p.id} onClick={() => setActiveProject(p)}
              className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm smooth-transition ${activeProject?.id === p.id ? 'bg-[#6f00be] text-[#d6a9ff]' : 'text-[#c7c4d7] hover:bg-[#2d3449]'}`}>
              <span className="material-symbols-outlined text-sm mr-2">folder_kanban</span>
              {p.name}
            </button>
          ))}
          <button onClick={() => setShowNewProject(true)}
            className="w-full mt-2 px-3 py-2 rounded-lg text-sm text-[#c0c1ff] border border-[#c0c1ff]/30 hover:bg-[#c0c1ff]/10 smooth-transition flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span> Proyek Baru
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {[
            { icon: 'dashboard', label: 'Beranda', active: true },
            { icon: 'assignment', label: 'Proyek Kamu' },
            { icon: 'list_alt', label: 'Daftar Tugas' },
            { icon: 'groups', label: 'Tim Kita' },
            { icon: 'analytics', label: 'Laporan' },
          ].map(item => (
            <a key={item.label} href="#"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition ${item.active ? 'bg-[#6f00be] text-[#d6a9ff]' : 'text-[#c7c4d7] hover:bg-[#2d3449]'}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[rgba(255,255,255,0.1)]">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:bg-[#2d3449] rounded-lg w-full smooth-transition">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileNav(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-[#131b2e] border-r border-[rgba(255,255,255,0.1)] pt-16 z-10">
            <div className="px-6 py-4">
              {projects.map(p => (
                <button key={p.id} onClick={() => { setActiveProject(p); setMobileNav(false) }}
                  className={`w-full text-left px-3 py-2 rounded-lg mb-1 text-sm ${activeProject?.id === p.id ? 'bg-[#6f00be] text-[#d6a9ff]' : 'text-[#c7c4d7]'}`}>
                  {p.name}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-3 text-[#c7c4d7]">
              <span className="material-symbols-outlined">logout</span> Keluar
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <main className="lg:ml-64 pt-24 pb-12 px-6 min-h-screen relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-black text-[#c0c1ff]">{greeting}, {user?.name?.split(' ')[0] || 'Rekan'}!</h1>
            <p className="text-[#c7c4d7]">
              {activeProject ? `Proyek aktif: ${activeProject.name}` : 'Semangat ya, performa proyekmu naik hari ini.'}
            </p>
          </div>
          <button onClick={() => setShowNewProject(true)}
            className="bg-[#c0c1ff] text-[#1000a9] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 smooth-transition shadow-lg shadow-[#c0c1ff]/20">
            <span className="material-symbols-outlined">add</span> Proyek Baru
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-2 border-[#c0c1ff] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Stats */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 rounded-lg bg-[#c0c1ff]/10 text-[#c0c1ff]"><span className="material-symbols-outlined">bolt</span></span>
                  <span className="text-[#10B981] text-xs font-semibold">+4%</span>
                </div>
                <h3 className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">Tugas Aktif</h3>
                <p className="text-3xl font-black mt-1">{activeTasks}</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 rounded-lg bg-[#4cd7f6]/10 text-[#4cd7f6]"><span className="material-symbols-outlined">check_circle</span></span>
                  <span className="text-[#10B981] text-xs font-semibold">Selesai</span>
                </div>
                <h3 className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">Task Done</h3>
                <p className="text-3xl font-black mt-1">{doneTasks}</p>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                  <span className="p-2 rounded-lg bg-[#ddb7ff]/10 text-[#ddb7ff]"><span className="material-symbols-outlined">folder_kanban</span></span>
                  <span className="text-[#c0c1ff] text-xs font-semibold">Aktif</span>
                </div>
                <h3 className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">Total Proyek</h3>
                <p className="text-3xl font-black mt-1">{projects.length}</p>
              </div>
            </div>

            {/* Activity */}
            <div className="md:col-span-4 row-span-2 glass-card rounded-2xl flex flex-col">
              <div className="p-6 border-b border-[rgba(255,255,255,0.1)]">
                <h3 className="text-xl font-semibold">Proyek Saya</h3>
              </div>
              <div className="p-4 flex-1 space-y-2 overflow-y-auto max-h-[400px]">
                {projects.length === 0 ? (
                  <p className="text-sm text-[#c7c4d7] text-center py-8">Belum ada proyek</p>
                ) : projects.map(p => (
                  <button key={p.id} onClick={() => { setActiveProject(p); navigate(`/project/${p.id}`) }}
                    className={`w-full text-left p-3 rounded-xl smooth-transition ${activeProject?.id === p.id ? 'bg-[#6f00be]/30 border border-[#c0c1ff]/30' : 'hover:bg-[#2d3449]'}`}>
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#c0c1ff]">folder_kanban</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{p.name}</p>
                        <p className="text-xs text-[#c7c4d7]">{p.status}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#c7c4d7] text-sm">chevron_right</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="md:col-span-8 glass-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">
                  Tugas {activeProject ? `— ${activeProject.name}` : 'Terbaru'}
                </h3>
                {activeProject && (
                  <button onClick={() => navigate(`/project/${activeProject.id}`)}
                    className="text-[#c0c1ff] text-xs font-semibold flex items-center gap-1 hover:underline">
                    Lihat Semua <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {tasks.length === 0 ? (
                  <p className="text-sm text-[#c7c4d7] text-center py-8">
                    {activeProject ? 'Belum ada tugas di proyek ini' : 'Pilih proyek untuk melihat tugas'}
                  </p>
                ) : tasks.slice(0, 5).map(task => {
                  const status = task.status?.toLowerCase().replace(' ', '_') || 'todo'
                  return (
                    <div key={task.id}
                      className="group flex flex-col sm:flex-row items-center gap-4 p-4 bg-[#2d3449]/30 rounded-xl hover:bg-[#2d3449]/50 smooth-transition border border-transparent hover:border-[rgba(255,255,255,0.1)] cursor-pointer"
                      onClick={() => navigate(`/project/${activeProject?.id}`)}>
                      <div className="flex items-center gap-4 flex-1 w-full">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${status === 'done' ? 'bg-[#10B981] border-[#10B981]' : 'border-[#c0c1ff]/40'}`}>
                          {status === 'done' && <span className="material-symbols-outlined text-[#0b1326] text-sm">check</span>}
                        </div>
                        <div>
                          <h4 className={`text-sm font-semibold ${status === 'done' ? 'line-through opacity-60' : ''}`}>{task.title}</h4>
                          <p className="text-xs text-[#c7c4d7]">{task.user?.name || 'Unassigned'} · Prioritas {task.priority || 'medium'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColor[status] || statusColor.todo}`}>
                          {statusLabel[status] || task.status}
                        </span>
                        {task.due_date && (
                          <span className="text-xs text-[#c7c4d7]">
                            {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal New Project */}
      {showNewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-card-login rounded-2xl p-8 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Buat Proyek Baru</h2>
              <button onClick={() => setShowNewProject(false)}>
                <span className="material-symbols-outlined text-[#c7c4d7]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Nama Proyek *</label>
                <input
                  type="text"
                  className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]"
                  placeholder="Contoh: Gedung A - Lantai 3"
                  value={newProject.name}
                  onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Deskripsi</label>
                <textarea
                  className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none focus:ring-1 focus:ring-[#c0c1ff] resize-none h-20"
                  placeholder="Deskripsi singkat..."
                  value={newProject.description}
                  onChange={e => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Status</label>
                <select
                  className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none"
                  value={newProject.status}
                  onChange={e => setNewProject({ ...newProject, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNewProject(false)}
                  className="flex-1 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#c7c4d7] hover:bg-white/5 smooth-transition">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-bold hover:brightness-110 smooth-transition">
                  Buat Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full glass-nav border-t flex justify-around items-center py-4 px-6 z-50">
        {[
          { icon: 'dashboard', label: 'Beranda', active: true },
          { icon: 'assignment', label: 'Proyek' },
          { icon: null, label: '' },
          { icon: 'groups', label: 'Tim' },
          { icon: 'settings', label: 'Setelan' },
        ].map((item, i) => i === 2 ? (
          <button key={i} onClick={() => setShowNewProject(true)}
            className="w-12 h-12 bg-[#c0c1ff] rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-[#c0c1ff]/30 active:scale-95 smooth-transition">
            <span className="material-symbols-outlined text-[#1000a9]">add</span>
          </button>
        ) : (
          <a key={i} href="#" className={`flex flex-col items-center ${item.active ? 'text-[#c0c1ff]' : 'text-[#c7c4d7]'}`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] mt-1">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}
