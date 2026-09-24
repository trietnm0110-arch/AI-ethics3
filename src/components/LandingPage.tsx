import React from 'react';
import { CHARACTERS } from '../data/characters';
import { CHAPTERS } from '../data/scenarios';
import { sounds } from '../utils/soundEffects';
import { Play, Sparkles, Compass, BookOpen, GitFork, ShieldCheck, Scale, ArrowRight, Award, MessageSquareText } from 'lucide-react';

interface LandingPageProps {
  completedCount: number;
  totalScenarios: number;
  onStart: () => void;
  onContinue: () => void;
  onOpenTutorial: () => void;
  onOpenChat: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  completedCount,
  totalScenarios,
  onStart,
  onContinue,
  onOpenTutorial,
  onOpenChat,
}) => {
  const charactersList = Object.values(CHARACTERS).filter((c) => c.id !== 'narrator');

  return (
    <div className="w-full max-w-6xl mx-auto space-y-16 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative pt-6 sm:pt-12 text-center space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Interactive Visual Novel & Academic Simulator</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Liêm Chính Học Thuật Trong Kỷ Nguyên <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-teal-300 bg-clip-text text-transparent">Trí Tuệ Nhân Tạo</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Không còn những trang lý thuyết khô khan. Bạn sẽ trực tiếp đối mặt với deadline 2 giờ sáng, áp lực bài thi take-home, bẫy trích dẫn ảo của AI và những ngã rẽ thử thách bản lĩnh sinh viên.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          {completedCount > 0 ? (
            <button
              onClick={() => {
                sounds.playSuccess();
                onContinue();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Tiếp tục hành trình ({completedCount}/{totalScenarios} tình huống)</span>
            </button>
          ) : (
            <button
              onClick={() => {
                sounds.playSuccess();
                onStart();
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Bắt Đầu Hành Trình Mới</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playBlip();
              onOpenTutorial();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
          >
            <Compass className="w-4 h-4 text-indigo-400" />
            <span>Hướng dẫn cách chơi</span>
          </button>
        </div>

        {/* Highlight Feature Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> 15 Tình huống đa nhánh
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-indigo-400" /> Mô phỏng hệ quả chân thực
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-purple-400" /> 8 Thẻ tri thức đại học
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Cố vấn AI Gemini 3.5
          </span>
        </div>
      </div>

      {/* Feature Pillar Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-2xl">
            ⚡
          </div>
          <h3 className="font-bold text-white text-lg">Mô Phỏng Đưa Quyết Định</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Mỗi phương án bạn chọn lập tức kích hoạt phản ứng: giảng viên mời giải trình miệng, hội đồng khoa xem xét, hoặc đạt điểm 10 trọn vẹn nhờ tính minh bạch.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
            🔍
          </div>
          <h3 className="font-bold text-white text-lg">AI Ethics Analysis Sâu Sắc</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Phân tích 4 góc độ cho từng quyết định: Chuyện gì đã diễn ra, vấn đề đạo đức nằm ở đâu, thuộc nhóm vi phạm nào, và phương án thay thế có trách nhiệm là gì.
          </p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-2xl">
            🎓
          </div>
          <h3 className="font-bold text-white text-lg">Cố Vấn Liêm Chính TS. Linh</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Được vận hành bởi mô hình Gemini 3.5 Flash server-side, luôn sẵn sàng giải đáp mọi khúc mắc về trích dẫn APA, AI Disclosure Statement và quy chế trường.
          </p>
        </div>
      </div>

      {/* 5 Chapters Roadmap */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Lộ trình 5 Hồi Kịch Tính</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Các Chương Hồi Trong Game</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  Hồi {ch.id}
                </span>
                <h4 className="font-bold text-slate-200 text-sm mt-2">{ch.titleVi}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">
                  {ch.description}
                </p>
              </div>
              <div className="text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-800/60">
                {ch.scenarioIds.length} tình huống
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cast of Characters */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Nhân Vật Trong Game</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Những Gương Mặt Đồng Hành</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {charactersList.map((char) => (
            <div
              key={char.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-2"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-3xl shadow">
                {char.avatarIcon}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${char.textColor}`}>{char.name}</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium inline-block mt-0.5">
                  {char.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {char.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">
          Sẵn sàng thử thách năng lực phân định đạo đức của bạn?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Mỗi quyết định nhỏ ngày hôm nay sẽ định hình giá trị văn bằng và danh dự học thuật của bạn trong suốt tương lai nghề nghiệp.
        </p>
        <div className="pt-2">
          <button
            onClick={() => {
              sounds.playSuccess();
              onStart();
            }}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-indigo-600/30 inline-flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Vào chơi ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
};
