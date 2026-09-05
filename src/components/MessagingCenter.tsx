import React, { useState } from 'react';
import { Conversation, ChatMessage } from '../types/job';
import { 
  Send, 
  Paperclip, 
  Calendar, 
  Building2, 
  CheckCheck, 
  FileText, 
  Smile, 
  MoreVertical, 
  Search, 
  Video 
} from 'lucide-react';

interface MessagingCenterProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => void;
}

export const MessagingCenter: React.FC<MessagingCenterProps> = ({
  conversations,
  onSendMessage,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConversation) return;

    onSendMessage(activeConversation.id, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!activeConversation) return;
    onSendMessage(activeConversation.id, text);
  };

  const filteredConversations = conversations.filter((c) =>
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participantCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="messaging-center-view" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[640px] flex flex-col md:flex-row transition-colors">
      
      {/* Left Sidebar: Conversations List */}
      <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/90">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">
            Messages
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConvId;
            return (
              <div
                key={conv.id}
                id={`conversation-item-${conv.id}`}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-3.5 cursor-pointer transition flex items-start gap-3 text-left ${
                  isSelected
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-l-4 border-blue-600'
                    : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participantAvatar}
                    alt={conv.participantName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {conv.participantName}
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {conv.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 truncate">
                    {conv.participantCompany} • {conv.participantRole}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-1">
                    {conv.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Active Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeConversation.participantName}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300">
                    {activeConversation.participantCompany}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Regarding: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeConversation.jobTitle}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert(`Starting video meeting with ${activeConversation.participantName}...`)}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Schedule Video Call"
              >
                <Video className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          </div>

          {/* Messages Scroll View */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/40">
            {activeConversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.isRecruiter ? 'mr-auto' : 'ml-auto flex-row-reverse'
                }`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                />
                <div>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      msg.isRecruiter
                        ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs rounded-tl-xs'
                        : 'bg-blue-600 text-white shadow-xs rounded-tr-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Attachment preview if any */}
                    {msg.attachment && (
                      <div className="mt-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-bold truncate">{msg.attachment.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-400">{msg.attachment.size}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-slate-500 ${
                      msg.isRecruiter ? 'justify-start' : 'justify-end'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {!msg.isRecruiter && <CheckCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Reply Suggestions */}
          <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
              Quick Reply:
            </span>
            <button
              onClick={() => handleQuickReply('Yes, that time works perfectly for me! Looking forward to it.')}
              className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition"
            >
              "Yes, that time works perfectly!"
            </button>
            <button
              onClick={() => handleQuickReply('Could we reschedule to 2:00 PM PST if possible?')}
              className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition"
            >
              "Could we reschedule to 2 PM?"
            </button>
            <button
              onClick={() => handleQuickReply('Thank you! I have uploaded the updated portfolio slides.')}
              className="px-2.5 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition"
            >
              "Attached updated portfolio"
            </button>
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              id="chat-message-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your reply to recruiter..."
              className="flex-1 px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
          Select a conversation to begin messaging
        </div>
      )}

    </div>
  );
};
