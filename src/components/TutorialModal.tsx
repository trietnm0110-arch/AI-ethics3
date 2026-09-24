import React from 'react';
import { X, Play, BookOpen, Compass, ShieldAlert, Sparkles, Award } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPlaying: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose, onStartPlaying }) => {
  if (!isOpen) return null;

  const STEPS = [
    {
      icon: '🎭',
      title: '1. Nhập vai & Bối cảnh Đời thường',
      desc: 'Mỗi tình huống là một khoảnh khắc chân thực của đời sống đại học: áp lực deadline 2 tiếng, bẫy trích dẫn ma của AI, bài thi take-home lúc nửa đêm, hay xung đột bài tập nhóm.',
    },
    {
      icon: '⚡',
      title: '2. Đưa ra Quyết định Đa chiều',
      desc: 'Game không thiết kế theo kiểu "A = tốt, B = xấu". Nhiều tình huống chứa các vùng xám đạo đức (Grey Zones) phụ thuộc vào Syllabus và bối cảnh từng môn học.',
    },
    {
      icon: '🏛️',
      title: '3. Mô phỏng Hệ quả Thực tế',
      desc: 'Trực tiếp trải nghiệm hệ quả: giảng viên mời lên vấn đáp miệng, đối thoại nhóm nảy lửa, hoặc bài nộp được tuyên dương vì tính liêm chính minh bạch.',
    },
    {
      icon: '🔍',
      title: '4. Phân tích Đạo đức (Ethics Analysis)',
      desc: 'Mỗi quyết định đều được giải phẫu chi tiết: Vấn đề nằm ở đâu? Thuộc danh mục vi phạm nào? Và cách ứng xử chuẩn mực của một học giả đại học.',
    },
    {
      icon: '🗂️',
      title: '5. Thẻ Tri Thức & Cố Vấn TS. Linh',
      desc: 'Mở khóa Knowledge Cards để tích lũy bí kíp học tập, và trò chuyện trực tiếp với Cố vấn TS. Linh (Gemini AI) bất kỳ lúc nào!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xl">
              🧭
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg">Hướng Dẫn Trải Nghiệm IntegrityQuest</h3>
              <p className="text-xs text-slate-400">Cách học tập qua quyết định và mô phỏng hệ quả</p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playBlip();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl flex-shrink-0">
                {step.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200 text-sm">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}

          {/* Ethics Meter Note */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950/40 to-indigo-500/10 border border-amber-500/30 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-200/90 leading-relaxed">
              <strong>Ethics Meter (Khởi đầu 50/100):</strong> Điểm số không dùng để phán xét ai "đạo đức hơn ai", mà là chiếc gương phản chiếu quá trình cân nhắc và phản tư của chính bạn!
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={() => {
              sounds.playBlip();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors"
          >
            Đóng
          </button>
          <button
            onClick={() => {
              sounds.playSuccess();
              onStartPlaying();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all"
          >
            <Play className="w-4 h-4" /> Bắt đầu ngay
          </button>
        </div>
      </div>
    </div>
  );
};
