import React from 'react';
import { Choice, Scenario } from '../types/game';
import { KNOWLEDGE_CARDS } from '../data/knowledgeCards';
import { sounds } from '../utils/soundEffects';
import { ShieldCheck, HelpCircle, AlertCircle, ArrowRight, RotateCcw, BookOpen, Sparkles, Scale, Info } from 'lucide-react';

interface EthicsAnalysisScreenProps {
  scenario: Scenario;
  choice: Choice;
  onNextScenario: () => void;
  onReplayScenario: () => void;
  onOpenKnowledgeCard: (cardId: string) => void;
  onOpenChatWithTopic: (topic: string) => void;
  hasNextScenario: boolean;
}

export const EthicsAnalysisScreen: React.FC<EthicsAnalysisScreenProps> = ({
  scenario,
  choice,
  onNextScenario,
  onReplayScenario,
  onOpenKnowledgeCard,
  onOpenChatWithTopic,
  hasNextScenario,
}) => {
  const analysis = choice.ethicsAnalysis;
  const unlockedCard = choice.unlockKnowledgeCardId
    ? KNOWLEDGE_CARDS[choice.unlockKnowledgeCardId]
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" /> Phân tích Đạo đức Học thuật (AI Ethics Analysis)
              </span>
              <span className="text-xs text-slate-400">Tình huống #{scenario.order}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{scenario.title}</h1>
            <p className="text-xs text-slate-300 mt-1">Giải mã hành vi, hệ quả và giải pháp thay thế có trách nhiệm</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sounds.playBlip();
                onOpenChatWithTopic(`Thầy ơi, trong tình huống "${scenario.title}", em đã chọn "${choice.label}". Thầy có thể phân tích thêm góc nhìn của hội đồng liêm chính không ạ?`);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Thảo luận cùng TS. Linh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Your Decision */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2.5">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" /> 1. Quyết định của bạn (Your Decision)
          </div>
          <div className="text-sm font-semibold text-white bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            Phương án {choice.id}: {choice.label}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {analysis.yourDecision}
          </p>
        </div>

        {/* Card 2: What Happened */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" /> 2. Chuyện gì đã xảy ra? (What Happened?)
          </div>
          <div className="text-sm font-semibold text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            {choice.consequence.summaryTitle}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {analysis.whatHappened}
          </p>
        </div>

        {/* Card 3: Why Does It Matter */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2.5 md:col-span-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4" /> 3. Vấn đề đạo đức học thuật nằm ở đâu? (Why Does It Matter?)
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            {analysis.whyDoesItMatter}
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-400">Danh mục liêm chính liên quan:</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
              {analysis.categoryVi} ({analysis.category})
            </span>
          </div>
        </div>

        {/* Card 4: How Could You Handle It Better */}
        <div className="bg-slate-900/90 border border-emerald-900/40 rounded-2xl p-5 shadow-lg space-y-2.5 md:col-span-2 bg-emerald-950/10">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> 4. Cách xử lý thay thế có trách nhiệm (How Could You Handle It Better?)
          </div>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed bg-slate-950/50 p-4 rounded-xl border border-emerald-800/30">
            {analysis.howToHandleBetter}
          </p>
        </div>
      </div>

      {/* Institutional Disclaimer */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-300">Lưu ý sư phạm: </strong>
          {analysis.institutionalDisclaimer}
        </p>
      </div>

      {/* Knowledge Card Unlock Reward */}
      {unlockedCard && (
        <div className="bg-gradient-to-r from-amber-500/15 via-slate-900 to-indigo-500/15 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl flex-shrink-0">
              {unlockedCard.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Thẻ Tri Thức Mở Khóa!
                </span>
                <span className="text-xs text-slate-400">{unlockedCard.category}</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">{unlockedCard.title}</h4>
              <p className="text-xs text-slate-300">{unlockedCard.titleVi}</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playCardUnlock();
              onOpenKnowledgeCard(unlockedCard.id);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all self-start sm:self-center"
          >
            <BookOpen className="w-4 h-4" />
            <span>Mở xem thẻ tri thức</span>
          </button>
        </div>
      )}

      {/* Next / Replay Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            sounds.playChoiceSelect();
            onReplayScenario();
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Thử chọn nhánh khác (What if you chose differently?)</span>
        </button>

        <button
          onClick={() => {
            sounds.playSuccess();
            onNextScenario();
          }}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group"
        >
          <span>{hasNextScenario ? 'Sang tình huống tiếp theo' : 'Xem Kết Quả & Phản Tư (Final Reflection)'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
