// URL của API trả về danh sách câu hỏi và kết quả
const API_URL = "http://extension_azota.test/data.json"; // Thay bằng URL của bạn

(async function () {
    try {
        // Fetch danh sách câu hỏi và kết quả từ API
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch API");

        const apiData = await response.json(); // Danh sách câu hỏi từ API

        // Tìm tất cả các câu hỏi trên trang
        const questionElements = document.querySelectorAll(".question"); // Thay selector phù hợp
        const answerElements = document.querySelectorAll(".answer"); // Thay selector phù hợp

        questionElements.forEach((questionEl, index) => {
            const questionText = questionEl.innerText.trim().replace(/\.$/, ""); // Loại bỏ dấu chấm cuối câu

            // Tìm câu hỏi trong dữ liệu API
            const matchedQuestion = apiData.find(
                (q) => q.question.trim() === questionText
            );

            if (matchedQuestion) {
                const answer = matchedQuestion.answer.trim();

                // Kiểm tra và thêm dấu chấm vào đáp án đúng nếu chưa có
                const processedAnswer = answer.endsWith(".")
                    ? answer
                    : answer + ".";

                // Hiển thị kết quả xử lý trên giao diện
                answerElements[index].innerText = processedAnswer;
            } else {
                console.warn(`Question not found in API: ${questionText}`);
            }
        });
    } catch (error) {
        console.error("Error processing questions:", error);
    }
})();
