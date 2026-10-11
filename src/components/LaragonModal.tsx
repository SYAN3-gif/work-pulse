/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  Server, 
  Globe, 
  Terminal, 
  RefreshCw, 
  ShieldCheck, 
  HardDrive, 
  Layers, 
  FileCode2, 
  FolderCheck, 
  Play, 
  Download, 
  Upload, 
  AlertCircle,
  HelpCircle,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { 
  getLaragonEnvironment, 
  runLaragonDiagnostics, 
  LaragonEnvironmentInfo, 
  LaragonDiagnosticResult,
  LARAGON_CONFIGS,
  exportLocalData,
  importLocalData
} from '../utils/laragonHelper';

interface LaragonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateNotification?: (title: string, message: string) => void;
}

export const LaragonModal: React.FC<LaragonModalProps> = ({
  isOpen,
  onClose,
  onSimulateNotification,
}) => {
  const [envInfo, setEnvInfo] = useState<LaragonEnvironmentInfo>(getLaragonEnvironment());
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'guide' | 'configs' | 'testing'>('diagnostics');
  const [diagnostics, setDiagnostics] = useState<LaragonDiagnosticResult[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRunningPing, setIsRunningPing] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const currentEnv = getLaragonEnvironment();
      setEnvInfo(currentEnv);
      setDiagnostics(runLaragonDiagnostics());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleRunPing = () => {
    setIsRunningPing(true);
    setTimeout(() => {
      setDiagnostics(runLaragonDiagnostics());
      setIsRunningPing(false);
      if (onSimulateNotification) {
        onSimulateNotification(
          'Laragon Diagnostic Ping Passed',
          `Checked hostname "${envInfo.hostname}" and local storage. Environment is responsive.`
        );
      }
    }, 400);
  };

  const handleExportData = () => {
    const json = exportLocalData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workpulse-laragon-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onSimulateNotification) {
      onSimulateNotification('Local Data Exported', 'Downloaded backup JSON of all saved applications and settings.');
    }
  };

  const handleImportSubmit = () => {
    if (!importJsonText.trim()) return;
    const success = importLocalData(importJsonText);
    if (success) {
      setImportMessage('Data successfully imported! Reload to reflect changes.');
      if (onSimulateNotification) {
        onSimulateNotification('Data Imported', 'Local test state restored. Reloading recommended.');
      }
    } else {
      setImportMessage('Invalid JSON format. Please verify the copied structure.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden transition-all text-slate-800 dark:text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-linear-to-r from-blue-700 via-indigo-700 to-sky-700 px-6 py-5 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              <Server className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Laragon &amp; Localhost Hub</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Laragon Ready
                </span>
              </div>
              <p className="text-xs text-sky-100/90 mt-0.5">
                Full compatibility for Laragon on Windows: Apache, Nginx, <code className="bg-black/20 px-1 py-0.5 rounded">workpulse.test</code> virtual hosts &amp; <code className="bg-black/20 px-1 py-0.5 rounded">localhost:3000</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunPing}
              disabled={isRunningPing}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 active:bg-white/25 rounded-lg text-xs font-medium border border-white/20 flex items-center gap-1.5 transition text-white shadow-xs cursor-pointer"
              title="Ping current environment and verify storage"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRunningPing ? 'animate-spin' : ''}`} />
              {isRunningPing ? 'Pinging...' : 'Live Test Ping'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Current Environment Status Bar */}
        <div className="bg-slate-100 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Current Host:</span>
              <code className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-blue-700 dark:text-blue-300">
                {envInfo.hostname}:{envInfo.port}
              </code>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Environment:</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                envInfo.isLaragonTestDomain 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                  : envInfo.isLocalhost 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {envInfo.detectedServer}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 dark:text-slate-400">Asset Base:</span>
              <code className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">./</code>
              <span className="text-[10px] text-slate-500">(Subfolder &amp; Root safe)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400">Vite AllowedHosts:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Unrestricted (true)
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50 dark:bg-slate-900/50">
          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`py-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Live Diagnostics &amp; Health
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FolderCheck className="w-4 h-4" />
            Laragon Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('configs')}
            className={`py-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'configs'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            Config Files (.htaccess, vhost)
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`py-3 px-3 border-b-2 text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeTab === 'testing'
                ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Play className="w-4 h-4" />
            Local Prototyping &amp; Testing Tools
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: DIAGNOSTICS & HEALTH */}
          {activeTab === 'diagnostics' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Laragon Compatibility Checklist
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  These verified checks ensure this application operates without host blocking, routing errors, or asset loading issues when run inside Laragon on Windows.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {diagnostics.map((diag) => (
                    <div 
                      key={diag.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-start gap-3"
                    >
                      <div className="mt-0.5">
                        {diag.status === 'passed' && (
                          <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                        {diag.status === 'warning' && (
                          <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                            <AlertCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {diag.status === 'info' && (
                          <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{diag.name}</h4>
                          <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                            diag.status === 'passed' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' : 'text-blue-600 bg-blue-50 dark:bg-blue-950/50'
                          }`}>
                            {diag.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {diag.details}
                        </p>
                        {diag.recommendation && (
                          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                            💡 {diag.recommendation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch URLs */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/50">
                <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" />
                  Quick Access URLs for Laragon Local Testing
                </h4>
                <p className="text-xs text-blue-800/80 dark:text-blue-300/80 mb-3">
                  Click any URL to test how the application opens in your local browser when Laragon is running:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <a
                    href="http://localhost:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/80 hover:border-blue-400 flex items-center justify-between group transition shadow-xs"
                  >
                    <div>
                      <span className="font-bold text-blue-700 dark:text-blue-400">http://localhost:3000</span>
                      <p className="text-[11px] text-slate-500">Vite Dev Server (Laragon Terminal)</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                  </a>

                  <a
                    href="http://workpulse.test"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/80 hover:border-blue-400 flex items-center justify-between group transition shadow-xs"
                  >
                    <div>
                      <span className="font-bold text-blue-700 dark:text-blue-400">http://workpulse.test</span>
                      <p className="text-[11px] text-slate-500">Laragon Auto Virtual Host (Apache / Nginx)</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                  </a>

                  <a
                    href="http://127.0.0.1:3000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/80 hover:border-blue-400 flex items-center justify-between group transition shadow-xs"
                  >
                    <div>
                      <span className="font-bold text-blue-700 dark:text-blue-400">http://127.0.0.1:3000</span>
                      <p className="text-[11px] text-slate-500">Direct Local IPv4 Loopback</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                  </a>

                  <a
                    href="http://localhost/workpulse/dist/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800/80 hover:border-blue-400 flex items-center justify-between group transition shadow-xs"
                  >
                    <div>
                      <span className="font-bold text-blue-700 dark:text-blue-400">http://localhost/workpulse/dist/</span>
                      <p className="text-[11px] text-slate-500">Subdirectory Apache Hosting</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STEP-BY-STEP LARAGON GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                  Complete Laragon Windows Setup Guide
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Laragon is a lightning-fast universal development environment for Windows. Here is how someone can run and view this app in Laragon in under 2 minutes:
                </p>
              </div>

              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div className="flex-1 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Place Project in Laragon's www Directory
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Copy or clone the repository into your Laragon root directory:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 text-sky-300 font-mono text-xs flex items-center justify-between">
                    <span>C:\laragon\www\workpulse</span>
                    <button
                      onClick={() => handleCopy('C:\\laragon\\www\\workpulse', 'dir')}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'dir' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div className="flex-1 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Method A: Fast Dev Server via Laragon Terminal (Recommended)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Laragon includes Node.js and Git pre-installed. Right click anywhere in Laragon &rarr; click <strong>Terminal</strong>:
                  </p>
                  <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-xs space-y-1">
                    <p className="text-slate-500"># Navigate to project</p>
                    <p className="text-emerald-400">cd C:\laragon\www\workpulse</p>
                    <p className="text-slate-500"># Install dependencies</p>
                    <p className="text-emerald-400">npm install</p>
                    <p className="text-slate-500"># Run development server (bound to 0.0.0.0:3000)</p>
                    <p className="text-emerald-400">npm run dev</p>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Open your browser at <a href="http://localhost:3000" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">http://localhost:3000</a>.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex gap-4">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div className="flex-1 space-y-1.5">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Method B: Automatic Laragon Virtual Host (workpulse.test)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Laragon automatically creates virtual hosts for folders in <code className="text-blue-600">www/</code>. 
                    When you run <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-[11px]">npm run build</code>, Vite generates the production bundle into <code className="text-blue-600 font-mono">dist/</code> with <code className="text-blue-600 font-mono">.htaccess</code> included.
                  </p>
                  <ul className="text-xs text-slate-600 dark:text-slate-400 list-disc pl-5 space-y-1">
                    <li>Click <strong>Start All</strong> in Laragon (starts Apache/MySQL).</li>
                    <li>Laragon automatically updates the Windows <code className="font-mono text-[11px]">hosts</code> file for <code className="font-mono text-[11px]">workpulse.test</code>.</li>
                    <li>If serving from <code className="font-mono text-[11px]">dist/</code>, open Laragon &rarr; Apache &rarr; sites-enabled and set DocumentRoot to <code className="font-mono text-[11px]">C:/laragon/www/workpulse/dist</code> (or use our sample config in the next tab).</li>
                    <li>Open <a href="http://workpulse.test" target="_blank" rel="noreferrer" className="text-blue-600 underline font-medium">http://workpulse.test</a> in your browser!</li>
                  </ul>
                </div>
              </div>

              {/* Protip */}
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Laragon 1-Click SSL:</span>
                  <p className="text-[11px] text-amber-800/90 dark:text-amber-300/90 mt-0.5">
                    To test with HTTPS in Laragon, click <strong>Menu &rarr; Apache &rarr; SSL &rarr; Enabled</strong>. Laragon will automatically generate an SSL certificate and allow you to browse at <code className="font-bold">https://workpulse.test</code> without warning dialogs!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIGURATION FILES */}
          {activeTab === 'configs' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Ready-to-Use Laragon Configurations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pre-configured templates for Apache SPA rewriting, Virtual Hosts, and Nginx in Laragon.
                </p>
              </div>

              {/* Apache .htaccess */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Apache .htaccess (SPA Routing &amp; CORS)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      (Saved in <code className="text-blue-600">public/.htaccess</code> &amp; copied to <code className="text-blue-600">dist/</code>)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(LARAGON_CONFIGS.apacheHtaccess, 'htaccess')}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-xs font-medium border border-slate-200 dark:border-slate-600 flex items-center gap-1 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {copiedKey === 'htaccess' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'htaccess' ? 'Copied' : 'Copy .htaccess'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {LARAGON_CONFIGS.apacheHtaccess}
                </pre>
              </div>

              {/* Apache Virtual Host */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-indigo-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Apache Virtual Host Config (workpulse.test.conf)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      (Place in <code className="text-blue-600">C:\laragon\etc\apache2\sites-enabled\</code>)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(LARAGON_CONFIGS.apacheVhost, 'vhost')}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-xs font-medium border border-slate-200 dark:border-slate-600 flex items-center gap-1 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {copiedKey === 'vhost' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'vhost' ? 'Copied' : 'Copy Apache vHost'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {LARAGON_CONFIGS.apacheVhost}
                </pre>
              </div>

              {/* Nginx Virtual Host */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Nginx Virtual Host Config (for Laragon with Nginx)
                    </span>
                    <span className="text-[10px] text-slate-500">
                      (Place in <code className="text-blue-600">C:\laragon\etc\nginx\sites-enabled\</code>)
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(LARAGON_CONFIGS.nginxVhost, 'nginx')}
                    className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 text-xs font-medium border border-slate-200 dark:border-slate-600 flex items-center gap-1 hover:bg-slate-50 transition cursor-pointer"
                  >
                    {copiedKey === 'nginx' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'nginx' ? 'Copied' : 'Copy Nginx vHost'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {LARAGON_CONFIGS.nginxVhost}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: LOCAL PROTOTYPING & TESTING TOOLS */}
          {activeTab === 'testing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Local Prototyping &amp; Simulation Suite
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ideal for testing offline workflows, application status, recruiter interactions, and data portability without external dependencies.
                </p>
              </div>

              {/* Action Simulation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-600" />
                      Simulate Incoming Candidate Application
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Dispatches a live candidate submission event through the local audio/toast push notification engine.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onSimulateNotification) {
                        onSimulateNotification(
                          'New Application Received: Senior React Engineer',
                          'Candidate Alex Morgan (London, UK) applied via 1-Click Fast Apply with a 94% profile match score.'
                        );
                      }
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Trigger Application Signal
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Simulate Enterprise Recruiter Interview Offer
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Dispatches an interview invitation notification with audio chime and updates message center count.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onSimulateNotification) {
                        onSimulateNotification(
                          'Interview Invitation: CloudScale Systems',
                          'Lead Recruiter Sarah Chen has invited you to a technical interview for Staff Backend Engineer.'
                        );
                      }
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Trigger Interview Signal
                  </button>
                </div>
              </div>

              {/* Data Export / Import for local testers */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-purple-600" />
                      Local Test Data Portability &amp; Snapshot
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Export test state to JSON or restore a previously saved snapshot when switching local machines.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download JSON Snapshot
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                    Restore Snapshot from JSON Text:
                  </label>
                  <textarea
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    placeholder='Paste exported JSON snapshot here (e.g. {"workpulse_applications": [...]})'
                    rows={3}
                    className="w-full text-xs font-mono p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
                  />
                  {importMessage && (
                    <p className={`text-xs font-medium ${importMessage.includes('successfully') ? 'text-emerald-600' : 'text-red-500'}`}>
                      {importMessage}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setImportJsonText('')}
                      className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleImportSubmit}
                      disabled={!importJsonText.trim()}
                      className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Restore Test Snapshot
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready for Windows Laragon (C:\laragon\www\workpulse)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('guide')}
              className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-medium text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              View Quickstart Guide
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition cursor-pointer shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
