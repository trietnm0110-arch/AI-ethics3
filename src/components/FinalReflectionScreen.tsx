import React, { useState } from 'react';
import { sounds } from '../utils/soundEffects';
import { Award, CheckCircle2, RotateCcw, Copy, Check, Sparkles, BookOpen, HeartHandshake, Compass } from 'lucide-react';

interface FinalReflectionScreenProps {
  stats: {
    totalCompleted: number;
    decisionsMade: number;
    responsibleCount: number;
    riskyCount: number;
    moderateCount: number;
    unlockedCardsCount: number;
    totalScenarios: number;
  };
  ethicsScore: number;
  savedReflections: {
    hardestScenario?: string;
    boundaryReflection?: string;
    verificationSource?: string;
  };
  onSaveReflections: (reflections: {
    hardestScenario?: string;
    boundaryReflection?: string;
    verificationSource?: string;
  }) => void;
  onReplayFromStart: () => void;
  onOpenKnowledgeCards: () => void;
  onBackToChapters: () => void;
  onOpenGoogleDrive: () => void;
}

export const FinalReflectionScreen: React.FC<FinalReflectionScreenProps> = ({
  stats,
  ethicsScore,
  savedReflections,
  onSaveReflections,
  onReplayFromStart,
  onOpenKnowledgeCards,
  onBackToChapters,
  onOpenGoogleDrive,
}) => {
  const [hardest, setHardest] = useState(savedReflections.hardestScenario || '');
  const [boundary, setBoundary] = useState(savedReflections.boundaryReflection || '');
  const [verification, setVerification] = useState(savedReflections.verificationSource || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();
    onSaveReflections({
      hardestScenario: hardest,
      boundaryReflection: boundary,
      verificationSource: verification,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopySummary = () => {
    sounds.playBlip();
    const summaryText = `🎓 INTEGRITYQUEST - HÀNH TRÌNH ĐẠO ĐỨC HỌC THUẬT & AI
• Điểm Liêm chính (Ethics Score): ${ethicsScore}/100
• Tình huống đã hoàn thành: ${stats.totalCompleted}/${stats.totalScenarios}
• Quyết định chuẩn mực trách nhiệm: ${stats.responsibleCount}
• Quyết định rủi ro cao đã trải nghiệm: ${stats.riskyCount}
• Thẻ tri thức đã mở khóa: ${stats.unlockedCardsCount}

💭 BẢN TỰ PHẢN TƯ (PERSONAL REFLECTION):
1. Tình huống khó quyết định nhất:
"${hardest || 'Đang phản tư'}"
2. Ranh giới giữa AI Assistance và AI-Generated:
"${boundary || 'Đang phản tư'}"
3. Nơi tra cứu khi không chắc chắn:
"${verification || 'Syllabus & Trao đổi cùng Giảng viên'}"

"Liêm chính là nền tảng tri thức vững chắc cho tương lai!"`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Hero Certificate Style Banner */}
      <div className="relative bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden text-center space-y-4">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 mx-auto flex items-center justify-center text-3xl shadow-xl shadow-amber-500/20">
          🎓
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-indigo-400">
            Tổng Kết Hành Trình Liêm Chính
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            YOUR AI ETHICS JOURNEY
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Bạn đã bước qua những tình huống tiến thoái lưỡng nan của đời sinh viên. Mỗi quyết định đều để lại một bài học quý giá về bản lĩnh và danh dự học thuật.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-2xl font-mono font-bold text-indigo-400">
              {stats.totalCompleted}/{stats.totalScenarios}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Tình huống đã giải quyết</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-2xl font-mono font-bold text-emerald-400">
              {stats.responsibleCount}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Lựa chọn chuẩn mực</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-2xl font-mono font-bold text-rose-400">
              {stats.riskyCount}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Quyết định rủi ro đã rà soát</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 text-center">
            <div className="text-2xl font-mono font-bold text-amber-400">
              {stats.unlockedCardsCount}
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">Thẻ tri thức mở khóa</div>
          </div>
        </div>

        {/* Ethics Score Meter summary */}
        <div className="max-w-md mx-auto pt-2">
          <div className="flex items-center justify-between text-xs mb-1 font-medium">
            <span className="text-slate-400">Điểm Liêm Chính Tổng Kết</span>
            <span className="text-indigo-300 font-mono font-bold text-sm">{ethicsScore}/100</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-1000"
              style={{ width: `${Math.max(5, ethicsScore)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-2 italic">
            *Điểm số không phân định ai "tốt/xấu", mà là chiếc la bàn đo lường mức độ thận trọng và minh bạch trong các quyết định học thuật của bạn.
          </p>
        </div>
      </div>

      {/* Personal Reflection Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">Bản Tự Phản Tư Cá Nhân (Personal Reflection)</h2>
            <p className="text-xs text-slate-400">
              Dành 3 phút ghi lại cảm nghĩ chân thực để định hình thói quen học tập có trách nhiệm
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Question 1 */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200">
              1. Trong những tình huống vừa trải qua, bạn cảm thấy khó đưa ra quyết định nhất ở tình huống nào? Vì sao?
            </label>
            <textarea
              value={hardest}
              onChange={(e) => setHardest(e.target.value)}
              placeholder="Ví dụ: Tình huống bài thi Take-home lúc 2 giờ sáng hoặc khi bạn thân nài nỉ xin mượn bài cũ, vì lúc đó áp lực điểm số và tình cảm cá nhân rất lớn..."
              rows={3}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200">
              2. Theo bạn, ranh giới rõ ràng nhất giữa "AI Assistance" (hỗ trợ học tập) và "AI-Generated Work" (làm thay) nằm ở đâu?
            </label>
            <textarea
              value={boundary}
              onChange={(e) => setBoundary(e.target.value)}
              placeholder="Ví dụ: Ranh giới nằm ở năng lực giải trình. Nếu bạn có thể đứng trước giảng viên giải thích trôi chảy từng ý tưởng và số liệu bằng tư duy của mình, đó là trợ giúp; còn nếu bạn không hiểu câu chữ đó nghĩa là gì, đó là làm thay..."
              rows={3}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200">
              3. Nếu không chắc một hành vi sử dụng công nghệ có được phép hay không, bạn sẽ kiểm tra thông tin ở đâu trước tiên?
            </label>
            <textarea
              value={verification}
              onChange={(e) => setVerification(e.target.value)}
              placeholder="Ví dụ: Đọc mục Academic Integrity trong Syllabus của môn học, kiểm tra quy chế học vụ của nhà trường, và gửi email trực tiếp hỏi giảng viên phụ trách..."
              rows={2}
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Save & Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Lưu Bản Phản Tư</span>
              </button>

              {savedSuccess && (
                <span className="text-xs text-emerald-400 animate-in fade-in flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Đã lưu thành công!
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép!' : 'Sao chép kết quả'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playBlip();
                  onOpenGoogleDrive();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/40 hover:border-blue-400 text-blue-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm group"
                title="Lưu bản phản tư lên Google Drive"
              >
                <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <span>Lưu vào Google Drive</span>
              </button>

              <button
                type="button"
                onClick={onBackToChapters}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all"
              >
                Về danh sách chương
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
