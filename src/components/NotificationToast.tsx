import React from 'react';
import { NotificationItem } from '../types/job';
import { Bell, CheckCircle2, MessageSquare, Calendar, Sparkles, X } from 'lucide-react';

interface NotificationToastProps {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  onAction: (notification: NotificationItem) => void;
}

export const NotificationToastContainer: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
  onAction,
}) => {
  if (notifications.length === 0) return null;

  return (
    <div 
      id="notification-toast-portal" 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {notifications.map((n) => {
        const getIcon = () => {
          switch (n.category) {
            case 'interview':
              return <Calendar className="w-5 h-5 text-amber-600" />;
            case 'message':
              return <MessageSquare className="w-5 h-5 text-indigo-600" />;
            case 'ai_match':
              return <Sparkles className="w-5 h-5 text-purple-600" />;
            case 'application':
              return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
            default:
              return <Bell className="w-5 h-5 text-blue-600" />;
          }
        };

        const getBgGlow = () => {
          switch (n.category) {
            case 'interview':
              return 'border-amber-200 bg-amber-50/95';
            case 'message':
              return 'border-indigo-200 bg-indigo-50/95';
            case 'ai_match':
              return 'border-purple-200 bg-purple-50/95';
            case 'application':
              return 'border-emerald-200 bg-emerald-50/95';
            default:
              return 'border-blue-200 bg-white/95';
          }
        };

        return (
          <div
            key={n.id}
            id={`toast-${n.id}`}
            className={`pointer-events-auto rounded-xl border p-3.5 shadow-xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${getBgGlow()}`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white shadow-sm shrink-0 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Real-Time Alert
                  </span>
                  <button
                    id={`close-toast-${n.id}`}
                    onClick={() => onDismiss(n.id)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {n.message}
                </p>
                {n.actionLabel && (
                  <div className="mt-2.5 flex items-center justify-between">
                    <button
                      id={`toast-action-${n.id}`}
                      onClick={() => onAction(n)}
                      className="text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition shadow-sm"
                    >
                      {n.actionLabel}
                    </button>
                    <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
