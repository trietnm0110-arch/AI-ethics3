import React from 'react';
import { Chapter, Scenario } from '../types/game';
import { CHAPTERS, SCENARIOS } from '../data/scenarios';
import { sounds } from '../utils/soundEffects';
import { CheckCircle2, Clock, Play, ArrowRight, Sparkles, BookOpen, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ChapterSelectProps {
  completedScenarioIds: string[];
  decisions: Record<string, 'A' | 'B' | 'C' | 'D'>;
  onSelectScenario: (scenarioId: string) => void;
  onOpenKnowledgeCards: () => void;
  onOpenReflection: () => void;
}

export const ChapterSelect: React.FC<ChapterSelectProps> = ({
  completedScenarioIds,
  decisions,
  onSelectScenario,
  onOpenKnowledgeCards,
  onOpenReflection,
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Overview Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> 5 Hồi Kịch Tính • 15 Tình Huống Đời Thực
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Chọn Chương Hồi & Tình Huống
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mỗi chương hồi phản ánh một lát cắt chân thực trong hành trình đại học. Bạn có thể tự do khám phá theo thứ tự hoặc bấm vào từng tình huống để trải nghiệm các nhánh quyết định khác nhau.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="mt-6 flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenKnowledgeCards();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Kho Thẻ Tri Thức</span>
          </button>
          <button
            onClick={() => {
              sounds.playBlip();
              onOpenReflection();
            }}
            className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Xem Báo Cáo Phản Tư (Reflection)</span>
          </button>
        </div>
      </div>

      {/* Chapters Container */}
      <div className="space-y-8">
        {CHAPTERS.map((chapter) => {
          const chapterScenarios = SCENARIOS.filter((s) => s.chapterId === chapter.id);
          const completedInChapter = chapterScenarios.filter((s) => completedScenarioIds.includes(s.id)).length;
          const isAllCompleted = completedInChapter === chapterScenarios.length;

          // Chapter statistics
          let chapterResponsible = 0;
          let chapterRisky = 0;
          chapterScenarios.forEach((sc) => {
            const chId = decisions[sc.id];
            if (chId) {
              const choice = sc.choices.find((c) => c.id === chId);
              if (choice?.riskLevel === 'responsible') chapterResponsible++;
              if (choice?.riskLevel === 'high_risk') chapterRisky++;
            }
          });

          return (
            <div
              key={chapter.id}
              className="bg-slate-900/70 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4"
            >
              {/* Chapter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">
                      Hồi {chapter.id}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-xs text-slate-400">{chapter.scenarioIds.length} tình huống</span>
                    {isAllCompleted && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Đã hoàn thành
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white mt-1">{chapter.titleVi}</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl">{chapter.description}</p>
                </div>

                {/* Chapter Mini-Stats */}
                <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 rounded-2xl px-4 py-2 self-start sm:self-center">
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-slate-500 font-semibold">Tiến độ</div>
                    <div className="text-xs font-mono font-bold text-slate-200">
                      {completedInChapter}/{chapterScenarios.length}
                    </div>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-emerald-400 font-semibold">Chuẩn mực</div>
                    <div className="text-xs font-mono font-bold text-emerald-300">{chapterResponsible}</div>
                  </div>
                  <div className="h-6 w-px bg-slate-800" />
                  <div className="text-center">
                    <div className="text-[10px] uppercase text-rose-400 font-semibold">Rủi ro</div>
                    <div className="text-xs font-mono font-bold text-rose-300">{chapterRisky}</div>
                  </div>
                </div>
              </div>

              {/* Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {chapterScenarios.map((scenario) => {
                  const isCompleted = completedScenarioIds.includes(scenario.id);
                  const chosenId = decisions[scenario.id];
                  const chosenChoice = scenario.choices.find((c) => c.id === chosenId);

                  return (
                    <button
                      key={scenario.id}
                      onClick={() => {
                        sounds.playChoiceSelect();
                        onSelectScenario(scenario.id);
                      }}
                      className={`group text-left rounded-2xl p-4 border transition-all flex flex-col justify-between gap-3 relative overflow-hidden ${
                        isCompleted
                          ? 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/60'
                          : 'bg-slate-900/90 border-slate-800/80 hover:border-indigo-500/50 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-indigo-400 font-semibold">
                            #{scenario.order}
                          </span>
                          {isCompleted ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Đã chơi
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                              Sẵn sàng
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                          {scenario.title}
                        </h3>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {scenario.subtitle}
                        </p>
                      </div>

                      {/* Decision status if completed */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        {isCompleted && chosenChoice ? (
                          <div className="flex items-center gap-1.5 truncate">
                            <span className="font-mono font-bold text-indigo-400">[{chosenChoice.id}]</span>
                            <span className="text-slate-400 truncate text-[11px]">
                              {chosenChoice.label}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Chưa đưa ra quyết định
                          </span>
                        )}

                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
