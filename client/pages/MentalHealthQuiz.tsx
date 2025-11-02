import { useState } from "react";
import { auth, db, googleProvider } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc,collection, addDoc } from "firebase/firestore";
const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble sleeping or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling nervous, anxious, or on edge",
  // "Not being able to stop worrying",
  // "Trouble relaxing",
  // "Feeling irritable or easily annoyed",
  // "Feeling afraid as if something awful might happen",
  // "Have you been able to concentrate well?",
  // "Have you been feeling confident in yourself?",
  // "Have you felt capable of making decisions?",
  // "Have you enjoyed your daily activities?",
  // "Have you felt unhappy or depressed?"
];

const options = [
  "Not at all",
  "Few Days",
  "More than half the days",
  "Nearly every day"
];

export default function MentalHealthQuiz() {
   
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [result, setResult] = useState<string | null>(null);

  const next = () => {
    if (answers[current] === -1) return alert("Please select an answer!");
    if (current === questions.length - 1) return calculate();
    setCurrent(current + 1);
  };

  const prev = () => current > 0 && setCurrent(current - 1);
const [servicePage, setServicePage] = useState<string>("");

const calculate = async() => {
  if (!auth.currentUser) {
  console.log("❌ No user logged in");
  return;
}

  const total = answers.reduce((a, b) => a + b, 0);
 let feedback = "";
  let  page= "";
    let severity = "";

  if (total <= 20) {
    feedback = `🟢 Mild (Score: ${total}) — Try Yoga, Music & Journals`;
    page = "/mild"; 
      let severity = "";
  } else if (total <= 25) {
    feedback = `🟡 Moderate (Score: ${total}) — Peer Support & Positive Talk`;
    page = "/moderate"; 
      let severity = "";
  } else {
    feedback = `🔴 Severe (Score: ${total}) — Consider Professional Counselling`;
    page = "/Severe"; 
      severity = "severe";
  }
 const user = auth.currentUser;
  if (user) {
    try {
      const quizRef = collection(db, "users", user.uid, "mental_health_quiz");
      await addDoc(quizRef, {
        answers,
        score: total,
        severity,
        timestamp: new Date(),
      });

      console.log("✅ Quiz saved to Firestore!");
    } catch (error) {
      console.error("🔥 Error saving quiz:", error);
    }
  }
  setResult(feedback);
  setServicePage(page); // store page URL
};

  if (result)
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-purple-400 via-pink-300 to-blue-200">
        <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{result}</h2>
          <p className="text-gray-600 mb-6">
            Thank you for completing the self-assessment. Remember, this is only a guideline.
          </p>
          <button
            onClick={() => (window.location.href = servicePage )}
            className="mt-4 bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg font-semibold"
          >
            🌐 Explore Services
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ffe4e6] to-[#ccfbf1] p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-4xl w-full animate-fadeIn">
        <h2 className="text-center text-5xl md:text-6xl font-extrabold mb-8 text-purple-700">
          Mental Health Self-Assessment
        </h2>

        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {current + 1}. {questions[current]}
          </h3>

          <div className="grid gap-4 md:gap-6">
            {options.map((opt, index) => (
              <label
                key={index}
                className={`block px-5 py-4 rounded-xl cursor-pointer transition-all duration-300
                  ${answers[current] === index
                    ? "bg-purple-200 border-2 border-purple-500"
                    : "bg-gray-100 hover:bg-purple-100"}`
                }
              >
                <input
                  type="radio"
                  checked={answers[current] === index}
                  onChange={() => {
                    const newAns = [...answers];
                    newAns[current] = index;
                    setAnswers(newAns);
                  }}
                  className="mr-3 accent-purple-600 scale-125"
                />
                <span className="text-gray-700 text-lg md:text-xl">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={prev}
            disabled={current === 0}
            className={`px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300
              ${current === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700 shadow-md"}`
            }
          >
            ← Prev
          </button>

          <button
            onClick={next}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md font-semibold transition-all duration-300"
          >
            {current === questions.length - 1 ? "Submit" : "Next →"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
