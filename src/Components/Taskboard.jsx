import { useState } from 'react'
import { Clock, AlertCircle, User, ChevronDown, ChevronUp } from 'lucide-react'

const Taskboard = ({ tasks, darkMode, projectId, refreshTasks }) => {
  const [sortField, setSortField] = useState('title')
  const [sortDir, setSortDir] = useState('asc')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')

  const theme = {
    bg: darkMode ? '#0F172A' : '#F7F7F2',
    surface: darkMode ? '#1E293B' : '#FFFFFF',
    border: darkMode ? '#334155' : '#E2E8F0',
    text: darkMode ? '#F1F5F9' : '#1E2938',
    muted: darkMode ? '#94A3B8' : '#64748B',
    accent: '#FF5A3C',
  }

  const priorityColor = {
    low: { bg: '#E1F5EE', text: '#0F6E56' },
    medium: { bg: '#FAEEDA', text: '#854F0B' },
    high: { bg: '#FBEAF0', text: '#993556' },
    urgent: { bg: '#FCEBEB', text: '#A32D2D' },
  }

  const statusColor = {
    todo: { bg: '#E6F1FB', text: '#185FA5' },
    in_progress: { bg: '#FAEEDA', text: '#854F0B' },
    review: { bg: '#EEEDFE', text: '#534AB7' },
    done: { bg: '#EAF3DE', text: '#3B6D11' },
  }

  const isUrgent = (dueDate) => {
    if (!dueDate) return false
    const diff = (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)
    return diff <= 3 && diff >= 0
  }

  const filtered = (tasks || [])
    .filter(t => filterStatus === 'all' || t.status?.toLowerCase().replace(' ', '_') === filterStatus)
    .filter(t => filterPriority === 'all' || t.priority === filterPriority)
    .sort((a, b) => {
      let va = a[sortField] || ''
      let vb = b[sortField] || ''
      if (sortDir === 'asc') return va > vb ? 1 : -1
      return va < vb ? 1 : -1
    })

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={14} style={{ opacity: 0.3 }} />
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  const thStyle = {
    padding: '10px 12px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: theme.muted,
    borderBottom: `1px solid ${theme.border}`,
    cursor: 'pointer',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  }

  const tdStyle = {
    padding: '10px 12px',
    fontSize: '13px',
    borderBottom: `1px solid ${theme.border}`,
    color: theme.text,
    verticalAlign: 'middle',
  }

  return (
    <div style={{ background: theme.bg, minHeight: '100%', padding: '16px' }}>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          style={{
            padding: '6px 10px', borderRadius: '8px', fontSize: '13px',
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: theme.text, cursor: 'pointer',
          }}
        >
          <option value="all">Semua Status</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="review">Review</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          style={{
            padding: '6px 10px', borderRadius: '8px', fontSize: '13px',
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: theme.text, cursor: 'pointer',
          }}
        >
          <option value="all">Semua Prioritas</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <span style={{ marginLeft: 'auto', fontSize: '13px', color: theme.muted, alignSelf: 'center' }}>
          {filtered.length} task
        </span>
      </div>

      {/* Table */}
      <div style={{
        background: theme.surface,
        borderRadius: '12px',
        border: `1px solid ${theme.border}`,
        overflow: 'hidden',
      }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: theme.muted }}>
            <p style={{ margin: 0 }}>Belum ada task</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: darkMode ? '#162032' : '#F8FAFC' }}>
                  <th style={thStyle} onClick={() => handleSort('title')}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Judul <SortIcon field="title" />
                    </span>
                  </th>
                  <th style={thStyle} onClick={() => handleSort('status')}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Status <SortIcon field="status" />
                    </span>
                  </th>
                  <th style={thStyle} onClick={() => handleSort('priority')}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Prioritas <SortIcon field="priority" />
                    </span>
                  </th>
                  <th style={thStyle} onClick={() => handleSort('divisi')}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Divisi <SortIcon field="divisi" />
                    </span>
                  </th>
                  <th style={thStyle} onClick={() => handleSort('due_date')}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Due Date <SortIcon field="due_date" />
                    </span>
                  </th>
                  <th style={thStyle}>Assignee</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((task, i) => {
                  const status = task.status?.toLowerCase().replace(' ', '_') || 'todo'
                  const priority = task.priority?.toLowerCase() || 'medium'
                  const sc = statusColor[status] || statusColor.todo
                  const pc = priorityColor[priority] || priorityColor.medium
                  const urgent = isUrgent(task.due_date)

                  return (
                    <tr
                      key={task.id || i}
                      style={{
                        background: i % 2 === 0 ? theme.surface : (darkMode ? '#1a2a3a' : '#FAFBFC'),
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = darkMode ? '#243447' : '#F0F4F8'}
                      onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? theme.surface : (darkMode ? '#1a2a3a' : '#FAFBFC')}
                    >
                      <td style={{ ...tdStyle, maxWidth: '200px' }}>
                        <p style={{ margin: 0, fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: theme.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {task.description}
                          </p>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          background: sc.bg, color: sc.text,
                          padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                        }}>
                          {task.status || 'To Do'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={{
                          background: pc.bg, color: pc.text,
                          padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '500',
                        }}>
                          {task.priority || 'medium'}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, color: theme.muted, fontSize: '13px' }}>
                        {task.divisi || '-'}
                      </td>
                      <td style={tdStyle}>
                        {task.due_date ? (
                          <span style={{
                            display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px',
                            color: urgent ? theme.accent : theme.muted,
                          }}>
                            {urgent ? <AlertCircle size={13} /> : <Clock size={13} />}
                            {new Date(task.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        ) : (
                          <span style={{ color: theme.muted, fontSize: '12px' }}>-</span>
                        )}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: theme.muted }}>
                          <User size={13} />
                          {task.user?.name || 'Unassigned'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Taskboard
