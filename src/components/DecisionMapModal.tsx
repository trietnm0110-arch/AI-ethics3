import React, { useState } from 'react';
import { X, GitFork, RotateCcw, Check, ArrowRight, ShieldAlert, Sparkles, Clock, Bot, FileSearch, Scale } from 'lucide-react';
import { CHAPTERS, SCENARIOS } from '../data/scenarios';
import { sounds } from '../utils/soundEffects';

interface DecisionMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  completedScenarioIds: string[];
  decisions: Record<string, 'A' | 'B' | 'C' | 'D'>;
  onSelectScenarioToReplay: (scenarioId: string) => void;
}

export const DecisionMapModal: React.FC<DecisionMapModalProps> = ({
  isOpen,
  onClose,
  completedScenarioIds,
  decisions,
  onSelectScenarioToReplay,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(1);

  if (!isOpen) return null;

  const currentChapter = CHAPTERS.find((c) => c.id === selectedChapterId) || CHAPTERS[0];
  const chapterScenarios = SCENARIOS.filter((s) => s.chapterId === selectedChapterId);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'responsible':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Trách nhiệm</span>;
      case 'high_risk':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Rủi ro cao</span>;
      case 'moderate':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">Cần cân nhắc</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">Vùng xám</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] max-h-[820px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <GitFork className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-lg">Bản Đồ Quyết Định (Decision Map)</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Khám phá nhánh rẽ & Thử lại
                </span>
              </div>
              <p className="text-xs text-slate-400">Xem lại các ngã rẽ và khám phá: "Chuyện gì sẽ xảy ra nếu mình chọn cách khác?"</p>
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

        {/* Chapter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto">
          {CHAPTERS.map((ch) => {
            const isSelected = ch.id === selectedChapterId;
            const completedInChapter = ch.scenarioIds.filter((id) => completedScenarioIds.includes(id)).length;
            const isAllCompleted = completedInChapter === ch.scenarioIds.length;

            return (
              <button
                key={ch.id}
                onClick={() => {
                  sounds.playBlip();
                  setSelectedChapterId(ch.id);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-purple-600/20 border-purple-500/70 text-purple-200 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>Hồi {ch.id}: {ch.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isAllCompleted ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {completedInChapter}/{ch.scenarioIds.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Scenarios Branch Visualization */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900/40">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-base">{currentChapter.titleVi}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{currentChapter.description}</p>
              </div>
            </div>

            {/* Scenarios Flow */}
            <div className="space-y-6 relative before:absolute before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-800">
              {chapterScenarios.map((scenario, index) => {
                const isCompleted = completedScenarioIds.includes(scenario.id);
                const chosenId = decisions[scenario.id];
                const chosenChoice = scenario.choices.find((c) => c.id === chosenId);

                return (
                  <div key={scenario.id} className="relative pl-12">
                    {/* Node Dot */}
                    <div
                      className={`absolute left-4 -translate-x-1/2 top-4 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                          : 'bg-slate-900 border-slate-700 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                    </div>

                    {/* Card Content */}
                    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-purple-400 font-semibold">Tình huống #{scenario.order}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-xs text-slate-400">{scenario.setting}</span>
                          </div>
                          <h5 className="font-bold text-slate-100 text-base mt-0.5">{scenario.title}</h5>
                          <p className="text-xs text-slate-400">{scenario.subtitle}</p>
                        </div>

                        {/* Replay action */}
                        <button
                          onClick={() => {
                            sounds.playChoiceSelect();
                            onSelectScenarioToReplay(scenario.id);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-medium self-start sm:self-center transition-all group"
                        >
                          <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform" />
                          <span>{isCompleted ? 'Thử nhánh khác' : 'Chơi tình huống này'}</span>
                        </button>
                      </div>

                      {/* Current decision recap */}
                      {isCompleted && chosenChoice ? (
                        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-400">Bạn đã chọn:</span>
                              <span className="text-xs font-bold text-indigo-400">Phương án {chosenChoice.id}</span>
                              {getRiskBadge(chosenChoice.riskLevel)}
                            </div>
                            <p className="text-xs text-slate-300 font-medium">{chosenChoice.label}</p>
                          </div>
                          <div className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 self-start sm:self-center">
                            Hệ quả: <span className="text-slate-200">{chosenChoice.consequence.gradeStatus}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 italic">Chưa thực hiện lựa chọn cho tình huống này.</p>
                      )}

                      {/* Alternate choices preview */}
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                          Các phương án trong tình huống (What if you chose differently?)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {scenario.choices.map((c) => {
                            const isChosen = chosenId === c.id;
                            return (
                              <div
                                key={c.id}
                                className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                                  isChosen
                                    ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200'
                                    : 'bg-slate-950/40 border-slate-800/60 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[11px] flex-shrink-0 ${
                                    isChosen ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {c.id}
                                </span>
                                <div className="min-w-0">
                                  <div className="font-semibold text-slate-300 flex items-center gap-1.5 truncate">
                                    {c.label}
                                  </div>
                                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                    Điểm: {c.ethicsScoreDelta > 0 ? `+${c.ethicsScoreDelta}` : c.ethicsScoreDelta} • {c.consequence.gradeStatus}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
