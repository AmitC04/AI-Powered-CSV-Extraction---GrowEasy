import React from 'react';
import styles from './ErrorAlert.module.css';

export default function ErrorAlert({ title, message, onDismiss }) {
  return (
    <div className={styles.alert}>
      <div className={styles.iconWrap}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
      </div>
      {onDismiss && (
        <button className={styles.dismiss} onClick={onDismiss} aria-label="Dismiss">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      )}
    </div>
  );
}
