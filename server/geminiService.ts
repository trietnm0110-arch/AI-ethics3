import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const DR_LINH_SYSTEM_INSTRUCTION = `Bạn là TS. Linh (Dr. Linh) - Giảng viên kiêm Cố vấn Liêm chính Học thuật (Academic Integrity Counselor) tại trường đại học.
Bạn đồng hành cùng sinh viên (như Alex, Mia, Minh) trong việc giải đáp các thắc mắc về:
1. Quy định sử dụng AI trong học tập, nghiên cứu, viết tiểu luận, làm đồ án tốt nghiệp.
2. Phân biệt rõ rệt giữa:
   - "Hỗ trợ học tập hợp lệ" (brainstorm ý tưởng, giải thích khái niệm khó, rà soát ngữ pháp nhẹ nhàng).
   - "Đạo văn & Gian lận" (copy-paste, paraphrase che giấu, làm bài hộ, sinh citation ảo - hallucination, thi cử gian lận).
3. Cách khai báo minh bạch (AI Disclosure Statement) theo chuẩn APA/IEEE/Harvard hoặc quy chế nhà trường.
4. Lời khuyên khi gặp áp lực deadline hoặc bài tập khó mà không cần phải vi phạm đạo đức.

Phong cách đối thoại:
- Giọng văn ân cần, mang tính giáo dục, tôn trọng người học, thấu hiểu áp lực sinh viên nhưng kiên định về nguyên tắc liêm chính.
- Không phán xét quy chụp, luôn khuyến khích sinh viên kiểm tra kỹ Syllabus và trao đổi trực tiếp với giảng viên phụ trách môn học.
- Trả lời bằng tiếng Việt gãy gọn, có ví dụ cụ thể, chia các ý bằng gạch đầu dòng rõ ràng.`;

export async function handleChatWithGemini(messages: Array<{ role: 'user' | 'model'; content: string }>) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Return an intelligent fallback from Dr. Linh when API key is unconfigured
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
    if (lastUserMsg.includes('khai báo') || lastUserMsg.includes('disclosure')) {
      return `Chào bạn, TS. Linh đây! Về việc **khai báo sử dụng AI (AI Disclosure)**:
- **Khi nào cần?**: Khi syllabus hoặc trường yêu cầu, hoặc bất kỳ khi nào AI đóng góp vào quá trình xây dựng ý tưởng, biên tập cấu trúc hay phân tích dữ liệu.
- **Mẫu khai báo chuẩn ngắn gọn**:
  *"Tôi xác nhận có sử dụng công cụ AI (ví dụ: Claude/ChatGPT) trong việc gợi ý cấu trúc dàn ý cho Phần 2. Mọi lập luận, phân tích số liệu và câu chữ cuối cùng đều do tôi tự nghiên cứu, kiểm chứng và hoàn thiện."*
- **Nguyên tắc vàng**: Thà thừa nhận minh bạch còn hơn để giảng viên phát hiện sự thiếu trung thực!`;
    }

    if (lastUserMsg.includes('paraphrase') || lastUserMsg.includes('đạo văn')) {
      return `Chào em! TS. Linh rất vui vì em đã hỏi câu này:
- **Paraphrase chân chính**: Em đọc hiểu thấu đáo tài liệu gốc, gập tài liệu lại và diễn đạt lại toàn bộ ý tưởng bằng tư duy, từ vựng và văn phong của chính mình, kèm theo **trích dẫn nguồn gốc (in-text citation)**.
- **Patchwriting (Đạo văn chắp vá)**: Chỉ đổi vài từ đồng nghĩa (nhờ AI đổi từ), giữ nguyên cấu trúc câu hoặc không ghi nguồn tác giả ban đầu.
- Nhớ nhé: Thay đổi câu chữ không làm biến mất nghĩa vụ ghi nhận bản quyền ý tưởng của tác giả!`;
    }

    return `Chào em! Thầy là TS. Linh, cố vấn liêm chính học thuật. Trong môi trường đại học, AI là một người phụ tá đắc lực nếu em xem nó như một cuốn từ điển thông minh hay người bạn cùng động não (brainstorming partner).
Tuy nhiên, em cần nhớ nguyên tắc cốt lõi: **Sản phẩm nộp bài cuối cùng phải phản ánh tư duy và năng lực thật của chính em**.
Nếu em đang băn khoăn về một tình huống bài tập cụ thể, hãy chia sẻ rõ hơn để thầy hướng dẫn em cách xử lý đúng đắn nhé!`;
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Format messages for @google/genai
    const formattedContents = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: DR_LINH_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text || 'Xin lỗi, hiện tại thầy chưa xử lý được câu trả lời. Em vui lòng thử lại nhé!';
  } catch (error: unknown) {
    console.error('Error calling Gemini API in server:', error);
    return `Chào em! Thầy Linh nhận được câu hỏi rồi. Hiện tại hệ thống phản hồi đang bận, nhưng nguyên tắc tiên quyết là: Bất kể công cụ nào em dùng, hãy kiểm tra Syllabus môn học và trao đổi với giảng viên để đảm bảo bài làm của mình hoàn toàn liêm chính nhé!`;
  }
}
