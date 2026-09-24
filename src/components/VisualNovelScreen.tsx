import React, { useState, useEffect } from 'react';
import { Scenario, Choice, CharacterId } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { sounds } from '../utils/soundEffects';
import { ArrowRight, MessageSquare, AlertTriangle, CheckCircle2, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';

interface VisualNovelScreenProps {
  scenario: Scenario;
  currentChoiceId?: 'A' | 'B' | 'C' | 'D';
  onMakeChoice: (scenarioId: string, choiceId: 'A' | 'B' | 'C' | 'D') => void;
  onOpenAnalysis: (choice: Choice) => void;
  onOpenChat: () => void;
}

export const VisualNovelScreen: React.FC<VisualNovelScreenProps> = ({
  scenario,
  currentChoiceId,
  onMakeChoice,
  onOpenAnalysis,
  onOpenChat,
}) => {
  // Dialogue index in the prologue or consequence
  const [prologueIndex, setPrologueIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(() => {
    if (currentChoiceId) {
      return scenario.choices.find((c) => c.id === currentChoiceId) || null;
    }
    return null;
  });
  const [consequenceDialogueIndex, setConsequenceDialogueIndex] = useState(0);

  // Sync state if scenario changes or replayed
  useEffect(() => {
    setPrologueIndex(0);
    setConsequenceDialogueIndex(0);
    if (currentChoiceId) {
      const match = scenario.choices.find((c) => c.id === currentChoiceId);
      setSelectedChoice(match || null);
    } else {
      setSelectedChoice(null);
    }
  }, [scenario.id, currentChoiceId]);

  const currentDialogue = selectedChoice
    ? selectedChoice.consequence.immediateScene[consequenceDialogueIndex] || selectedChoice.consequence.immediateScene[0]
    : scenario.prologueDialogues[prologueIndex] || scenario.prologueDialogues[0];

  const speaker = CHARACTERS[currentDialogue?.speaker || 'narrator'] || CHARACTERS.narrator;

  const isPrologueFinished = prologueIndex >= scenario.prologueDialogues.length - 1;
  const isConsequenceFinished = selectedChoice
    ? consequenceDialogueIndex >= selectedChoice.consequence.immediateScene.length - 1
    : false;

  const handleNextPrologue = () => {
    sounds.playBlip();
    if (!isPrologueFinished) {
      setPrologueIndex((prev) => prev + 1);
    }
  };

  const handleNextConsequence = () => {
    sounds.playBlip();
    if (!isConsequenceFinished) {
      setConsequenceDialogueIndex((prev) => prev + 1);
    }
  };

  const handlePickChoice = (choice: Choice) => {
    sounds.playChoiceSelect();
    setSelectedChoice(choice);
    setConsequenceDialogueIndex(0);
    onMakeChoice(scenario.id, choice.id);
  };

  const getSettingBadgeColor = (type: Scenario['settingType']) => {
    switch (type) {
      case 'dorm':
        return 'from-indigo-950/80 via-slate-900 to-purple-950/80 border-indigo-500/30 text-indigo-300';
      case 'library':
        return 'from-cyan-950/80 via-slate-900 to-blue-950/80 border-cyan-500/30 text-cyan-300';
      case 'office':
        return 'from-amber-950/80 via-slate-900 to-orange-950/80 border-amber-500/30 text-amber-300';
      case 'exam_hall':
        return 'from-rose-950/80 via-slate-900 to-red-950/80 border-rose-500/30 text-rose-300';
      default:
        return 'from-emerald-950/80 via-slate-900 to-teal-950/80 border-emerald-500/30 text-emerald-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Top Scenario Title Card */}
      <div className={`rounded-3xl p-5 sm:p-6 border bg-gradient-to-r ${getSettingBadgeColor(scenario.settingType)} shadow-xl relative overflow-hidden backdrop-blur-md`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-950/60 border border-slate-700/60">
                Tình huống #{scenario.order}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                📍 {scenario.setting}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">{scenario.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1">{scenario.subtitle}</p>
          </div>

          <button
            onClick={() => {
              sounds.playBlip();
              onOpenChat();
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950/70 border border-amber-500/40 text-amber-300 text-xs font-medium hover:bg-slate-950 hover:border-amber-400 self-start sm:self-center transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hỏi TS. Linh về ca này</span>
          </button>
        </div>
      </div>

      {/* Visual Novel Character Stage */}
      <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden min-h-[360px] flex flex-col justify-between">
        {/* Stage Atmosphere Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Character Portrait & Presence */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b border-slate-800/80">
          <div className="relative group">
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr ${speaker.avatarBg} p-1 shadow-lg shadow-indigo-500/20 flex items-center justify-center transition-transform group-hover:scale-105`}
            >
              <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center text-3xl sm:text-4xl">
                {speaker.avatarIcon}
              </div>
            </div>
            <span className="absolute -bottom-2 -right-2 text-xs px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 font-bold shadow">
              {currentDialogue?.emotion === 'worried' && '😰 Lo âu'}
              {currentDialogue?.emotion === 'strict' && '⚖️ Nghiêm cẩn'}
              {currentDialogue?.emotion === 'happy' && '✨ Hân hoan'}
              {currentDialogue?.emotion === 'thinking' && '🤔 Suy ngẫm'}
              {currentDialogue?.emotion === 'surprised' && '😲 Bất ngờ'}
              {(!currentDialogue?.emotion || currentDialogue.emotion === 'normal') && '💬 Đối thoại'}
            </span>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <h3 className={`text-lg sm:text-xl font-bold ${speaker.textColor}`}>{speaker.name}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 w-fit mx-auto sm:mx-0">
                {speaker.badge}
              </span>
            </div>
            <p className="text-xs text-slate-400">{speaker.role} • {speaker.description}</p>
          </div>
        </div>

        {/* Speech Bubble / Dialogue Content */}
        <div className="relative z-10 my-6 bg-slate-950/70 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-inner space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              {selectedChoice ? 'Hệ quả mô phỏng (Consequence Simulation)' : 'Lời thoại diễn biến (Prologue Dialogue)'}
            </span>
            <span>
              {selectedChoice
                ? `Hệ quả ${consequenceDialogueIndex + 1}/${selectedChoice.consequence.immediateScene.length}`
                : `Đối thoại ${prologueIndex + 1}/${scenario.prologueDialogues.length}`}
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal min-h-[50px]">
            "{currentDialogue?.text}"
          </p>

          {/* Dialogue step controls */}
          <div className="flex justify-end gap-2 pt-2">
            {!selectedChoice ? (
              !isPrologueFinished ? (
                <button
                  onClick={handleNextPrologue}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold transition-all"
                >
                  <span>Tiếp tục thoại</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <span className="text-xs text-amber-400 font-medium animate-pulse">
                  👇 Đã xong bối cảnh! Hãy chọn phương án xử lý bên dưới.
                </span>
              )
            ) : (
              !isConsequenceFinished && (
                <button
                  onClick={handleNextConsequence}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-semibold transition-all"
                >
                  <span>Xem tiếp phản ứng</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )
            )}
          </div>
        </div>

        {/* If consequence is triggered, show summary impact card & button to open Ethics Analysis */}
        {selectedChoice && (
          <div className="relative z-10 mt-2 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Bạn đã chọn:</span>
                  <span className="text-xs font-bold text-indigo-400 font-mono px-2 py-0.5 bg-indigo-500/10 rounded border border-indigo-500/30">
                    Phương án {selectedChoice.id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedChoice.consequence.statusColor === 'emerald'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : selectedChoice.consequence.statusColor === 'rose'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    {selectedChoice.consequence.gradeStatus}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedChoice.consequence.summaryTitle}
                </h4>
              </div>

              {/* Ethics score badge delta */}
              <div
                className={`text-sm font-bold px-3 py-1.5 rounded-xl border self-start sm:self-center font-mono ${
                  selectedChoice.ethicsScoreDelta >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                Ethics {selectedChoice.ethicsScoreDelta >= 0 ? `+${selectedChoice.ethicsScoreDelta}` : selectedChoice.ethicsScoreDelta}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {selectedChoice.consequence.summaryDesc}
            </p>

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-400">
              <strong className="text-slate-300">Tác động học vụ: </strong>
              {selectedChoice.consequence.academicImpact}
            </div>

            {/* Action buttons: Open Ethics Analysis or Replay */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  sounds.playChoiceSelect();
                  setSelectedChoice(null);
                }}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Thử chọn phương án khác (What if?)</span>
              </button>

              <button
                onClick={() => {
                  sounds.playSuccess();
                  onOpenAnalysis(selectedChoice);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all group"
              >
                <span>Xem Phân tích Đạo đức (Ethics Analysis)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dilemma & Choices Options (When not locked in consequence) */}
      {!selectedChoice && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-amber-200/90">
              <strong>Tình huống đặt ra: </strong> {scenario.dilemmaPrompt}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenario.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handlePickChoice(choice)}
                className="group text-left bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/60 rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between gap-3 relative overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full blur-xl transition-all" />

                <div className="space-y-2 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white font-bold font-mono text-sm flex items-center justify-center transition-colors">
                      {choice.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        choice.riskLevel === 'responsible'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : choice.riskLevel === 'high_risk'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : choice.riskLevel === 'moderate'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                      }`}
                    >
                      {choice.riskLevel === 'responsible' && 'Trách nhiệm cao'}
                      {choice.riskLevel === 'high_risk' && 'Rủi ro vi phạm'}
                      {choice.riskLevel === 'moderate' && 'Cần cân nhắc'}
                      {choice.riskLevel === 'grey_zone' && 'Vùng xám'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                    {choice.label}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {choice.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="text-[11px] font-medium">Bấm để chọn phương án này</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 text-indigo-400 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
