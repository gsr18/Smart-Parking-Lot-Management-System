import React, { useState } from 'react';
import { X, Send, Bot, Sparkles, User, RefreshCw, HelpCircle, Layers, BarChart3, Clock, ShieldCheck, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParkingStore } from '../../store/useParkingStore';
import { aiService } from '../../services/aiService';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedActions?: string[];
  timestamp: string;
}

export const AiChatDrawer: React.FC = () => {
  const { isAiDrawerOpen, toggleAiDrawer } = useParkingStore();
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Hello! I am your **SmartParking AI Knowledge Assistant**. Ask me anything about how to use the web app, gate operations, reports & financials, slot layout configuration, or shift management!',
      suggestedActions: [
        'What is SmartParking?',
        'How to Check-In & Check-Out',
        'Explain Reports & Financials',
        'How Shift Console works?',
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    { label: 'System Overview', query: 'What is SmartParking?', icon: HelpCircle },
    { label: 'Gate Guide', query: 'How to Check-In & Check-Out', icon: Layers },
    { label: 'Financials & Reports', query: 'Explain Reports & Financials', icon: BarChart3 },
    { label: 'Shift Console', query: 'How Shift Console works?', icon: Clock },
    { label: 'Layout Config', query: 'How to configure slot layout?', icon: ShieldCheck },
    { label: 'Shortcuts', query: 'Available keyboard shortcuts', icon: Command },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await aiService.chatQuery(text);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiResponse.response,
        suggestedActions: aiResponse.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Apologies, I encountered an issue connecting to the AI Assistant service. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Helper to format inline bold text (**text**) and inline code (`code`) for both light/dark mode
   */
  const formatInlineText = (line: string) => {
    const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-[#0891b2] dark:text-[#38bdf8] font-black dark:font-extrabold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <kbd
            key={index}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-purple-100 dark:bg-[#522377]/80 border border-purple-300 dark:border-[#c084fc]/40 text-purple-800 dark:text-[#f5d0fe] font-mono text-[10px] font-bold"
          >
            {part.slice(1, -1)}
          </kbd>
        );
      }
      return part;
    });
  };

  /**
   * Helper to parse markdown text into rich structured React components for both light/dark mode
   */
  const renderRichText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          // Heading line (e.g. ### Title)
          if (trimmed.startsWith('###') || trimmed.startsWith('##')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <div
                key={idx}
                className="mt-2 mb-1.5 pb-1 border-b border-cyan-200 dark:border-cyan-500/30 font-black text-sm text-[#0891b2] dark:text-[#38bdf8] flex items-center gap-1.5 tracking-wide"
              >
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0" />
                <span>{headingText}</span>
              </div>
            );
          }

          // Bullet list line (e.g. - item or 1. item)
          if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
            const listContent = trimmed.replace(/^[-*\d.]+\s*/, '');
            return (
              <div
                key={idx}
                className="flex items-start gap-2 my-1 bg-white/80 dark:bg-[#080b38]/70 p-2 rounded-xl border border-cyan-200 dark:border-cyan-500/20 shadow-xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#0891b2] dark:bg-[#38bdf8] shrink-0 mt-1.5 shadow-xs" />
                <div className="flex-1 text-[11px] text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
                  {formatInlineText(listContent)}
                </div>
              </div>
            );
          }

          // Normal Paragraph line
          return (
            <p key={idx} className="text-xs text-slate-800 dark:text-slate-100 leading-relaxed font-sans">
              {formatInlineText(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isAiDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleAiDrawer}
            className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/70 backdrop-blur-md z-40"
          />

          {/* Slide-over Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 h-screen w-full max-w-md bg-white/95 dark:bg-[#080b38]/95 border-l border-slate-200 dark:border-[#522377]/60 z-50 flex flex-col shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-[#522377]/50 flex items-center justify-between bg-[#f3f9fc] dark:bg-[#133155]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#0891b2] via-[#06b6d4] to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20 border border-white/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-[#0f172a] dark:text-white flex items-center gap-1.5 tracking-wide">
                    SmartParking AI Assistant
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
                  </h3>
                  <p className="text-[10px] text-[#0891b2] dark:text-[#38bdf8] font-mono font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping" />
                    ● ONLINE | AI HEURISTIC ENGINE
                  </p>
                </div>
              </div>
              <button
                onClick={toggleAiDrawer}
                className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Category Chips Carousel */}
            <div className="px-4 py-2.5 bg-slate-100/80 dark:bg-[#080b38]/60 border-b border-slate-200 dark:border-[#522377]/30 flex items-center gap-2 overflow-x-auto no-scrollbar select-none">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.query)}
                  className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-[#133155]/80 hover:bg-[#cfeef1]/60 dark:hover:bg-[#522377]/60 border border-slate-300 dark:border-[#254d70] hover:border-[#0891b2] dark:hover:border-[#38bdf8] text-[11px] font-mono text-[#0e7490] dark:text-cyan-200 hover:text-[#0f172a] dark:hover:text-white transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <item.icon className="w-3 h-3 text-[#0891b2] dark:text-[#38bdf8]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-500/40 text-[#0891b2] dark:text-[#38bdf8] flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[90%] rounded-2xl p-4 text-xs shadow-md transition-all ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#0891b2] to-[#06b6d4] dark:from-purple-600 dark:to-indigo-600 text-white rounded-tr-none shadow-cyan-900/20 dark:shadow-purple-900/30'
                        : 'bg-[#f0f9ff] dark:bg-[#0f172a]/95 border-l-4 border-l-[#0891b2] dark:border-l-[#38bdf8] border border-cyan-200 dark:border-cyan-500/20 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-cyan-950/20'
                    }`}
                  >
                    {msg.sender === 'ai' ? (
                      renderRichText(msg.text)
                    ) : (
                      <p className="whitespace-pre-line leading-relaxed text-xs">{msg.text}</p>
                    )}

                    {/* Suggested Actions */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(action)}
                            className="px-3 py-1.5 rounded-full bg-white dark:bg-[#133155] hover:bg-[#cfeef1] dark:hover:bg-[#522377] border border-cyan-300 dark:border-cyan-500/30 hover:border-[#0891b2] dark:hover:border-cyan-400 text-[#0e7490] dark:text-cyan-200 hover:text-[#0f172a] dark:hover:text-white transition-all text-[11px] font-bold shadow-xs hover:scale-105"
                          >
                            + {action}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className="block text-[9px] text-slate-400 dark:text-slate-400 text-right mt-2 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-500/20 border border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-[#0e7490] dark:text-cyan-300 bg-[#f3f9fc] dark:bg-[#133155]/80 p-3.5 rounded-2xl border border-cyan-300 dark:border-cyan-500/40 w-fit shadow-md animate-pulse">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0891b2] dark:text-[#38bdf8]" />
                  <span className="font-mono font-bold">AI Knowledge Engine is compiling response...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-slate-200 dark:border-[#522377]/50 bg-[#f3f9fc] dark:bg-[#133155]/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask AI about how to use, gate ops, reports, slots..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-[#080b38] border border-slate-300 dark:border-[#254d70] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0891b2] dark:focus:border-[#38bdf8] placeholder-slate-400 font-sans shadow-xs"
                />
                <button
                  type="submit"
                  disabled={isLoading || !inputMessage.trim()}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-[#0891b2] to-purple-600 hover:from-[#06b6d4] hover:to-purple-500 text-white shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
