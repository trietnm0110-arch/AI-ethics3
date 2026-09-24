import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface DrLinhChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScenarioTitle?: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'model',
    content: `Chào em! Thầy là **TS. Linh**, giảng viên kiêm Cố vấn Liêm chính Học thuật.

Thầy ở đây để đồng hành và giải đáp cho em mọi khúc mắc về:
- **Ranh giới sử dụng AI**: Khi nào là công cụ hỗ trợ tư duy hợp lệ, khi nào rơi vào bẫy đạo văn / gian lận.
- **Khai báo minh bạch (AI Disclosure Statement)**: Cách ghi nhận công cụ AI chuẩn mực theo quy chế.
- **Xử lý áp lực**: Cách ứng phó khi gặp bế tắc bài tập, cận kề hạn chót hoặc khúc mắc khi làm việc nhóm.

Em đang băn khoăn về tình huống nào, cứ thoải mái trao đổi cùng thầy nhé!`,
  },
];

const SUGGESTED_PROMPTS = [
  'Làm sao để viết câu khai báo sử dụng AI (AI Disclosure) chuẩn?',
  'Paraphrase bằng AI khi nào bị coi là Patchwriting (đạo văn)?',
  'Nhờ AI tìm tài liệu thì làm sao tránh bài báo ảo (hallucination)?',
  'Làm gì khi đồng đội trong nhóm nộp bài làm bằng AI bịa số liệu?',
];

export const DrLinhChatModal: React.FC<DrLinhChatModalProps> = ({ isOpen, onClose, currentScenarioTitle }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    sounds.playChoiceSelect();
    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.reply || 'Thầy đã nhận được câu hỏi, em vui lòng kiểm tra lại kết nối nhé!';
      sounds.playSuccess();

      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    } catch (err: unknown) {
      console.error('Chat error:', err);
      sounds.playWarning();
      setErrorMsg('Không thể kết nối với máy chủ. Hãy đảm bảo đường truyền ổn định.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: `Chào em! Có vẻ kết nối mạng gặp chút gián đoạn. Tuy nhiên, nếu em đang phân vân về liêm chính học thuật, nguyên tắc then chốt luôn là: **"Minh bạch là tôn chỉ cao nhất. Khi không chắc chắn, hãy kiểm tra Syllabus môn học và chủ động trao đổi trực tiếp với giảng viên phụ trách."**`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    sounds.playBlip();
    setMessages(INITIAL_MESSAGES);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-[90vh] max-h-[750px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-xl shadow-md shadow-amber-600/30">
                🎓
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-sm sm:text-base">TS. Linh - Cố Vấn Liêm Chính</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Gemini 3.5 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">Tư vấn đạo đức học thuật & kỹ năng sử dụng AI trong trường đại học</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleResetChat}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="Khởi động lại cuộc trò chuyện"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                sounds.playBlip();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Scenario Context Banner */}
        {currentScenarioTitle && (
          <div className="bg-indigo-950/40 border-b border-indigo-900/40 px-4 py-1.5 text-xs text-indigo-300 flex items-center justify-between">
            <span>Đang trong tình huống: <strong className="text-white">{currentScenarioTitle}</strong></span>
            <span className="text-slate-400 text-[11px]">Hỏi thầy về tình huống này 💬</span>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex-shrink-0 flex items-center justify-center text-sm shadow-sm mt-0.5">
                    🎓
                  </div>
                )}
                <div
                  className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/90 text-slate-200 rounded-bl-xs border border-slate-700/60 shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white text-xs shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center text-slate-400 text-xs py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-sm">
                🎓
              </div>
              <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-slate-300 ml-1">TS. Linh đang suy ngẫm câu trả lời...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-950/40 border border-rose-900/50 rounded-xl p-3">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto flex gap-2">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="text-[11px] whitespace-nowrap px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors disabled:opacity-50"
            >
              💡 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi TS. Linh về quy chế AI, trích dẫn, bài tập..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </form>
          <p className="text-[10px] text-slate-500 text-center mt-2">
            Được vận hành bởi Gemini API server-side • Hệ thống tôn trọng quyền riêng tư học tập.
          </p>
        </div>
      </div>
    </div>
  );
};
