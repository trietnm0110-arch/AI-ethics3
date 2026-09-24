import React from 'react';
import { Volume2, VolumeX, BookOpen, GitFork, MessageSquareText, Shield, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HeaderProps {
  ethicsScore: number;
  completedCount: number;
  totalScenarios: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenKnowledgeCards: () => void;
  onOpenDecisionMap: () => void;
  onOpenChat: () => void;
  onOpenGoogleDrive: () => void;
  onReset: () => void;
  onGoHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  ethicsScore,
  completedCount,
  totalScenarios,
  soundEnabled,
  onToggleSound,
  onOpenKnowledgeCards,
  onOpenDecisionMap,
  onOpenChat,
  onOpenGoogleDrive,
  onReset,
  onGoHome,
}) => {
  // Determine color and status for Ethics Meter
  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: 'Liêm chính vững vàng', color: 'text-emerald-400', bg: 'bg-emerald-500', bar: 'from-emerald-600 to-teal-400' };
    if (score >= 60) return { label: 'Ý thức trách nhiệm tốt', color: 'text-teal-300', bg: 'bg-teal-500', bar: 'from-teal-500 to-cyan-400' };
    if (score >= 40) return { label: 'Đang tự phản tư & Rà soát', color: 'text-amber-400', bg: 'bg-amber-500', bar: 'from-amber-500 to-orange-400' };
    return { label: 'Nguy cơ vi phạm cao', color: 'text-rose-400', bg: 'bg-rose-500', bar: 'from-rose-600 to-red-400' };
  };

  const status = getScoreStatus(ethicsScore);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo & Home trigger */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => {
              sounds.playBlip();
              onGoHome();
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-slate-100 text-base sm:text-lg group-hover:text-indigo-300 transition-colors">
                  IntegrityQuest
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI & Ethics
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Mô phỏng Đạo đức Học thuật & Sử dụng AI</p>
            </div>
          </button>

          {/* Quick Mobile Counter */}
          <div className="sm:hidden text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
            {completedCount}/{totalScenarios} tình huống
          </div>
        </div>

        {/* Center: Ethics Meter Bar */}
        <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[320px] bg-slate-900/80 border border-slate-800/90 rounded-2xl px-3.5 py-2">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full ${status.bg} animate-pulse`} />
                Ethics Meter
              </span>
              <span className="font-mono font-bold text-slate-200">
                {ethicsScore}<span className="text-slate-500 text-[11px]">/100</span>
              </span>
            </div>
            {/* Progress Track */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${status.bar} transition-all duration-700 ease-out shadow-sm`}
                style={{ width: `${Math.max(4, ethicsScore)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1 text-slate-400">
              <span className={`font-medium ${status.color}`}>{status.label}</span>
              <span className="hidden sm:inline text-slate-500">{completedCount}/{totalScenarios} tình huống</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto justify-end overflow-x-auto py-0.5">
          {/* Dr Linh Chatbot Trigger */}
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenChat();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-300 hover:border-amber-400/60 hover:text-amber-200 text-xs font-medium transition-all shadow-sm group"
            title="Hỏi cố vấn liêm chính TS. Linh (Trợ lý AI)"
          >
            <MessageSquareText className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="whitespace-nowrap font-medium">Cố vấn TS. Linh</span>
          </button>

          {/* Knowledge Cards Inventory */}
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenKnowledgeCards();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 text-xs font-medium transition-all"
            title="Xem Thẻ Tri Thức đã mở khóa"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline whitespace-nowrap">Thẻ Tri Thức</span>
          </button>

          {/* Decision Map */}
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenDecisionMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 text-xs font-medium transition-all"
            title="Bản đồ Nhánh Quyết định & Thử lại"
          >
            <GitFork className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline whitespace-nowrap">Bản Đồ Nhánh</span>
          </button>

          {/* Google Drive Trigger */}
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenGoogleDrive();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 text-xs font-medium transition-all group"
            title="Mở Google Drive Hub (Lưu báo cáo & đồng bộ tệp)"
          >
            <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span className="hidden md:inline whitespace-nowrap">Drive</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Reset progress */}
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn thiết lập lại toàn bộ tiến trình và bắt đầu lại từ đầu không?')) {
                onReset();
              }
            }}
            className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-500 hover:text-rose-400 text-xs transition-colors"
            title="Chơi lại từ đầu (Reset)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
