import React, { useState } from 'react';
import { NotificationItem } from '../types/job';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Radio, 
  Trash2, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface NotificationCenterProps {
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onMarkAllRead: () => void;
  onClearRead: () => void;
  onSimulateNotification: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onNotificationClick,
  onMarkAllRead,
  onClearRead,
  onSimulateNotification,
  soundEnabled,
  onToggleSound,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = notifications.filter((n) => {
    if (selectedCategory === 'all') return true;
    return n.category === selectedCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div id="notification-center-view" className="space-y-6 max-w-4xl mx-auto">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Notifications &amp; Activity Stream
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Real-time alerts for interview schedules, recruiter messages, application changes, and match digests.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            id="toggle-notif-sound-btn"
            onClick={onToggleSound}
            className={`p-2 rounded-xl border transition flex items-center gap-1 text-xs font-semibold ${
              soundEnabled
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500'
            }`}
            title={soundEnabled ? 'Chime sound active' : 'Chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Audio On' : 'Muted'}</span>
          </button>

          {/* Simulate Live Alert Button */}
          <button
            id="trigger-live-alert-btn"
            onClick={onSimulateNotification}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Simulate Live Push Alert</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Bulk Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {[
            { key: 'all', label: 'All Alerts' },
            { key: 'interview', label: 'Interviews' },
            { key: 'message', label: 'Messages' },
            { key: 'ai_match', label: 'Matches' },
            { key: 'application', label: 'Applications' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                selectedCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}

          <button
            onClick={onClearRead}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear read
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center transition-colors">
            <Bell className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No notifications in this category
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Click "Simulate Live Push Alert" above to test incoming events in real time.
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const getIcon = () => {
              switch (notif.category) {
                case 'interview':
                  return <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
                case 'message':
                  return <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
                case 'ai_match':
                  return <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
                default:
                  return <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
              }
            };

            return (
              <div
                key={notif.id}
                id={`notif-item-${notif.id}`}
                onClick={() => onNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-4 ${
                  !notif.read
                    ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 hover:bg-blue-50/90 dark:hover:bg-blue-950/40 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-2xs shrink-0 mt-0.5 border border-slate-100 dark:border-slate-700">
                    {getIcon()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                      <span>{notif.timestamp}</span>
                      <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                        {notif.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {notif.actionLabel && (
                  <button
                    className="shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center gap-1"
                  >
                    <span>{notif.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
