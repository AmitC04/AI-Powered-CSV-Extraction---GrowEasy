import React, { useState } from 'react';
import styles from './PreviewTable.module.css';

const MAX_VISIBLE = 100;

export default function PreviewTable({ columns, rows }) {
  const [search, setSearch] = useState('');

  if (!rows || rows.length === 0) return null;

  const filtered = search
    ? rows.filter(row =>
        Object.values(row).some(v =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      )
    : rows;

  const visible = filtered.slice(0, MAX_VISIBLE);

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <div className={styles.search}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search rows…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <span className={styles.count}>
          {filtered.length !== rows.length
            ? `${filtered.length} of ${rows.length} rows`
            : `${rows.length} rows · ${columns.length} columns`}
        </span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.indexTh}>#</th>
              {columns.map((col) => (
                <th key={col} title={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row, i) => (
              <tr key={i}>
                <td className={`${styles.indexCell} mono`}>{i + 1}</td>
                {columns.map((col) => (
                  <td key={col}>
                    <div className={styles.cell} title={row[col]}>
                      {row[col] ?? <span className={styles.empty}>—</span>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className={styles.noResults}>
                  No rows match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > MAX_VISIBLE && (
        <div className={styles.truncNote}>
          Showing first {MAX_VISIBLE} of {filtered.length} rows. All rows will be processed.
        </div>
      )}
    </div>
  );
}
