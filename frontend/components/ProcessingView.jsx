import React from 'react';
import styles from './ProcessingView.module.css';

const MESSAGES = [
  'Reading column headers…',
  'Analysing data structure…',
  'Sending batches to AI…',
  'Mapping fields intelligently…',
  'Validating extracted records…',
  'Finalising import…',
];

export default function ProcessingView({ progress, totalRows }) {
  const { percent, message, batch, totalBatches } = progress;

  return (
    <div className={styles.container}>
      <div className={styles.glowBall} />

      <div className={styles.body}>
        {/* Animated icon */}
        <div className={styles.iconWrap}>
          <div className={styles.spinRing} />
          <div className={styles.spinRing2} />
          <svg className={styles.bolt} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>

        {/* Title */}
        <div className={styles.textGroup}>
          <h2 className={styles.title}>AI Extraction in Progress</h2>
          <p className={styles.subtitle}>
            {message || 'Analysing your CSV with Groq Llama 3.3…'}
          </p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${percent}%` }}
            >
              <div className={styles.progressShimmer} />
            </div>
          </div>
          <div className={styles.progressLabels}>
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {batch > 0 ? `Batch ${batch} / ${totalBatches}` : 'Starting…'}
            </span>
            <span className={styles.pct}>{Math.round(percent)}%</span>
          </div>
        </div>

        {/* Stats row */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{totalRows}</span>
            <span className={styles.statLabel}>Total Rows</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>{totalBatches || '—'}</span>
            <span className={styles.statLabel}>Batches</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>Groq</span>
            <span className={styles.statLabel}>AI Provider</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statVal}>Llama&nbsp;3.3</span>
            <span className={styles.statLabel}>Model</span>
          </div>
        </div>
      </div>
    </div>
  );
}
