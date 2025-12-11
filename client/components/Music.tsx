import React, { useEffect } from "react";
import Typed from "typed.js";
import Header from "./Header";

const MusicAssistant: React.FC = () => {
  useEffect(() => {
    const typed = new Typed(".typing", {
      strings: [
        "Feeling anxious?",
        "Need focus?",
        "Stressed out?",
        "Let's find your perfect music 🎵"
      ],
      typeSpeed: 50,
      backSpeed: 25,
      loop: true
    });

    return () => typed.destroy();
  }, []);

  const detectMood = async () => {
    const input = document.getElementById("moodText") as HTMLInputElement;
    const text = input.value.trim();

    if (!text) return alert("Please describe how you're feeling!");

    const res = await fetch("http://localhost:5001/detect_mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await res.json();

    document.getElementById("result")!.innerHTML =
      `🌈 Your mood: <b>${data.mood.toUpperCase()}</b>`;

    document.getElementById("musicPlayer")!.innerHTML = `
      <iframe 
        src="${data.playlist}" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen"
        class="w-[calc(100%+80px)] h-[400px] border-none rounded-b-[25px] shadow-[0_0_15px_rgba(0,0,0,0.2)] mt-5 ml-[-40px] mr-[-40px]"
      ></iframe>
    `;
  };

  return (
    <div className="min-h-screen bg-beacon-beige flex justify-center items-center relative pt-20 pb-10">

      {/* Keep your header exactly where it is */}
      <div className="absolute top-0 left-0 w-full">
        <Header />
      </div>

      {/* Main Card */}
      <div
        className="
          w-[90%] max-w-[720px] p-10 rounded-[25px] bg-white text-center 
          border border-white shadow-[0_0_25px_rgba(255,255,255,0.4)]
          backdrop-blur-md
          transition-all duration-300
        "
      >
        {/* Title */}
        <h2 className="font-semibold text-gray-800 text-[26px] mb-2 tracking-wide">
          🎧 AI Music Assistant
        </h2>

        {/* Typing Animation */}
        <div className="typing text-[#ff4081] font-medium h-[25px] mb-4 text-[18px]"></div>

        {/* Input */}
        <input
          id="moodText"
          type="text"
          placeholder="Type how you feel... 🧠💬"
          className="
            mt-4 w-[85%] p-3 rounded-[12px]
            bg-white/90 text-[15px] shadow-inner border border-gray-200
            outline-none transition-all duration-200
            focus:scale-[1.03]
            focus:shadow-[0_0_12px_#ff80ab]
          "
        />

        {/* Button */}
        <button
          onClick={detectMood}
          className="
            mt-6 px-6 py-3 rounded-[12px]
            bg-[linear-gradient(90deg,#ff80ab,#ff4081)] text-white font-medium 
            transition-all duration-200
            hover:scale-[1.07]
            hover:shadow-[0_4px_15px_rgba(255,64,129,0.4)]
          "
        >
          Find My Music 🎶
        </button>

        {/* Mood Result */}
        <div id="result" className="mt-6 text-[18px] font-medium text-[#444]"></div>

        {/* Music Player */}
        <div id="musicPlayer" className="mt-4"></div>
      </div>
    </div>
  );
};

export default MusicAssistant;
