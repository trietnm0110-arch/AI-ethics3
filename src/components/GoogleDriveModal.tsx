import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  listDriveFiles,
  uploadTextFileToDrive,
  createDriveFolder,
  deleteDriveFile,
  DriveFileItem,
} from '../services/googleDriveService';
import { sounds } from '../utils/soundEffects';
import {
  FolderCheck,
  Upload,
  RefreshCw,
  Trash2,
  ExternalLink,
  FileText,
  FolderPlus,
  AlertTriangle,
  CheckCircle2,
  Search,
  X,
  Sparkles,
  Cloud,
  LogOut,
  Folder,
  Calendar,
  Layers,
} from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  reflectionData?: {
    ethicsScore: number;
    stats: {
      totalCompleted: number;
      responsibleCount: number;
      riskyCount: number;
      unlockedCardsCount: number;
      totalScenarios: number;
    };
    savedReflections: {
      hardestScenario?: string;
      boundaryReflection?: string;
      verificationSource?: string;
    };
  };
  unlockedCardsCount?: number;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  reflectionData,
  unlockedCardsCount = 0,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'files' | 'export' | 'create'>('export');

  // Operation statuses
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string; link?: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // New Note form
  const [newNoteTitle, setNewNoteTitle] = useState('Cam_Ket_Liem_Chinh_Hoc_Thuat');
  const [newNoteContent, setNewNoteContent] = useState(
    '# CAM KẾT LIÊM CHÍNH HỌC THUẬT & SỬ DỤNG AI CÓ TRÁCH NHIỆM\n\nTôi cam kết tuân thủ quy chế học thuật của nhà trường:\n1. Trung thực trong nghiên cứu và thi cử.\n2. Khai báo minh bạch mọi đóng góp của AI (AI Disclosure).\n3. Không nộp bài do AI sinh hoàn toàn mà không có kiểm chứng và tư duy cá nhân.'
  );

  // Destructive Confirmation Dialog State (Mandatory requirement from Workspace Skill)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setHasToken(!!token);
      },
      () => {
        setUser(null);
        setHasToken(false);
        setFiles([]);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Fetch files when modal opens or user signs in
  useEffect(() => {
    if (isOpen && hasToken) {
      loadFiles();
    }
  }, [isOpen, hasToken]);

  const loadFiles = async (query = searchQuery) => {
    try {
      setIsLoadingFiles(true);
      const items = await listDriveFiles(query);
      setFiles(items);
    } catch (err: any) {
      console.error('Error fetching Drive files:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Không thể tải danh sách tệp từ Google Drive.' });
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setHasToken(true);
        sounds.playSuccess();
        setStatusMessage({ type: 'success', text: `Đã kết nối thành công tài khoản Google: ${result.user.email}` });
        setTimeout(() => loadFiles(), 500);
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Đăng nhập Google Drive thất bại.' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
      setHasToken(false);
      setFiles([]);
      setStatusMessage({ type: 'success', text: 'Đã ngắt kết nối với Google Drive an toàn.' });
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  // Export Reflection to Google Drive
  const handleExportReflection = async () => {
    if (!hasToken) {
      handleSignIn();
      return;
    }

    setIsExporting(true);
    setStatusMessage(null);
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString('vi-VN');
      const score = reflectionData?.ethicsScore ?? 85;
      const stats = reflectionData?.stats;
      const reflections = reflectionData?.savedReflections;

      const markdownContent = `# 🎓 INTEGRITYQUEST - BÁO CÁO LIÊM CHÍNH HỌC THUẬT & ĐẠO ĐỨC AI
**Ngày tạo:** ${dateStr} ${timeStr}  
**Người thực hiện:** ${user?.displayName || 'Sinh viên'} (${user?.email || 'N/A'})  
**Ứng dụng:** IntegrityQuest Simulator  

---

## 1. KẾT QUẢ ĐÁNH GIÁ (ETHICS SCORECARD)
- **Điểm Liêm Chính (Ethics Score):** ${score}/100
- **Số tình huống đã phân tích:** ${stats?.totalCompleted || 4}/${stats?.totalScenarios || 4}
- **Quyết định chuẩn mực trách nhiệm:** ${stats?.responsibleCount || 0}
- **Quyết định rủi ro đã rà soát:** ${stats?.riskyCount || 0}
- **Thẻ tri thức mở khóa:** ${stats?.unlockedCardsCount || unlockedCardsCount} thẻ

---

## 2. BẢN TỰ PHẢN TƯ CÁ NHÂN (STUDENT REFLECTION)
### Câu hỏi 1: Tình huống nan giải & khó quyết định nhất
> *"${reflections?.hardestScenario || 'Sinh viên nhận thức được tầm quan trọng của việc tự chủ trong học tập khi đối diện áp lực deadline.'}"*

### Câu hỏi 2: Ranh giới giữa AI Hỗ trợ (Assistance) và AI Làm thay (Generated)
> *"${reflections?.boundaryReflection || 'Ranh giới nằm ở khả năng giải trình và làm chủ kiến thức. AI là người cộng sự gợi mở, không phải là người làm thay năng lực tư duy.'}"*

### Câu hỏi 3: Quy trình kiểm chứng khi chưa rõ quy định
> *"${reflections?.verificationSource || 'Tham khảo kỹ Syllabus môn học, quy chế liêm chính của nhà trường và trao đổi thẳng thắn cùng giảng viên hướng dẫn.'}"*

---

## 3. BẢNG CAM KẾT SỬ DỤNG AI CÓ TRÁCH NHIỆM (AI DISCLOSURE STATEMENT)
> *"Tôi xin cam kết mọi sản phẩm học thuật, bài tiểu luận và nghiên cứu của bản thân luôn được thực hiện với tinh thần liêm chính cao nhất. Mọi sự hỗ trợ từ công cụ trí tuệ nhân tạo (AI) đều được khai báo minh bạch, có kiểm chứng nguồn gốc và tự chịu trách nhiệm về nội dung."*

*Ký tên số qua Google Workspace:* **${user?.displayName || 'Sinh viên'}**
`;

      const fileName = `IntegrityQuest_BanPhanTu_${dateStr}.md`;
      const uploaded = await uploadTextFileToDrive(fileName, markdownContent, 'text/markdown');

      sounds.playSuccess();
      setStatusMessage({
        type: 'success',
        text: `Đã lưu thành công tệp "${uploaded.name}" lên Google Drive!`,
        link: uploaded.webViewLink,
      });

      loadFiles();
    } catch (err: any) {
      console.error('Export error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Lưu tệp lên Google Drive thất bại.' });
    } finally {
      setIsExporting(false);
    }
  };

  // Export Knowledge Guidelines
  const handleExportKnowledgeGuidelines = async () => {
    if (!hasToken) {
      handleSignIn();
      return;
    }

    setIsExporting(true);
    setStatusMessage(null);
    try {
      const dateStr = new Date().toISOString().split('T')[0];
      const content = `# BỘ QUY TẮC ĐẠO ĐỨC AI & TRÍCH DẪN CHUẨN MỰC
**Nguồn:** IntegrityQuest Academic Ethics Guide  
**Ngày lưu:** ${dateStr}  

### 1. Phân biệt AI Assistance vs AI Plagiarism
- **Hợp lệ:** Brainstorm ý tưởng, giải thích thuật ngữ khó, sửa lỗi ngữ pháp cơ bản, tóm tắt bài báo để đọc nhanh.
- **Gian lận:** Copy nguyên văn văn bản AI sinh, dùng AI paraphrase để che giấu nguồn gốc, nhờ AI làm bài thi/take-home test, bịa nguồn tài liệu (hallucination).

### 2. Mẫu Khai Báo Sử Dụng AI (AI Disclosure Statement)
"Tôi xác nhận có sử dụng công cụ AI (ví dụ: Claude/ChatGPT) nhằm mục đích gợi ý cấu trúc dàn ý cho bài viết. Mọi số liệu, lập luận chi tiết và văn phong diễn đạt cuối cùng đều do tôi tự nghiên cứu, kiểm chứng và hoàn thiện."

### 3. Nguyên tắc 4C trong kiểm chứng thông tin
- **Check Sources:** Luôn tìm tài liệu gốc được bình duyệt (peer-reviewed).
- **Compare:** So sánh nhiều nguồn độc lập.
- **Context:** Đặt trong bối cảnh học thuật của ngành.
- **Clarify:** Hỏi trực tiếp giảng viên khi có nghi vấn.
`;

      const fileName = `IntegrityQuest_QuyTacLiemChinh_${dateStr}.md`;
      const uploaded = await uploadTextFileToDrive(fileName, content, 'text/markdown');

      sounds.playSuccess();
      setStatusMessage({
        type: 'success',
        text: `Đã lưu cẩm nang đạo đức "${uploaded.name}" lên Google Drive!`,
        link: uploaded.webViewLink,
      });

      loadFiles();
    } catch (err: any) {
      console.error('Export error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Lỗi khi lưu lên Drive.' });
    } finally {
      setIsExporting(false);
    }
  };

  // Create Custom Note
  const handleCreateCustomNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasToken) {
      handleSignIn();
      return;
    }

    setIsExporting(true);
    setStatusMessage(null);
    try {
      const cleanTitle = newNoteTitle.trim().endsWith('.md') ? newNoteTitle.trim() : `${newNoteTitle.trim()}.md`;
      const uploaded = await uploadTextFileToDrive(cleanTitle, newNoteContent, 'text/markdown');

      sounds.playSuccess();
      setStatusMessage({
        type: 'success',
        text: `Đã tạo tệp "${uploaded.name}" thành công trên Google Drive!`,
        link: uploaded.webViewLink,
      });

      setActiveTab('files');
      loadFiles();
    } catch (err: any) {
      console.error('Create note error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Không thể tạo tệp mới trên Drive.' });
    } finally {
      setIsExporting(false);
    }
  };

  // Create Dedicated Folder
  const handleCreateEthicsFolder = async () => {
    if (!hasToken) {
      handleSignIn();
      return;
    }

    try {
      setStatusMessage(null);
      const folder = await createDriveFolder('IntegrityQuest - AI & Academic Ethics');
      sounds.playSuccess();
      setStatusMessage({
        type: 'success',
        text: `Đã tạo thư mục "${folder.name}" trên Google Drive!`,
        link: folder.webViewLink,
      });
      loadFiles();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'Không thể tạo thư mục trên Drive.' });
    }
  };

  // Confirm and delete file (MANDATORY explicit user confirmation dialog)
  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      sounds.playBlip();
      setStatusMessage({
        type: 'success',
        text: `Đã xóa tệp "${fileToDelete.name}" khỏi Google Drive theo yêu cầu của bạn.`,
      });
      setFileToDelete(null);
      loadFiles();
    } catch (err: any) {
      console.error('Delete error:', err);
      setStatusMessage({ type: 'error', text: err?.message || 'Không thể xóa tệp khỏi Drive.' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            {/* Google Drive Official Color Logo */}
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Google Drive Hub</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Lưu trữ báo cáo liêm chính, bộ quy tắc đạo đức và đồng bộ tài liệu nghiên cứu
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Bar */}
        <div className="bg-slate-950/40 px-6 py-3 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {hasToken && user ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-indigo-500/40" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100">{user.displayName || 'Tài khoản Google'}</span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Đã liên kết Drive
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">{user.email}</span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
                title="Ngắt kết nối Google Drive"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3 py-1">
              <div className="text-xs text-slate-300">
                <span className="font-semibold text-white">Chưa kết nối Google Drive.</span> Đăng nhập để lưu báo cáo phản tư và đồng bộ tài liệu.
              </div>

              {/* Official Google Sign-in Button */}
              <button
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="gsi-material-button shadow-md disabled:opacity-50"
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">
                    {isLoggingIn ? 'Đang kết nối...' : 'Sign in with Google'}
                  </span>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Status Message Notification */}
        {statusMessage && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>

            {statusMessage.link && (
              <a
                href={statusMessage.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-semibold underline text-blue-300 hover:text-blue-200 shrink-0 ml-3"
              >
                <span>Mở trên Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 text-xs">
          <button
            onClick={() => {
              sounds.playBlip();
              setActiveTab('export');
            }}
            className={`pb-2.5 font-semibold transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'export' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Xuất tài liệu Liêm chính</span>
            {activeTab === 'export' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playBlip();
              setActiveTab('files');
              if (hasToken) loadFiles();
            }}
            className={`pb-2.5 font-semibold transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'files' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderCheck className="w-4 h-4" />
            <span>Tệp của tôi trên Drive ({files.length})</span>
            {activeTab === 'files' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => {
              sounds.playBlip();
              setActiveTab('create');
            }}
            className={`pb-2.5 font-semibold transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'create' ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Tạo ghi chú mới</span>
            {activeTab === 'create' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: QUICK EXPORTS */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card 1: Reflection Report */}
                <div className="bg-slate-950/60 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Bản Phản Tư & Điểm Liêm Chính</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Lưu toàn bộ điểm số Ethics Score ({reflectionData?.ethicsScore ?? 85}/100), các quyết định đã chọn, và 3 câu trả lời tự phản tư của bạn thành tài liệu chuẩn Markdown lên Google Drive.
                    </p>
                  </div>

                  <button
                    onClick={handleExportReflection}
                    disabled={isExporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang xuất lên Drive...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{hasToken ? 'Xuất Bản Phản Tư lên Drive' : 'Đăng nhập & Xuất lên Drive'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Export Card 2: Knowledge Guidelines & Rules */}
                <div className="bg-slate-950/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 group">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Bộ Quy Tắc Đạo Đức & Trích Dẫn AI</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Cẩm nang các quy chuẩn trích dẫn nguồn, mẫu khai báo AI Disclosure Statement theo chuẩn APA/IEEE và nguyên tắc 4C khi kiểm tra ảo giác (hallucination).
                    </p>
                  </div>

                  <button
                    onClick={handleExportKnowledgeGuidelines}
                    disabled={isExporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center justify-center gap-2"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Lưu Cẩm Nang lên Drive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Create dedicated study folder */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <FolderPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200">Thư mục nghiên cứu trên Drive</span>
                    <p className="text-[11px] text-slate-400">Tạo thư mục "IntegrityQuest - AI & Academic Ethics" để phân loại tệp gọn gàng</p>
                  </div>
                </div>

                <button
                  onClick={handleCreateEthicsFolder}
                  disabled={!hasToken}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tạo thư mục</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FILES LIST */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              {/* Search & Refresh Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') loadFiles();
                    }}
                    placeholder="Tìm kiếm tệp trên Google Drive..."
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <button
                  onClick={() => loadFiles()}
                  disabled={isLoadingFiles || !hasToken}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-40"
                  title="Tải lại danh sách"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Files Table / List */}
              {!hasToken ? (
                <div className="text-center py-10 space-y-3 bg-slate-950/30 rounded-2xl border border-slate-800">
                  <Cloud className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Vui lòng đăng nhập Google Drive để xem và quản lý các tệp đã lưu.</p>
                  <button
                    onClick={handleSignIn}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Đăng nhập Google Drive
                  </button>
                </div>
              ) : isLoadingFiles ? (
                <div className="text-center py-12 space-y-2">
                  <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Đang đồng bộ danh sách tệp từ Google Drive...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-10 space-y-2 bg-slate-950/30 rounded-2xl border border-slate-800">
                  <Folder className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">Chưa tìm thấy tệp nào phù hợp trên Google Drive.</p>
                  <button
                    onClick={() => setActiveTab('export')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                  >
                    Xuất Bản Phản Tư ngay
                  </button>
                </div>
              ) : (
                <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60 bg-slate-950/40">
                  {files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                    return (
                      <div
                        key={file.id}
                        className="px-4 py-3 flex items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                            {isFolder ? (
                              <Folder className="w-4 h-4 text-amber-400" />
                            ) : (
                              <FileText className="w-4 h-4 text-blue-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-slate-200 truncate group-hover:text-indigo-300 transition-colors">
                              {file.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                              {file.modifiedTime && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(file.modifiedTime).toLocaleDateString('vi-VN')}
                                </span>
                              )}
                              <span>•</span>
                              <span>{isFolder ? 'Thư mục' : file.size ? `${Math.round(parseInt(file.size) / 1024)} KB` : 'Tài liệu'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                              title="Mở trên Google Drive"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() => {
                              sounds.playBlip();
                              setFileToDelete(file);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="Xóa tệp khỏi Google Drive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATE CUSTOM NOTE */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateCustomNote} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Tên tệp (File Name)
                </label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="Vi_du_Ghi_chu_Liem_Chinh.md"
                  required
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Nội dung ghi chú Markdown
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={8}
                  required
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isExporting}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  {isExporting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  <span>{hasToken ? 'Lưu tệp vào Google Drive' : 'Đăng nhập & Lưu tệp'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-indigo-400" />
            Bảo mật với OAuth 2.0 Client-Side Tokens (không lưu mã bí mật)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
          >
            Đóng
          </button>
        </div>

        {/* MANDATORY EXPLICIT CONFIRMATION MODAL FOR DESTRUCTIVE ACTION (DELETE FILE) */}
        {fileToDelete && (
          <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base font-bold text-white">Xác nhận xóa tệp từ Google Drive?</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Bạn có chắc chắn muốn xóa vĩnh viễn tệp <strong className="text-rose-300">"{fileToDelete.name}"</strong> khỏi tài khoản Google Drive của bạn không?
                </p>
                <p className="text-[11px] text-amber-400/90 font-medium">
                  ⚠️ Hành động này sẽ tác động trực tiếp lên dữ liệu đám mây của bạn và không thể hoàn tác!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Hủy bỏ
                </button>

                <button
                  type="button"
                  onClick={confirmDeleteFile}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5"
                >
                  {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  <span>{isDeleting ? 'Đang xóa...' : 'Xác nhận xóa tệp'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
