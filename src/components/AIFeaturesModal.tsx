import React, { useState } from 'react';
import { Job, UserProfile } from '../types/job';
import { 
  Sparkles, 
  FileText, 
  CheckCircle, 
  X, 
  Copy, 
  RefreshCw, 
  Zap, 
  MessageSquare, 
  Award, 
  ArrowRight,
  BrainCircuit,
  Sliders,
  Check
} from 'lucide-react';

interface AIFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: Job | null;
  userProfile: UserProfile;
  onSelectJob: (job: Job) => void;
  jobs: Job[];
}

export const AIFeaturesModal: React.FC<AIFeaturesModalProps> = ({
  isOpen,
  onClose,
  selectedJob,
  userProfile,
  onSelectJob,
  jobs,
}) => {
  const [activeTab, setActiveTab] = useState<'match' | 'cover_letter' | 'ats_scanner' | 'mock_interview'>('match');
  const [currentJob, setCurrentJob] = useState<Job>(selectedJob || jobs[0]);
  const [letterTone, setLetterTone] = useState<'professional' | 'energetic' | 'executive'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generated Cover Letter State
  const [coverLetterText, setCoverLetterText] = useState(
    `Dear Hiring Team at ${currentJob?.company || 'the company'},\n\nI am writing to express my strong enthusiasm for the ${currentJob?.title || 'Senior Engineer'} position. With over 7 years of full-stack engineering expertise, specializing in React, TypeScript, high-scale cloud distributed systems, and real-time frontend architectures, I believe my background directly mirrors the technical initiatives outlined in your roadmap.\n\nAt Veloce Cloud Systems, I led an engineering squad standardizing component systems that reduced page latency by 42% and supported multi-tenant streaming services. Furthermore, my hands-on experience integrating modern frontier LLM workflows and low-latency WebSockets positions me to immediately contribute to your engineering velocity.\n\nI welcome the opportunity to discuss how my skill set and architectural discipline will bring lasting value to ${currentJob?.company || 'your team'}.\n\nSincerely,\n${userProfile.name}`
  );

  if (!isOpen) return null;

  const handleGenerateLetter = () => {
    setIsGenerating(true);
    setTimeout(() => {
      let tonePrefix = '';
      if (letterTone === 'energetic') {
        tonePrefix = `I was thrilled to discover the ${currentJob.title} opening at ${currentJob.company}! Your innovative momentum in technology has inspired my own open-source work.`;
      } else if (letterTone === 'executive') {
        tonePrefix = `I am submitting my executive candidacy for the ${currentJob.title} role at ${currentJob.company}. Having driven engineering scalability, high-availability architecture, and engineering mentorship at scale...`;
      } else {
        tonePrefix = `I am pleased to submit my application for the ${currentJob.title} position at ${currentJob.company}. With deep background in full-scale software architecture...`;
      }

      setCoverLetterText(
        `Dear Hiring Manager at ${currentJob.company},\n\n${tonePrefix}\n\nOver the course of my career, I have dedicated myself to mastering TypeScript, cloud systems, and responsive user experiences. My recent accomplishments include optimizing high-throughput distributed systems and architecting real-time interfaces that handle millions of daily events.\n\n${currentJob.company}'s commitment to engineering excellence aligns seamlessly with my philosophy. I look forward to connecting with your team to review my portfolio and technical approach in detail.\n\nWarm regards,\n${userProfile.name}\n${userProfile.email} | ${userProfile.phone}`
      );
      setIsGenerating(false);
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(coverLetterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      id="ai-features-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div 
        id="ai-features-dialog"
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden transition-colors"
      >
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">
                  Career Intelligence Suite
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Job Match Breakdown • Cover Letter Studio • ATS Resume Scanner • Interview Coach
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 px-6 py-2.5 gap-2">
          <div className="flex items-center gap-2">
            <button
              id="ai-tab-match"
              onClick={() => setActiveTab('match')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'match'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Job Fit Analyzer</span>
            </button>

            <button
              id="ai-tab-cover-letter"
              onClick={() => setActiveTab('cover_letter')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'cover_letter'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tailored Cover Letter</span>
            </button>

            <button
              id="ai-tab-ats-scanner"
              onClick={() => setActiveTab('ats_scanner')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'ats_scanner'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>ATS Resume Scanner (94%)</span>
            </button>

            <button
              id="ai-tab-mock-interview"
              onClick={() => setActiveTab('mock_interview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'mock_interview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mock Interview Prep</span>
            </button>
          </div>

          {/* Job Picker selector for contextual AI */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold">Context Job:</span>
            <select
              value={currentJob?.id}
              onChange={(e) => {
                const j = jobs.find((x) => x.id === e.target.value);
                if (j) setCurrentJob(j);
              }}
              className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-slate-800 dark:text-white"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.company} - {j.title.substring(0, 24)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tab 1: AI Job Fit Breakdown */}
        {activeTab === 'match' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            <div className="flex flex-wrap items-center justify-between p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md">
                  {currentJob.matchScore}%
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Strong Candidate Match
                  </h3>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    High qualification overlap for {currentJob.title} at {currentJob.company}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 shadow-2xs">
                Top 5% of applicants
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 space-y-2">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Matched Strengths (8/8)
                </h4>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>7+ years React &amp; TypeScript production systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Real-time WebSockets &amp; state synchronization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Modern cloud architectures &amp; microservices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>Target salary within posted budget (${currentJob.salaryMin.toLocaleString()}+)</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  AI Optimization Suggestions
                </h4>
                <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Highlight performance metrics (e.g. 42% latency reduction) in application note</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                    <span>Mention your experience with CI/CD and deployment pipelines</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Tailored Cover Letter Generator */}
        {activeTab === 'cover_letter' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">Tone of Voice:</span>
                {(['professional', 'energetic', 'executive'] as const).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setLetterTone(tone)}
                    className={`px-3 py-1 rounded-lg capitalize font-semibold transition ${
                      letterTone === tone
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerateLetter}
                  disabled={isGenerating}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={11}
              value={coverLetterText}
              onChange={(e) => setCoverLetterText(e.target.value)}
              className="w-full p-4 text-xs sm:text-sm font-mono border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/80 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 leading-relaxed text-slate-800 dark:text-slate-200"
            />
          </div>
        )}

        {/* Tab 3: ATS Resume Scanner */}
        {activeTab === 'ats_scanner' && (
          <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            <div className="flex items-center justify-between p-5 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-extrabold shadow-md">
                  <span className="text-xl leading-none">94</span>
                  <span className="text-[10px] font-medium opacity-90">/ 100</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-emerald-950 dark:text-emerald-300">
                    Resume ATS Compatibility: Exceptional
                  </h3>
                  <p className="text-emerald-800 dark:text-emerald-400 mt-0.5">
                    File: <span className="font-bold">{userProfile.resumeFileName}</span>
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Passes Greenhouse, Lever, Workday, and Taleo parsing algorithms with zero formatting errors.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">Keyword Density</span>
                <p className="text-lg font-extrabold text-blue-600 dark:text-blue-400 mt-1">98%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Key software skills identified</p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">Action Verb Power</span>
                <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400 mt-1">92%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">High XYZ metric formulas</p>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">Structure &amp; Layout</span>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">96%</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Single-column standard PDF</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Mock Interview Prep */}
        {activeTab === 'mock_interview' && (
          <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Interview Prep for: {currentJob.title}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mt-0.5">
                Practice answering these predicted technical and behavioral questions tailored specifically for {currentJob.company}.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
                  <span>Q1: Technical Architecture &amp; Real-Time Sync</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300">System Design</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "How would you design an interface and WebSocket protocol to stream AI LLM tokens with pause/resume support and client reconnection recovery?"
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-blue-700 dark:text-blue-400">Model Answer Strategy:</span> Mention Server-Sent Events (SSE) vs WebSockets, cursor sequence IDs for deduplication, backpressure handling, and optimistic client cache updates.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white text-sm">
                  <span>Q2: Cross-Functional Team Leadership</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">Behavioral</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "Tell me about a time you had to align conflicting priorities between product management and engineering tech debt."
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/80 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-blue-700 dark:text-blue-400">Model Answer Strategy:</span> Use the STAR format. Quantify the risk of technical debt on user retention, propose a dedicated 20% sprint allocation, and demonstrate customer-centric thinking.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
          >
            Close Intelligence Suite
          </button>
        </div>

      </div>
    </div>
  );
};
