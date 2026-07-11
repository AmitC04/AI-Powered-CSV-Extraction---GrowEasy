import React, { useState } from 'react';
import styles from './ResultTable.module.css';

const STATUS_MAP = {
  GOOD_LEAD_FOLLOW_UP: { label: 'Good Lead',    variant: 'success' },
  DID_NOT_CONNECT:     { label: 'No Connect',   variant: 'warning' },
  BAD_LEAD:            { label: 'Bad Lead',      variant: 'error'   },
  SALE_DONE:           { label: 'Sale Done',     variant: 'info'    },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? { label: status || 'Unknown', variant: 'neutral' };
  return <span className={`badge badge-${s.variant}`}>{s.label}</span>;
}

function formatDate(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  if (isNaN(d)) return dt;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function exportCSV(records) {
  const headers = ['created_at','name','email','country_code','mobile_without_country_code','company','city','state','country','lead_owner','crm_status','crm_note','data_source','possession_time','description'];
  const escape = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = [headers.join(','), ...records.map(r => headers.map(h => escape(r[h])).join(','))];
  const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `groweasy_leads_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ResultTable({ data, onReset, fileName }) {
  const { records = [], totalImported = 0, totalSkipped = 0 } = data;
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = records.filter(r => {
    const matchSearch = !search || Object.values(r).some(v =>
      String(v).toLowerCase().includes(search.toLowerCase())
    );
    const matchStatus = statusFilter === 'ALL' || r.crm_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const successRate = totalImported + totalSkipped > 0
    ? Math.round((totalImported / (totalImported + totalSkipped)) * 100)
    : 0;

  return (
    <div className={styles.container}>
      {/* ── STATS ROW ── */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalImported}</span>
            <span className={styles.statLabel}>Imported</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--error-bg)', color: 'var(--error)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalSkipped}</span>
            <span className={styles.statLabel}>Skipped</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{successRate}%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: 'var(--accent-glow)', color: 'var(--accent-400)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalImported + totalSkipped}</span>
            <span className={styles.statLabel}>Total Rows</span>
          </div>
        </div>
      </div>

      {/* ── TABLE SECTION ── */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h2 className={styles.tableTitle}>Extracted CRM Leads</h2>
            {fileName && (
              <p className={styles.tableSub}>From <span className="mono">{fileName}</span></p>
            )}
          </div>
          <div className={styles.tableControls}>
            {/* Status filter */}
            <select
              className={styles.filterSelect}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="GOOD_LEAD_FOLLOW_UP">Good Lead</option>
              <option value="DID_NOT_CONNECT">No Connect</option>
              <option value="BAD_LEAD">Bad Lead</option>
              <option value="SALE_DONE">Sale Done</option>
            </select>

            {/* Search */}
            <div className={styles.searchWrap}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                placeholder="Search records…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Export */}
            <button className="btn btn-secondary" onClick={() => exportCSV(records)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export CSV
            </button>

            {/* New import */}
            <button className="btn btn-ghost" onClick={onReset}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              New Import
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Location</th>
                <th>Status</th>
                <th>Source</th>
                <th>Lead Owner</th>
                <th>Notes</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i}>
                  <td className={`${styles.idxCell} mono`}>{i + 1}</td>
                  <td className={styles.nameCell}>
                    <div className={styles.avatar}>{(row.name || '?').charAt(0).toUpperCase()}</div>
                    <span className={styles.name}>{row.name || '—'}</span>
                  </td>
                  <td>
                    {row.email
                      ? <a href={`mailto:${row.email}`} className={styles.emailLink}>{row.email}</a>
                      : <span className={styles.empty}>—</span>}
                  </td>
                  <td className="mono">
                    {row.mobile_without_country_code
                      ? <span>{row.country_code || ''} {row.mobile_without_country_code}</span>
                      : <span className={styles.empty}>—</span>}
                  </td>
                  <td>{row.company || <span className={styles.empty}>—</span>}</td>
                  <td>
                    {(row.city || row.state || row.country)
                      ? <span className={styles.location}>{[row.city, row.state, row.country].filter(Boolean).join(', ')}</span>
                      : <span className={styles.empty}>—</span>}
                  </td>
                  <td><StatusBadge status={row.crm_status} /></td>
                  <td>
                    {row.data_source
                      ? <span className={styles.sourceTag}>{row.data_source}</span>
                      : <span className={styles.empty}>—</span>}
                  </td>
                  <td>{row.lead_owner || <span className={styles.empty}>—</span>}</td>
                  <td>
                    <div className={styles.noteCell} title={row.crm_note}>
                      {row.crm_note || <span className={styles.empty}>—</span>}
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {formatDate(row.created_at)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="11" className={styles.empty} style={{ padding: '48px', textAlign: 'center' }}>
                    No records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.tableFooter}>
          <span>Showing {filtered.length} of {records.length} records</span>
        </div>
      </div>
    </div>
  );
}
