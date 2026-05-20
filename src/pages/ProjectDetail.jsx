import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

const statusColor = {
  todo: 'bg-[#c7c4d7]/10 text-[#c7c4d7] border-[#c7c4d7]/20',
  in_progress: 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20',
  review: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  done: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
}

const priorityColor = {
  low: 'bg-[#c7c4d7]/10 text-[#c7c4d7] border-[#c7c4d7]/20',
  medium: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
  high: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20',
  urgent: 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/30',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '', description: '', status: 'todo',
    priority: 'medium', due_date: '', divisi: ''
  })

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [id])

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`)
      setProject(res.data?.data || res.data)
    } catch (err) { console.error(err) }
  }

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/projects/${id}/tasks`)
      setTasks(res.data?.data || res.data || [])
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    try {
      await api.post('/tasks', { ...newTask, project_id: id })
      setNewTask({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '', divisi: '' })
      setShowAddTask(false)
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Hapus tugas ini?')) return
    try {
      await api.delete(`/tasks/${taskId}`)
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const handleLogout = async () => {
    try { await api.post('/auth/logout') } catch {}
    logout()
    navigate('/login')
  }

  const filteredTasks = tasks.filter(t =>
    filterStatus === 'all' || t.status?.toLowerCase().replace(' ', '_') === filterStatus
  )

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    urgent: tasks.filter(t => t.priority === 'urgent' || t.priority === 'high').length,
    done: tasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] min-h-screen relative">
      <div className="batik-overlay" />

      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#131b2e] border-r border-[rgba(255,255,255,0.1)] z-50">
        <div className="px-6 py-8">
          <h1 className="text-xl font-black text-[#c0c1ff] tracking-tighter">myProjectku</h1>
          <p className="text-xs text-[#c7c4d7] opacity-70">Aplikasi Manajemen</p>
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {[
            { icon: 'dashboard', label: 'Beranda', href: '/dashboard' },
            { icon: 'assignment', label: 'Proyek', active: true },
            { icon: 'list_alt', label: 'Tugas' },
            { icon: 'groups', label: 'Tim' },
            { icon: 'analytics', label: 'Laporan' },
          ].map(item => (
            <a key={item.label} href={item.href || '#'}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg smooth-transition ${item.active ? 'bg-[#6f00be] text-[#d6a9ff]' : 'text-[#c7c4d7] hover:bg-[#2d3449]'}`}>
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-semibold">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-[rgba(255,255,255,0.1)] space-y-2">
          <button onClick={() => setShowAddTask(true)}
            className="w-full py-3 px-4 bg-[#c0c1ff] text-[#1000a9] rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 smooth-transition">
            <span className="material-symbols-outlined">add</span> Tugas Baru
          </button>
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 text-[#c7c4d7] hover:bg-[#2d3449] rounded-lg w-full">
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* TopNavBar */}
      <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 glass-nav flex items-center justify-between px-6 z-40">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-[#c7c4d7] hover:text-[#c0c1ff] smooth-transition">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="hidden md:flex items-center bg-[#171f33] rounded-full px-4 py-1.5 border border-[rgba(255,255,255,0.1)] w-64">
            <span className="material-symbols-outlined text-[#908fa0] text-sm">search</span>
            <input className="bg-transparent border-none focus:outline-none text-sm w-full placeholder:text-[#908fa0] ml-2" placeholder="Cari tugas..." />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#c7c4d7] cursor-pointer hover:text-[#c0c1ff] smooth-transition">notifications</span>
          <div className="w-8 h-8 rounded-full bg-[#6f00be] border border-[#c0c1ff] flex items-center justify-center text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative pt-16 pb-12 lg:ml-64 z-10">
        {/* Project Header */}
        <section className="relative overflow-hidden mb-10 min-h-[280px] flex items-center">
          <div className="absolute right-0 top-0 w-full md:w-3/4 h-full z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGmgMefv97jb0Dr8uJ0-9YbP6ynhIemzBOrt5ds2WcBp3WAvgYu08J3FTOXZsTCF-sWH5qh-QGaM3qb9EQcy8CttnpcAfxFMWp76PGByWjyIIWryh-h7cvDiSRySMjLffqsySQuc3QeP0Z22-ubm1oopSQ8gvCZ8Z3q1__RA2S_niNdT2vvPYvgzMU7e5D0P0t8xVmKA9G65x5m8wtF2rQYOApbbU_1J56PUd8dNP2yNY6K0vzPMtQtGAxTKJrrNlFcYNZwPP698"
              className="w-full h-full object-cover opacity-40"
              alt="Project"
            />
            <div className="absolute inset-0 hero-gradient hidden md:block" />
            <div className="absolute inset-0 bg-[#0b1326]/70 md:hidden" />
          </div>
          <div className="relative z-10 px-6 lg:px-12 w-full py-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-[#009eb9]/30 text-[#4cd7f6] text-xs font-bold tracking-widest uppercase backdrop-blur-md border border-[#4cd7f6]/20">
                    {project?.status || 'Aktif'}
                  </span>
                  <span className="text-[#dae2fd]/70 text-sm">ID: #{id}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                  {project?.name || 'Loading...'}
                </h2>
                <p className="text-white/80 max-w-2xl text-base">{project?.description || ''}</p>
              </div>
              <div className="flex gap-3">
                <button className="p-3 rounded-xl glass-card flex items-center justify-center text-[#c0c1ff] smooth-transition">
                  <span className="material-symbols-outlined">share</span>
                </button>
                <button onClick={() => setShowAddTask(true)}
                  className="px-6 py-3 rounded-xl bg-[#8083ff] text-[#0d0096] font-bold flex items-center gap-2 hover:brightness-110 smooth-transition shadow-lg">
                  <span className="material-symbols-outlined">add</span> Tambah Tugas
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="px-6 lg:px-12 max-w-[1440px] mx-auto">
          {/* Stats */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Semua Tugas', value: stats.total, color: '#c0c1ff', icon: 'list_alt' },
              { label: 'Lagi Dikerjakan', value: stats.inProgress, color: '#3B82F6', icon: 'pending' },
              { label: 'Butuh Perhatian', value: stats.urgent, color: '#EF4444', icon: 'error' },
              { label: 'Selesai', value: stats.done, color: '#10B981', icon: 'check_circle' },
            ].map(stat => (
              <div key={stat.label} className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-[#908fa0] uppercase tracking-wider">{stat.label}</span>
                  <span className="material-symbols-outlined" style={{ color: stat.color }}>{stat.icon}</span>
                </div>
                <p className="text-4xl font-black" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-xl font-semibold">Daftar Tugas</h3>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'todo', 'in_progress', 'review', 'done'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1 glass-card rounded-full text-xs font-semibold smooth-transition ${filterStatus === s ? 'bg-[#c0c1ff]/20 text-[#c0c1ff] border-[#c0c1ff]/30' : 'text-[#908fa0] hover:bg-[#2d3449]'}`}>
                      {s === 'all' ? 'Semua' : s === 'todo' ? 'To-Do' : s === 'in_progress' ? 'Dikerjakan' : s === 'review' ? 'Review' : 'Selesai'}
                    </button>
                  ))}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-2 border-[#c0c1ff] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <span className="material-symbols-outlined text-5xl text-[#c7c4d7]/30 block mb-3">assignment</span>
                  <p className="text-[#c7c4d7]">Belum ada tugas</p>
                  <button onClick={() => setShowAddTask(true)}
                    className="mt-4 px-4 py-2 bg-[#c0c1ff] text-[#1000a9] rounded-lg text-sm font-bold">
                    Tambah Tugas Pertama
                  </button>
                </div>
              ) : filteredTasks.map(task => {
                const status = task.status?.toLowerCase().replace(' ', '_') || 'todo'
                const priority = task.priority?.toLowerCase() || 'medium'
                return (
                  <div key={task.id} className="glass-card rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 group cursor-pointer smooth-transition hover:translate-x-1">
                    <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6]">
                      <span className="material-symbols-outlined">task_alt</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#dae2fd] mb-1 group-hover:text-[#c0c1ff] smooth-transition">{task.title}</h4>
                      {task.description && <p className="text-xs text-[#c7c4d7] mb-2 line-clamp-1">{task.description}</p>}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${statusColor[status] || statusColor.todo}`}>
                          {status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${priorityColor[priority] || priorityColor.medium}`}>
                          {priority}
                        </span>
                        {task.divisi && <span className="text-xs text-[#c7c4d7]">{task.divisi}</span>}
                        {task.due_date && (
                          <span className="text-xs text-[#c7c4d7] flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={task.status}
                        onChange={e => handleStatusChange(task.id, e.target.value)}
                        onClick={e => e.stopPropagation()}
                        className="bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-2 py-1 text-xs text-[#dae2fd] focus:outline-none"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="done">Done</option>
                      </select>
                      <button onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-[#EF4444]/50 hover:text-[#EF4444] smooth-transition">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              {/* Tim */}
              <div className="glass-card rounded-3xl p-6">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff]">groups</span> Tim Lapangan
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#908fa0] uppercase tracking-[0.2em] block mb-3">Anggota Tim</span>
                    {tasks.reduce((acc, task) => {
                      if (task.user && !acc.find(u => u.id === task.user.id)) acc.push(task.user)
                      return acc
                    }, []).slice(0, 5).map(member => (
                      <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#2d3449]/50 smooth-transition">
                        <div className="w-8 h-8 rounded-full bg-[#6f00be] border border-[#c0c1ff]/30 flex items-center justify-center text-xs font-bold text-[#c0c1ff]">
                          {member.name?.[0]?.toUpperCase()}
                        </div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <span className="ml-auto w-2 h-2 rounded-full bg-[#10B981]" />
                      </div>
                    ))}
                    {tasks.reduce((acc, task) => {
                      if (task.user && !acc.find(u => u.id === task.user.id)) acc.push(task.user)
                      return acc
                    }, []).length === 0 && (
                      <p className="text-sm text-[#c7c4d7]">Belum ada anggota</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Task Log */}
              <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#c0c1ff]/5 blur-3xl -mr-16 -mt-16" />
                <h3 className="text-xl font-semibold mb-4 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#c0c1ff]">sticky_note_2</span> Log Aktivitas
                  </span>
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {tasks.slice(0, 5).map((task, i) => (
                    <div key={i} className={`p-3 bg-[#2d3449]/30 rounded-xl ${i === 0 ? 'border-l-2 border-[#c0c1ff]' : ''}`}>
                      <p className="text-xs text-[#908fa0] mb-1 font-semibold">
                        {task.user?.name || 'Tim'} · {task.status}
                      </p>
                      <p className="text-sm text-[#dae2fd]">{task.title}</p>
                    </div>
                  ))}
                  {tasks.length === 0 && <p className="text-sm text-[#c7c4d7]">Belum ada aktivitas</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button onClick={() => setShowAddTask(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#6f00be] text-[#d6a9ff] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 smooth-transition z-50 group">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-90 smooth-transition">add</span>
      </button>

      {/* Modal Add Task */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="glass-card-login rounded-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Tambah Tugas Baru</h2>
              <button onClick={() => setShowAddTask(false)}>
                <span className="material-symbols-outlined text-[#c7c4d7]">close</span>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-4">
              {[
                { label: 'Judul Tugas *', key: 'title', type: 'text', placeholder: 'Nama tugas...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">{field.label}</label>
                  <input type={field.type} placeholder={field.placeholder} required
                    className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none focus:ring-1 focus:ring-[#c0c1ff]"
                    value={newTask[field.key]} onChange={e => setNewTask({ ...newTask, [field.key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Deskripsi</label>
                <textarea className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none focus:ring-1 focus:ring-[#c0c1ff] resize-none h-20"
                  placeholder="Deskripsi tugas..." value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Status</label>
                  <select className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none"
                    value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Prioritas</label>
                  <select className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none"
                    value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Divisi</label>
                  <select className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none"
                    value={newTask.divisi} onChange={e => setNewTask({ ...newTask, divisi: e.target.value })}>
                    <option value="">Pilih Divisi</option>
                    {['arsitek','struktur','sipil','taman','interior','pengadaan','supervisor'].map(d => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-widest block mb-2">Due Date</label>
                  <input type="date" className="w-full bg-[#2d3449] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-[#dae2fd] focus:outline-none"
                    value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddTask(false)}
                  className="flex-1 py-3 rounded-lg border border-[rgba(255,255,255,0.1)] text-[#c7c4d7] hover:bg-white/5 smooth-transition">
                  Batal
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-bold hover:brightness-110 smooth-transition">
                  Tambah Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
