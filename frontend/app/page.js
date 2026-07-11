"use client";

import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import UploadArea from '../components/UploadArea';
import PreviewTable from '../components/PreviewTable';
import ResultTable from '../components/ResultTable';
import ProcessingView from '../components/ProcessingView';
import StepIndicator from '../components/StepIndicator';
import ErrorAlert from '../components/ErrorAlert';
import styles from './page.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';


// Steps
const STEPS = {
  UPLOAD: 1,
  PREVIEW: 2,
  PROCESSING: 3,
  RESULTS: 4,
};

export default function Home() {
  const [step, setStep] = useState(STEPS.UPLOAD);
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState({ columns: [], rows: [] });
  const [progress, setProgress] = useState({ percent: 0, message: '', batch: 0, totalBatches: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  /* ─── File Parsed ─── */
  const handleFileAccepted = useCallback((uploadedFile) => {
    setError(null);
    setFile(uploadedFile);

    Papa.parse(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data, meta }) => {
        if (!data.length) {
          setError({ title: 'Empty File', message: 'The CSV file contains no data rows.' });
          return;
        }
        setParsedData({ columns: meta.fields || [], rows: data });
        setStep(STEPS.PREVIEW);
      },
      error: (err) => {
        setError({ title: 'Parse Error', message: err.message });
      },
    });
  }, []);

  /* ─── Execute AI Pipeline ─── */
  const handleConfirmImport = useCallback(async () => {
    setError(null);
    setStep(STEPS.PROCESSING);
    setProgress({ percent: 0, message: 'Initialising pipeline…', batch: 0, totalBatches: 0 });

    const MAX_RETRIES = 3;

    const attemptRequest = async (attempt = 1) => {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch(`${API_URL}/api/process`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          let msg = `Server error (${res.status})`;
          try { const j = await res.json(); msg = j.error || msg; } catch (_) {}
          throw Object.assign(new Error(msg), { status: res.status });
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const chunks = buffer.split('\n\n');
          buffer = chunks.pop();

          for (const chunk of chunks) {
            if (!chunk.trim()) continue;
            let type = 'message', dataStr = '';
            for (const line of chunk.split('\n')) {
              if (line.startsWith('event: ')) type = line.slice(7).trim();
              else if (line.startsWith('data: ')) dataStr = line.slice(6);
            }
            if (!dataStr) continue;

            let payload;
            try { payload = JSON.parse(dataStr); } catch (_) { continue; }

            if (type === 'progress') {
              setProgress({
                percent: payload.percent ?? 0,
                message: payload.message ?? '',
                batch: payload.batch ?? 0,
                totalBatches: payload.totalBatches ?? 0,
              });
            } else if (type === 'complete') {
              setResult(payload.data);
              setStep(STEPS.RESULTS);
            } else if (type === 'error') {
              throw new Error(payload.message || 'AI extraction failed.');
            }
          }
        }
      } catch (err) {
        if (attempt < MAX_RETRIES && err.status !== 400 && err.status !== 401) {
          setProgress(p => ({
            ...p,
            message: `Retrying… (attempt ${attempt + 1}/${MAX_RETRIES})`,
          }));
          await new Promise(r => setTimeout(r, 1500 * attempt));
          return attemptRequest(attempt + 1);
        }

        // Friendly error messages
        let title = 'Pipeline Error';
        let message = err.message;
        if (message.includes('Invalid API Key') || message.includes('invalid_api_key')) {
          title = 'Authentication Error';
          message = 'The Groq API key is invalid or expired. Update GROQ_API_KEY in backend/.env and restart the server.';
        } else if (message.includes('decommissioned') || message.includes('model_decommissioned')) {
          title = 'Model Deprecated';
          message = 'The AI model has been deprecated. Please update the model in backend/services/ai.service.js.';
        } else if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
          title = 'Connection Error';
          message = 'Cannot reach the backend server. Make sure it is running on http://localhost:3001.';
        }
        setError({ title, message });
        setStep(STEPS.PREVIEW);
      }
    };

    await attemptRequest();
  }, [file]);

  /* ─── Reset ─── */
  const handleReset = useCallback(() => {
    setStep(STEPS.UPLOAD);
    setFile(null);
    setParsedData({ columns: [], rows: [] });
    setProgress({ percent: 0, message: '', batch: 0, totalBatches: 0 });
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className={styles.page}>
      {/* ── TOP NAV ── */}
      <header className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </span>
            <span className={styles.logoName}>GrowEasy</span>
            <span className={styles.logoPill}>AI Importer</span>
          </div>
          <nav className={styles.navLinks}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.navLink}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        {/* ── HERO ── */}
        {step === STEPS.UPLOAD && (
          <div className={`${styles.hero} animate-in`}>
            <div className={styles.heroTag}>✦ AI-Powered CSV Extraction</div>
            <h1 className={styles.heroTitle}>
              Turn any CSV into<br />
              <span className={styles.heroAccent}>CRM-ready leads</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Upload a CSV from Facebook, Google Ads, Excel, or any source.<br />
              Our AI intelligently maps and extracts every field — no configuration needed.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.stat}><span className={styles.statNum}>15+</span><span className={styles.statLabel}>CRM Fields</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>Any</span><span className={styles.statLabel}>CSV Format</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><span className={styles.statNum}>AI</span><span className={styles.statLabel}>Auto-Mapping</span></div>
            </div>
          </div>
        )}

        {/* ── STEP INDICATOR (steps 2-4) ── */}
        {step > STEPS.UPLOAD && (
          <StepIndicator currentStep={step} />
        )}

        {/* ── ERROR ALERT ── */}
        {error && (
          <ErrorAlert
            title={error.title}
            message={error.message}
            onDismiss={() => setError(null)}
          />
        )}

        {/* ── UPLOAD ZONE ── */}
        {step === STEPS.UPLOAD && (
          <div className={`${styles.stepCard} animate-in`} style={{ animationDelay: '0.15s' }}>
            <UploadArea onFileAccepted={handleFileAccepted} />
          </div>
        )}

        {/* ── PREVIEW ── */}
        {step === STEPS.PREVIEW && (
          <div className={`${styles.stepCard} animate-in`}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Data Preview</h2>
                <p className={styles.cardSub}>
                  <span className="mono">{file?.name}</span>
                  {' · '}
                  <span className={styles.highlight}>{parsedData.rows.length} rows</span>
                  {' · '}
                  {parsedData.columns.length} columns
                  {' · '}
                  {(file?.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <div className={styles.cardActions}>
                <button className="btn btn-ghost" onClick={handleReset}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Start Over
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleConfirmImport}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
                  Run AI Extraction
                </button>
              </div>
            </div>
            <PreviewTable columns={parsedData.columns} rows={parsedData.rows} />
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step === STEPS.PROCESSING && (
          <div className={`${styles.stepCard} animate-in`}>
            <ProcessingView progress={progress} totalRows={parsedData.rows.length} />
          </div>
        )}

        {/* ── RESULTS ── */}
        {step === STEPS.RESULTS && result && (
          <div className="animate-in">
            <ResultTable data={result} onReset={handleReset} fileName={file?.name} />
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <span>Built for GrowEasy by a passionate engineer</span>
        <span className={styles.footerDot}>·</span>
        <span>Powered by Groq · llama-3.3-70b-versatile</span>
      </footer>
    </div>
  );
}
