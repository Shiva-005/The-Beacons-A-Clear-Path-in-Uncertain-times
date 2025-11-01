"use client";
import { useEffect, useState } from "react";
import { MessageSquare, Menu } from "lucide-react";

declare global {
  interface Window {
    botpress: any;
    botpressWebChat: any;
  }
}

export default function Header() {
  const [isBot, setIsBot] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [botInitialized, setBotInitialized] = useState(false);

  // Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsBot(scrolled);
      setCompact(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const botImage =
    "https://th.bing.com/th/id/OIP.4FuBjYmRvtEXBS-bHi63RQAAAA?w=204&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";
    const meImage="https://static.vecteezy.com/system/resources/previews/019/858/376/non_2x/chat-flat-color-outline-icon-free-png.png";

  // Initialize Botpress
  const openChat = () => {
    setChatOpen(true);

    if (!botInitialized && window.botpress && window.botpress.init) {
      setBotInitialized(true);

      let userInteracted = false;
      const unlockAudio = () => {
        if (!userInteracted) {
          userInteracted = true;
          const utterance = new SpeechSynthesisUtterance("");
          speechSynthesis.speak(utterance);
        }
      };

      window.addEventListener("click", unlockAudio);
      window.addEventListener("keydown", unlockAudio);

      window.botpress.init({
        botId: "b7a022e3-94f6-4317-b840-cb0ccea6fe66",
        clientId: "0bc71b51-1a41-4fa1-a147-4339105f567a",
        selector: "#bp-embedded-webchat",
        configuration: {
          version: "v2",
          embedded: true,
          hideWidget: true,
          themeMode: "light",
          botName: "Your Brand Assistant",
          color: "#3276EA",
          variant: "solid",
          headerVariant: "glass",
          radius: 3,
          fontFamily: "Abhaya Libre",
          feedbackEnabled: false,
          soundEnabled: false,
        },
      });

      window.botpress.on("webchat:ready", () => {
        setTimeout(() => window.botpress.open(), 500);

        window.botpress.on("incoming_message", (event: any) => {
          const text =
            event.payload?.text || event.payload?.title || event.preview;
          if (userInteracted && (window as any).responsiveVoice && text) {
            (window as any).responsiveVoice.cancel();
            (window as any).responsiveVoice.speak(text, "UK English Male");
          }
        });
      });
    } else if (botInitialized) {
      window.botpress.open();
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="fixed w-full top-0 z-40 transition-all duration-300 border-b bg-white/90">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* LOGO */}
          <h1 className="text-4xl font-bold whitespace-nowrap">
            <span className="text-beacon-blue font-bowlby">The</span>
            <span className="text-beacon-blue font-bowlby"> Beacon</span>
          </h1>

          <div className="flex items-center gap-4">
            {/* Sign Up only visible when not compact */}
            {!compact && (
              <button className="bg-red-600 text-xl text-white px-6 py-3 rounded-lg font-lato hover:bg-red-700 transition">
                <a href="/signup">Sign Up</a>
              </button>
            )}

            {/* BOT / MESSAGE ICON */}
            <img
              src={isBot ? botImage : meImage}
              onClick={openChat}
              className="w-[60px] h-[60px] bg-transparent rounded-2xl "
/>

            {/* DASHBOARD MENU ICON */}
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 hover:opacity-70 transition"
            >
              <Menu size={34} />
            </button>
          </div>
        </nav>
      </header>

      {/* DASHBOARD SLIDE PANEL */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          {/* Side Panel */}
          <div className="w-72 bg-white h-full shadow-xl p-6 animate-slideIn flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-beacon-blue">Menu</h2>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">Check It</a>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">About Us</a>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">Article</a>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">Help</a>
            <button className="mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
              <a href="/signup">Sign Up</a>
            </button>
          </div>

          {/* Click outside to close */}
          <div className="flex-1" onClick={() => setMenuOpen(false)}></div>
        </div>
      )}

      {/* CHAT WINDOW */}
      {chatOpen && (
        <div
          id="bp-embedded-webchat"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            zIndex: 1000,
          }}
        />
      )}

      {/* Tailwind animation */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
