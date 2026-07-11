import React from 'react';
import styles from './StepIndicator.module.css';

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Preview' },
  { id: 3, label: 'AI Extract' },
  { id: 4, label: 'Results' },
];

export default function StepIndicator({ currentStep }) {
  return (
    <div className={styles.wrapper}>
      {STEPS.map((step, i) => {
        const isDone    = currentStep > step.id;
        const isActive  = currentStep === step.id;
        const isLast    = i === STEPS.length - 1;

        return (
          <React.Fragment key={step.id}>
            <div className={`${styles.step} ${isDone ? styles.done : ''} ${isActive ? styles.active : ''}`}>
              <div className={styles.circle}>
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <span className={styles.label}>{step.label}</span>
            </div>
            {!isLast && (
              <div className={`${styles.connector} ${isDone ? styles.connectorDone : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
