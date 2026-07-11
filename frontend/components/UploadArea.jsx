import React, { useCallback, useState } from 'react';
import styles from './UploadArea.module.css';

const ACCEPTED = ['text/csv', 'application/vnd.ms-excel', '.csv'];

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const SAMPLE_CSV = `created_at,name,email,country_code,mobile_without_country_code,company,city,state,country,lead_owner,crm_status,crm_note,data_source,possession_time,description
2026-05-13 14:20:48,John Doe,john.doe@example.com,+91,9876543210,GrowEasy,Mumbai,Maharashtra,India,owner@example.com,GOOD_LEAD_FOLLOW_UP,Client asked to reschedule demo,,,
2026-05-13 14:25:30,Sarah Johnson,sarah.johnson@example.com,+91,9876543211,Tech Solutions,Bangalore,Karnataka,India,owner@example.com,DID_NOT_CONNECT,"Busy, will retry next week",,,`;

export default function UploadArea({ onFileAccepted }) {
  const [dragging, setDragging] = useState(false);

  const validateAndAccept = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv') && !ACCEPTED.includes(file.type)) {
      alert('Please upload a valid CSV file (.csv)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10 MB.');
      return;
    }
    onFileAccepted(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    validateAndAccept(file);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onFileChange = (e) => {
    validateAndAccept(e.target.files[0]);
    e.target.value = ''; // Reset so same file can be re-selected
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_leads.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.wrapper}>
      <label
        htmlFor="csv-file-input"
        className={`${styles.dropZone} ${dragging ? styles.dragging : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        {/* Animated background rings */}
        <div className={styles.ring1} />
        <div className={styles.ring2} />

        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <svg className={dragging ? styles.iconBounce : ''} width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>

          <div className={styles.text}>
            <h3 className={styles.title}>
              {dragging ? 'Release to upload' : 'Drop your CSV file here'}
            </h3>
            <p className={styles.subtitle}>
              or <span className={styles.browse}>browse files</span> — CSV up to 10 MB
            </p>
          </div>

          <div className={styles.supported}>
            <span className={styles.supportedTag}>Facebook Leads</span>
            <span className={styles.supportedTag}>Google Ads</span>
            <span className={styles.supportedTag}>Excel Exports</span>
            <span className={styles.supportedTag}>Real Estate CRM</span>
            <span className={styles.supportedTag}>Any CSV Format</span>
          </div>
        </div>

        <input
          id="csv-file-input"
          type="file"
          accept=".csv,text/csv"
          onChange={onFileChange}
          className={styles.hiddenInput}
        />
      </label>

      <div className={styles.actions}>
        <button type="button" className="btn btn-secondary" onClick={downloadSample}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Sample CSV
        </button>
        <span className={styles.hint}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          AI will intelligently map columns — no template required
        </span>
      </div>
    </div>
  );
}
