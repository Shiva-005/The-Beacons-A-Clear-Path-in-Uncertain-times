import { useState } from "react";

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble sleeping or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop worrying",
  "Trouble relaxing",
  "Feeling irritable or easily annoyed",
  "Feeling afraid as if something awful might happen",
  "Have you been able to concentrate well?",
  "Have you been feeling confident in yourself?",
  "Have you felt capable of making decisions?",
  "Have you enjoyed your daily activities?",
  "Have you felt unhappy or depressed?"
];

const options = [
  "Not at all",
  "Several days",
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

  const calculate = () => {
    const total = answers.reduce((a, b) => a + b, 0);
    let feedback = "";

    if (total <= 10)
      feedback = `Mild (Score: ${total}) 🟢 — Try Yoga, Music & Journaling`;
    else if (total <= 25)
      feedback = `Moderate (Score: ${total}) 🟡 — Peer Support & Positive Talk`;
    else
      feedback = `Severe (Score: ${total}) 🔴 — Consider Professional Counselling`;

    setResult(feedback);
  };

  if (result)
    return (
      <div className="min-h-screen flex items-center justify-center  p-4 bg-[conic-gradient(var(--tw-gradient-stops))]

from-[#4f49ca]
via-[#818cf8]
to-[#c7d2fe]" >
        <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-xl w-full text-center">
          <h2 className="text-2xl font-bold mb-4">{result}</h2>
          <button
            onClick={() => (window.location.href = "/services")}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 text-lg"
          >
            🌐 Explore Services
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-[#ffe4e6]  to-[#ccfbf1] p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-10 max-w-8xl w-full min-h-screen">
        <h2 className="text-center text-2xl font-bold mb-6">
          Mental Health Self-Assessment
        </h2>

        <h3 className="text-lg font-semibold mb-4">
          {current + 1}. {questions[current]}
        </h3>

        <div className="space-y-3">
          {options.map((opt, index) => (
            <label
              key={index}
              className="block bg-gray-100 hover:bg-blue-100 cursor-pointer px-4 py-3 rounded-lg"
            >
              <input
                type="radio"
                checked={answers[current] === index}
                onChange={() => {
                  const newAns = [...answers];
                  newAns[current] = index;
                  setAnswers(newAns);
                }}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prev}
            disabled={current === 0}
            className={`px-4 py-2 rounded-lg text-white ${
              current === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            ← Prev
          </button>

          <button
            onClick={next}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {current === questions.length - 1 ? "Submit" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
