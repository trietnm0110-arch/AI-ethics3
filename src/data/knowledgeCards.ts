import { KnowledgeCard } from '../types/game';

export const KNOWLEDGE_CARDS: Record<string, KnowledgeCard> = {
  card_plagiarism: {
    id: 'card_plagiarism',
    title: 'Plagiarism (Đạo văn)',
    titleVi: 'Đạo văn & Chiếm dụng Sở hữu Trí tuệ',
    category: 'Đạo đức Học thuật Cốt lõi',
    icon: '📖',
    summary: 'Sử dụng từ ngữ, cấu trúc, dữ liệu hoặc ý tưởng của người khác (kể cả tác phẩm do AI tạo ra) mà không ghi nhận nguồn thích hợp.',
    keyPrinciples: [
      'Ghi nhận tác giả gốc bằng trích dẫn trong bài (in-text citation) và danh mục tài liệu tham khảo (references).',
      'Đạo văn không chỉ là sao chép từng chữ, mà còn là sao chép mạch lập luận hoặc ý tưởng cốt lõi.',
      'Sử dụng AI để viết bài rồi tự nhận là do mình viết cũng là một hình thái chiếm đoạt quyền tác giả (Intellectual Misattribution).',
    ],
    doAndDont: {
      do: [
        'Đặt trích dẫn nguyên văn trong ngoặc kép kèm số trang cụ thể.',
        'Diễn đạt lại (paraphrase) bằng tư duy riêng và vẫn ghi nguồn tác giả.',
        'Khai báo công cụ AI hỗ trợ theo đúng quy định của trường/khoa.',
      ],
      dont: [
        'Không copy nguyên đoạn văn bản của AI và nộp dưới tên của mình.',
        'Không lấy số liệu hoặc câu chữ của bài báo khác mà giấu nguồn gốc.',
        'Không nghĩ rằng "đổi vài từ đồng nghĩa" thì không còn là đạo văn.',
      ],
    },
    universityPolicyQuote: '“Sinh viên nộp tác phẩm mang tên mình đồng nghĩa với việc cam kết tác phẩm đó phản ánh năng lực và tư duy trung thực của chính bản thân.”',
  },

  card_ai_assistance: {
    id: 'card_ai_assistance',
    title: 'AI Assistance vs. Generation',
    titleVi: 'Hỗ trợ Học tập vs. Thay thế Hoàn toàn',
    category: 'Sử dụng AI Có Trách nhiệm',
    icon: '🤖',
    summary: 'Việc sử dụng AI có thể được phép trong một số nhiệm vụ (brainstorm, giải thích) nhưng bị hạn chế hoặc cấm trong nhiệm vụ khác (viết bài thi, sinh lời giải).',
    keyPrinciples: [
      'AI là "Trợ lý động não" (Brainstorming Partner), không phải "Người làm bài hộ" (Ghostwriter).',
      'Mục tiêu của bài tập đại học là rèn luyện tư duy phản biện, kỹ năng tổng hợp và lập luận cá nhân.',
      'Nếu AI làm thay toàn bộ phần tư duy, sinh viên sẽ đánh mất cơ hội tích lũy năng lực nghề nghiệp.',
    ],
    doAndDont: {
      do: [
        'Hỏi AI các góc nhìn phản biện hoặc phản bác lại luận điểm của bạn để mài giũa tư duy.',
        'Nhờ AI giải thích những thuật ngữ khoa học khó hiểu với ví dụ đời thường.',
        'Tự mình chắt lọc, chọn lọc và viết lại bài theo phong cách học thuật cá nhân.',
      ],
      dont: [
        'Không yêu cầu AI "Viết cho tôi toàn bộ bài luận 2000 từ".',
        'Không để AI quyết định lập luận đạo đức hay kết luận của nghiên cứu.',
        'Không phụ thuộc vào AI khiến bản thân không thể bảo vệ miệng bài làm trước hội đồng.',
      ],
    },
    universityPolicyQuote: '“Công cụ AI chỉ có giá trị khi nó nâng đỡ tư duy của người học, chứ không thể dùng để che đậy sự thiếu vắng tư duy.”',
  },

  card_ai_hallucination: {
    id: 'card_ai_hallucination',
    title: 'AI Hallucination (Ảo giác AI)',
    titleVi: 'Cạm bẫy Bịa đặt & Tài liệu Tham khảo Ảo',
    category: 'Kiểm chứng Khoa học',
    icon: '🔍',
    summary: 'AI có thể tự tin tạo ra thông tin, số liệu thống kê hoặc danh mục trích dẫn hoàn toàn không có thật ngoài đời thực.',
    keyPrinciples: [
      'LLM hoạt động dựa trên dự đoán xác suất từ ngữ tiếp theo, không phải một cơ sở dữ liệu tra cứu sự thật.',
      'AI thường tạo ra tên bài báo nghe rất chuyên ngành, ghép tên các giáo sư nổi tiếng kèm số DOI giả.',
      'Trách nhiệm kiểm chứng sự thật (Fact-checking) luôn thuộc 100% về phía sinh viên nộp bài.',
    ],
    doAndDont: {
      do: [
        'Tra cứu từng bài báo trên Google Scholar, PubMed, IEEE Xplore hoặc Thư viện trường.',
        'Đọc trực tiếp bài báo gốc trước khi trích dẫn vào tiểu luận.',
        'Kiểm tra tính nhất quán của số liệu thống kê với các báo cáo chính thức.',
      ],
      dont: [
        'Không bao giờ nhắm mắt copy danh mục tài liệu tham khảo do AI gợi ý.',
        'Không tin tưởng các số liệu phần trăm (%) mà không có đường link tài liệu gốc.',
        'Không ngụy tạo citation để bù cho đủ số lượng tài liệu giảng viên yêu cầu.',
      ],
    },
    universityPolicyQuote: '“Bịa đặt hoặc làm sai lệch tài liệu tham khảo là hành vi vi phạm nghiêm trọng liêm chính học thuật (Academic Falsification).”',
  },

  card_disclosure: {
    id: 'card_disclosure',
    title: 'AI Disclosure (Minh bạch Khai báo)',
    titleVi: 'Minh bạch Khai báo Sử dụng AI',
    category: 'Quy chuẩn Học thuật',
    icon: '📝',
    summary: 'Nhiều môn học yêu cầu sinh viên nêu rõ công cụ AI đã dùng, mục đích sử dụng và nhật ký các câu lệnh chính (Prompts).',
    keyPrinciples: [
      'Minh bạch là biểu hiện cao nhất của liêm chính học thuật trong thời đại số.',
      'Khai báo rõ ràng giúp giảng viên đánh giá đúng quy trình làm việc và nỗ lực của sinh viên.',
      'Sử dụng AI mà giấu giếm khi quy chế yêu cầu khai báo sẽ bị tính là hành vi gian dối (Misrepresentation).',
    ],
    doAndDont: {
      do: [
        'Đính kèm đoạn "AI Disclosure Statement" ở cuối bài hoặc trang bìa.',
        'Nêu rõ công cụ (ví dụ ChatGPT-4o, Claude 3.5), ngày truy cập và phạm vi hỗ trợ.',
        'Lưu lại lịch sử trò chuyện (Chat history) làm bằng chứng minh bạch nếu được yêu cầu.',
      ],
      dont: [
        'Không im lặng hy vọng giảng viên không nhận ra.',
        'Không khai báo qua loa sai lệch so với thực tế mức độ phụ thuộc vào AI.',
        'Không xóa dấu vết trò chuyện khi môn học yêu cầu nộp kèm nhật ký nghiên cứu.',
      ],
    },
    universityPolicyQuote: '“Sự trung thực trong phương pháp nghiên cứu quý giá hơn một kết quả hoàn hảo nhưng thiếu minh bạch.”',
  },

  card_patchwriting: {
    id: 'card_patchwriting',
    title: 'Patchwriting & Text Spinning',
    titleVi: 'Đạo văn Chắp vá & Chiêu thức Đổi từ',
    category: 'Kỹ năng Viết Học thuật',
    icon: '✂️',
    summary: 'Thay đổi một số từ ngữ bằng từ đồng nghĩa hoặc dùng công cụ paraphrase giữ nguyên cấu trúc vẫn bị coi là đạo văn.',
    keyPrinciples: [
      'Paraphrase thực thụ đòi hỏi sự chuyển hóa nhận thức: hiểu sâu rồi diễn đạt lại bằng tư duy độc lập.',
      'Dùng công cụ "Text Spinner" hoặc "AI Humanizer" chỉ là hành vi che giấu dấu vết kỹ thuật.',
      'Hội đồng liêm chính đánh giá tính nguyên bản dựa trên tư duy, lập luận và đóng góp mới của sinh viên.',
    ],
    doAndDont: {
      do: [
        'Tóm tắt ý chính từ trí nhớ sau khi đã đọc và nghiền ngẫm tài liệu gốc.',
        'Sử dụng ví dụ và trường hợp thực tế của riêng bạn để minh họa lý thuyết.',
        'So sánh nhiều quan điểm khác nhau thay vì chỉ bám vào một đoạn văn mẫu của AI.',
      ],
      dont: [
        'Không dùng AI đổi từ lắt léo cốt để hạ điểm Turnitin.',
        'Không giữ nguyên cấu trúc ngữ pháp từng câu của văn bản gốc.',
        'Không tin vào các công cụ quảng cáo "làm biến mất 100% dấu vết AI".',
      ],
    },
    universityPolicyQuote: '“Văn phong học thuật là sự phản chiếu của tư duy khoa học, không phải trò chơi tráo đổi từ ngữ.”',
  },

  card_unauthorized_collusion: {
    id: 'card_unauthorized_collusion',
    title: 'Unauthorized Collusion',
    titleVi: 'Cộng tác Bất hợp pháp & Bài thi Độc lập',
    category: 'Quy chế Thi & Kiểm tra',
    icon: '👥',
    summary: 'Khi ranh giới giữa trao đổi học tập và hỗ trợ trái phép trong các bài tập/bài thi cá nhân bị vượt qua.',
    keyPrinciples: [
      'Bài thi cá nhân (Take-home Exam, Quiz) đòi hỏi nỗ lực độc lập tuyệt đối.',
      'Chia sẻ bài làm cũ cho bạn bè để họ nộp lại hoặc dùng AI rewrite đều khiến cả hai bên chịu trách nhiệm kỷ luật.',
      'Giúp đỡ bạn bè đúng cách là giảng giải phương pháp, không phải cung cấp sẵn sản phẩm.',
    ],
    doAndDont: {
      do: [
        'Chỉ chia sẻ phương pháp học, sơ đồ tư duy hoặc tài liệu tham khảo chung.',
        'Thảo luận trong giới hạn bài tập nhóm được giảng viên cho phép chính thức.',
        'Khuyên bạn liên hệ giảng viên hoặc trợ giảng khi gặp khó khăn về bài vở.',
      ],
      dont: [
        'Không gửi nguyên file bài tập đã hoàn chỉnh cho người khác "tham khảo format".',
        'Không lập nhóm bí mật để dùng AI giải đề thi cá nhân.',
        'Không đứng tên hộ phần bài làm của thành viên không đóng góp.',
      ],
    },
    universityPolicyQuote: '“Liêm chính trong kiểm tra đánh giá đảm bảo sự công bằng cho tất cả người học trong một cộng đồng học thuật.”',
  },

  card_syllabus_authority: {
    id: 'card_syllabus_authority',
    title: 'Syllabus Authority & Grey Zones',
    titleVi: 'Quyền hạn Đề cương & Vùng Xám Học thuật',
    category: 'Quy chế & Quy tắc Nhà trường',
    icon: '⚖️',
    summary: 'Không có một quy định AI chung cho mọi môn. Đề cương chi tiết (Syllabus) và hướng dẫn của giảng viên là căn cứ quyết định.',
    keyPrinciples: [
      'Môn Lập trình có thể cho phép dùng GitHub Copilot, nhưng môn Giải thuật căn bản có thể cấm hoàn toàn.',
      'Môn Tiếng Anh học thuật có thể cấm AI viết lại câu nhưng cho phép dùng từ điển tra từ vựng.',
      'Khi gặp nghi vấn trong vùng xám (Grey Zone), nghĩa vụ chủ động hỏi thuộc về người học.',
    ],
    doAndDont: {
      do: [
        'Đọc kỹ mục "Academic Integrity & AI Policy" trong Syllabus vào đầu mỗi kỳ học.',
        'Gửi email hỏi giảng viên trước khi áp dụng công cụ mới vào bài kiểm tra.',
        'Lưu giữ phản hồi bằng văn bản của giảng viên để làm căn cứ nếu có thắc mắc sau này.',
      ],
      dont: [
        'Không suy đoán bừa rằng "thầy cô môn khác cho phép thì môn này cũng thế".',
        'Không ngần ngại trao đổi vì sợ bị đánh giá là chưa hiểu bài.',
        'Không bỏ qua phần hướng dẫn nộp bài (rubric & submission guidelines).',
      ],
    },
    universityPolicyQuote: '“Khi có nghi ngờ, sự chủ động đối thoại luôn là giải pháp an toàn và chuyên nghiệp nhất của một học giả tương lai.”',
  },

  card_group_responsibility: {
    id: 'card_group_responsibility',
    title: 'Group Accountability & Co-ownership',
    titleVi: 'Trách nhiệm Liên đới trong Bài tập Nhóm',
    category: 'Làm việc Nhóm & Liêm chính',
    icon: '🤝',
    summary: 'Trong bài tập nhóm, tất cả thành viên cùng đứng tên đều phải chịu trách nhiệm đạo đức về toàn bộ nội dung của bài nộp.',
    keyPrinciples: [
      'Không thể nói "Đoạn đó do bạn khác nộp nên em không biết có đạo văn hay không".',
      'Cần có quy ước nội bộ nhóm về việc sử dụng AI ngay từ buổi họp đầu tiên.',
      'Kiểm tra chéo (Peer checking) nội dung và tài liệu tham khảo là nghĩa vụ của mọi thành viên.',
    ],
    doAndDont: {
      do: [
        'Thống nhất công cụ AI nào được phép sử dụng trong đề án nhóm.',
        'Tổ chức buổi phản biện nội bộ để mọi thành viên đều hiểu toàn bộ bài làm.',
        'Thẳng thắn nhắc nhở đồng đội nếu phát hiện nội dung có dấu hiệu copy hoặc ảo giác AI.',
      ],
      dont: [
        'Không phó mặc toàn bộ một phần bài cho một người mà không đọc lại.',
        'Không bao che hành vi gian lận của bạn trong nhóm.',
        'Không dùng AI làm ẩu phần của mình rồi đẩy gánh nặng kiểm tra cho người khác.',
      ],
    },
    universityPolicyQuote: '“Liêm chính tập thể được xây dựng từ sự minh bạch và tinh thần trách nhiệm của từng cá nhân đối với sản phẩm chung.”',
  },
};
