import React, { useState } from 'react';
import { X, Lock, CheckCircle2, XCircle, Quote, Sparkles, BookOpen } from 'lucide-react';
import { KNOWLEDGE_CARDS } from '../data/knowledgeCards';
import { sounds } from '../utils/soundEffects';

interface KnowledgeCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedCardIds: string[];
}

export const KnowledgeCardsModal: React.FC<KnowledgeCardsModalProps> = ({
  isOpen,
  onClose,
  unlockedCardIds,
}) => {
  const cardsList = Object.values(KNOWLEDGE_CARDS);
  const [selectedCardId, setSelectedCardId] = useState<string>(cardsList[0]?.id || '');

  if (!isOpen) return null;

  const selectedCard = KNOWLEDGE_CARDS[selectedCardId] || cardsList[0];
  const isSelectedUnlocked = unlockedCardIds.includes(selectedCard.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] max-h-[800px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-lg">Kho Thẻ Tri Thức (Knowledge Cards)</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {unlockedCardIds.length}/{cardsList.length} Đã mở khóa
                </span>
              </div>
              <p className="text-xs text-slate-400">Hệ thống chuẩn mực đạo đức, quy định học thuật & kỹ năng dùng AI</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playBlip();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar List + Detail Card */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Card Selection Grid */}
          <div className="w-full md:w-80 border-r border-slate-800/80 bg-slate-950/40 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 pb-1">
              Danh mục thẻ tri thức
            </div>
            {cardsList.map((card) => {
              const isUnlocked = unlockedCardIds.includes(card.id);
              const isSelected = selectedCardId === card.id;

              return (
                <button
                  key={card.id}
                  onClick={() => {
                    sounds.playBlip();
                    setSelectedCardId(card.id);
                  }}
                  className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md shadow-indigo-600/10'
                      : 'bg-slate-900/60 border-slate-800/60 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                      isUnlocked
                        ? 'bg-slate-800 border border-slate-700'
                        : 'bg-slate-900/80 border border-slate-800 opacity-50'
                    }`}
                  >
                    {isUnlocked ? card.icon : <Lock className="w-4 h-4 text-slate-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isUnlocked ? (isSelected ? 'text-indigo-300' : 'text-slate-200') : 'text-slate-500'
                        }`}
                      >
                        {card.title}
                      </h4>
                      {isUnlocked && (
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {isUnlocked ? card.titleVi : 'Chưa mở khóa (Hoàn thành tình huống)'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Card View */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-900/60">
            {isSelectedUnlocked ? (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
                {/* Card Title & Header */}
                <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/40 flex items-center justify-center text-3xl shadow-lg shadow-indigo-600/20 flex-shrink-0">
                    {selectedCard.icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {selectedCard.category}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1.5">{selectedCard.title}</h2>
                    <h3 className="text-sm font-medium text-slate-400">{selectedCard.titleVi}</h3>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 text-slate-200 text-sm leading-relaxed">
                  <strong className="text-indigo-300 block mb-1">Khái niệm cốt lõi:</strong>
                  {selectedCard.summary}
                </div>

                {/* Key Principles */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Nguyên tắc học thuật cần ghi nhớ
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedCard.keyPrinciples.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Do & Don't Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* DO */}
                  <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> NÊN THỰC HIỆN (DO)
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {selectedCard.doAndDont.do.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* DONT */}
                  <div className="bg-rose-950/20 border border-rose-800/40 rounded-2xl p-4 space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <XCircle className="w-4 h-4" /> TRÁNH VI PHẠM (DON'T)
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {selectedCard.doAndDont.dont.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-rose-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* University Policy Quote */}
                <div className="bg-gradient-to-r from-indigo-950/30 via-slate-900 to-purple-950/30 border border-indigo-900/50 rounded-2xl p-4 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs italic text-indigo-200/90 leading-relaxed">
                    {selectedCard.universityPolicyQuote}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-300">Thẻ này chưa được mở khóa</h3>
                <p className="text-sm text-slate-500 max-w-md">
                  Hãy tiếp tục trải nghiệm các tình huống trong các Chapter để khám phá thêm nhiều bài học và mở khóa thẻ tri thức này nhé!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
