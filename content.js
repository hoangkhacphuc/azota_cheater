// URL của API trả về danh sách câu hỏi và kết quả
const API_URL = "aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2hvYW5na2hhY3BodWMvYXpvdGFfY2hlYXRlci9yZWZzL2hlYWRzL21haW4vZGF0YS5qc29u"; // Thay bằng URL của bạn
const LIMIT = 5;
var count = 0;

function getQuestions() {
    const element = document.querySelector("app-sort-essay-files-box");

    if (element) {
        const parent = element.parentElement;
        var childs = Array.from(parent.children);
        childs.shift();
        if (childs.length === 0) {
            return false;
        }

        var questions = [];

        // Tìm element chứa câu hỏi: .question-standalone-content-box
        Array.prototype.forEach.call(childs, (child) => {
            const questionElement = child.querySelector(
                ".question-standalone-main-content .question-standalone-content-box.ng-star-inserted"
            );
            if (!questionElement) {
                return;
            }

            const listAnswer =
                child.querySelectorAll(".list-answer>div");
            
            if (!listAnswer) {
                return;
            }

            var answers = [];
            Array.prototype.forEach.call(listAnswer, (answer) => {
                const elm = answer.querySelector("azt-dynamic-hook>span");
                if (!elm) {
                    return;
                }
                answers.push({
                    text: elm.textContent.trim(),
                    element: elm,
                });
            });

            const questionText = questionElement.textContent.trim();
            if (!questionText) {
                return;
            }

            questions.push({
                text: questionText.trim().toLowerCase(),
                element: questionElement.querySelector("azt-dynamic-hook>span"),
                answers: answers,
            });
        });

        return questions;
    } else {
        console.log("Không tìm thấy phần tử có tag app-sort-essay-files-box.");
    }
}

const cheat = async function () {
    try {
        // Fetch danh sách câu hỏi và kết quả từ API
        const response = await fetch(atob(API_URL));
        if (!response.ok) throw new Error("Failed to fetch API");

        const apiData = await response.json(); // Danh sách câu hỏi từ API

        // Kiểm tra xem API có trả về dữ liệu không
        if (!Array.isArray(apiData) || apiData.length === 0) {
            throw new Error("Invalid API data");
        } else {
            console.log(`Fetched ${apiData.length} questions from API`);
        }

        // Tìm tất cả các câu hỏi trên trang
        const questions = getQuestions();

        Array.prototype.forEach.call(questions, (question) => {
            // Tìm câu hỏi trong danh sách câu hỏi từ API
            const foundQuestion = apiData.find((q) => {
                return q.question.trim().toLowerCase() === question.text;
            });

            if (foundQuestion && count < LIMIT) {
                // Tìm câu trả lời trong danh sách câu trả lời của câu hỏi
                const foundAnswer = question.answers.find((answer) => {
                    return answer.text === foundQuestion.answer;
                });

                if (foundAnswer) {
                    foundAnswer.element.textContent += '..';
                    count++;
                }
            }
        });
        
        console.log(`Đã tìm thấy ${count} câu trả lời.`);
    } catch (error) {
        console.error("Error processing questions:", error);
    }
};

// Nếu nhấn tổ hợp phím A + B + C thì thực hiện cheat
const keysPressed = new Set();

document.addEventListener('keydown', (event) => {
    keysPressed.add(event.key.toLowerCase());

    if (keysPressed.has('a') && keysPressed.has('b') && keysPressed.has('c')) {
        console.log("Cheat started!");
        cheat();
    }
});

document.addEventListener('keyup', (event) => {
    keysPressed.delete(event.key.toLowerCase());
});
