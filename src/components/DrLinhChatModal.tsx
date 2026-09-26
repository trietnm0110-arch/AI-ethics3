import React, { useEffect, useRef, useState } from 'react';
import { Bot, Moon, RefreshCw, Send, ShieldCheck, Sun, User, X } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string; topic?: string };
interface Props { isOpen: boolean; onClose: () => void; currentScenarioTitle?: string }

const INTRO: Message = { role: 'assistant', content: 'Chào bạn, tôi là TS. Linh — cố vấn đạo đức AI. Tôi có thể hỗ trợ về minh bạch, công bằng, quyền riêng tư, bản quyền và trách nhiệm khi dùng AI.' };
const SUGGESTIONS = [
  'Tôi nên bảo vệ dữ liệu khách hàng khi dùng AI thế nào?',
  'Dùng AI làm bài tập thế nào để giữ liêm chính học thuật?',
  'Làm sao kiểm tra thiên vị trong hệ thống tuyển dụng AI?',
];

function sessionId() {
  const key = 'ethics-chat-session';
  let value = localStorage.getItem(key);
  if (!value) { value = crypto.randomUUID(); localStorage.setItem(key, value); }
  return value;
}

export const DrLinhChatModal: React.FC<Props> = ({ isOpen, onClose, currentScenarioTitle }) => {
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [light, setLight] = useState(false);
  const [error, setError] = useState('');
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => { if (isOpen) end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading, isOpen]);
  useEffect(() => {
    if (!isOpen) return;
    fetch(`/api/chat/history?sessionId=${sessionId()}`).then(r => r.json()).then(data => {
      if (data.messages?.length) setMessages([INTRO, ...data.messages]);
    }).catch(() => undefined);
  }, [isOpen]);

  const send = async (suggestion?: string) => {
    const content = (suggestion ?? input).trim();
    if (!content || loading) return;
    setMessages(old => [...old, { role: 'user', content }]); setInput(''); setError(''); setLoading(true);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId: sessionId(), message: content }) });
      const data = await response.json();
      if (!response.ok) throw new Error();
      setMessages(old => [...old, { role: 'assistant', content: data.reply, topic: data.topic }]);
    } catch { setError('Không thể kết nối với cố vấn. Vui lòng thử lại.'); }
    finally { setLoading(false); }
  };

  const reset = () => { localStorage.removeItem('ethics-chat-session'); setMessages([INTRO]); setError(''); };
  if (!isOpen) return null;
  const theme = light ? 'bg-stone-50 text-stone-900 border-stone-300' : 'bg-slate-900 text-slate-100 border-slate-700';

  return <aside className={`fixed z-50 bottom-3 right-3 sm:bottom-6 sm:right-6 w-[calc(100vw-1.5rem)] sm:w-[420px] h-[min(680px,calc(100vh-1.5rem))] rounded-3xl border shadow-2xl flex flex-col overflow-hidden ${theme}`} role="dialog" aria-label="Cố vấn đạo đức AI">
    <header className="p-4 flex items-center justify-between border-b border-current/10">
      <div className="flex items-center gap-3"><span className="w-11 h-11 rounded-2xl bg-orange-600 text-white grid place-items-center"><Bot /></span><div><h2 className="font-bold">TS. Linh <small className="text-orange-500">· AI Ethics</small></h2><p className="text-xs opacity-60">Cố vấn đạo đức AI · đang trực tuyến</p></div></div>
      <div className="flex gap-1"><button className="p-2" onClick={() => setLight(!light)} aria-label="Đổi giao diện">{light ? <Moon size={17}/> : <Sun size={17}/>}</button><button className="p-2" onClick={reset} aria-label="Cuộc trò chuyện mới"><RefreshCw size={17}/></button><button className="p-2" onClick={onClose} aria-label="Đóng"><X size={19}/></button></div>
    </header>
    {currentScenarioTitle && <div className="px-4 py-2 text-xs bg-orange-500/10">Ngữ cảnh: {currentScenarioTitle}</div>}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
        {message.role === 'assistant' && <span className="w-8 h-8 rounded-xl bg-orange-600 text-white grid place-items-center shrink-0"><Bot size={15}/></span>}
        <div className="max-w-[82%]">{message.topic && <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">{message.topic}</p>}<div className={`rounded-2xl px-4 py-3 text-sm leading-6 whitespace-pre-wrap ${message.role === 'user' ? 'bg-orange-600 text-white' : 'bg-black/5 dark:bg-white/10'}`}>{message.content}</div></div>
        {message.role === 'user' && <span className="w-8 h-8 rounded-xl bg-orange-600 text-white grid place-items-center shrink-0"><User size={15}/></span>}
      </div>)}
      {loading && <p className="text-sm opacity-60">TS. Linh đang phân tích tình huống…</p>}{error && <p className="text-xs text-rose-500">{error}</p>}<div ref={end}/>
    </div>
    {messages.length < 4 && <div className="px-4 pb-3 flex gap-2 overflow-x-auto">{SUGGESTIONS.map(item => <button key={item} onClick={() => send(item)} className="shrink-0 rounded-full border border-current/20 px-3 py-1.5 text-xs">{item}</button>)}</div>}
    <footer className="p-3 border-t border-current/10"><form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2 rounded-2xl border border-current/20 p-2"><input value={input} maxLength={4000} onChange={e => setInput(e.target.value)} className="flex-1 bg-transparent outline-none px-2 text-sm" placeholder="Hỏi về một tình huống đạo đức AI…"/><button disabled={!input.trim() || loading} className="w-10 h-10 rounded-xl bg-orange-600 text-white grid place-items-center disabled:opacity-40"><Send size={17}/></button></form><p className="mt-2 text-[10px] opacity-50 flex justify-center gap-1"><ShieldCheck size={12}/>Không chia sẻ dữ liệu nhạy cảm · Không thay thế tư vấn pháp lý</p></footer>
  </aside>;
};
