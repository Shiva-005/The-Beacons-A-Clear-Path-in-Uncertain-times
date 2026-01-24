<<<<<<< HEAD
"use client";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { auth, db } from "@/firebase/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

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

  const [user, setUser] = useState<any>(null);
  const [anonName, setAnonName] = useState<string>("User");
  const navigate = useNavigate();

  const defaultAvatar =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // SCROLL EFFECT
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 80;
      setIsBot(scrolled);
      setCompact(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // AUTH STATE LISTENER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setAnonName(userSnap.data().anonymousUsername || "User");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // FIX: LOGOUT + REDIRECT TO LOGIN PAGE
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // 👈 Redirects back to login page
  };

  const botImage =
    "https://th.bing.com/th/id/OIP.4FuBjYmRvtEXBS-bHi63RQAAAA?w=204&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3";

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
      });
    } else if (botInitialized) {
      window.botpress.open();
    }
  };
=======
import { link } from "fs";


export default function Header() {
>>>>>>> 39feef7 (temp commit)

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed w-full top-0 z-30 transition-all duration-300 border-b ${
          compact ? "bg-white/90 shadow-sm py-4" : "bg-white/90 py-4"
        }`}
      >
        <nav className="container mx-auto px-4 flex items-center justify-between transition-all duration-300">
          {/* LOGO */}
          <h1
            className={`font-bowlby font-bold transition-all duration-300 ${
              compact ? "text-3xl" : "text-4xl"
            }`}
          >
            <span className="text-beacon-blue">The</span>
            <span className="text-beacon-blue"> Beacon</span>
          </h1>

          {/* NAV LINKS */}
          {!compact && (
            <div className="hidden sm:flex flex-row font-lato gap-6">
              <a className="text-4xl font-semibold hover:text-beacon-yellow" href="#">
                Check It
              </a>
              <a className="text-4xl font-semibold hover:text-beacon-yellow" href="#">
                About Us
              </a>
              <a className="text-4xl font-semibold hover:text-beacon-yellow" href="#">
                Article
              </a>
              <a className="text-4xl font-semibold hover:text-beacon-yellow" href="#">
                Help
              </a>
            </div>
          )}

          <div className="flex items-center gap-4">
            {/* USER AREA WHEN LOGGED IN */}
            {user && (
              <div className="flex items-center gap-3 mr-2">
                <img
                  src={user.photoURL || defaultAvatar}
                  className="w-10 h-10 rounded-full border"
                  alt="User Avatar"
                />

                <span className="font-semibold text-lg text-gray-800">
                  {anonName}
                </span>

                {/* LOGOUT BUTTON */}
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-lato"
                >
                  Logout
                </button>
              </div>
            )}

            {/* SIGN UP WHEN NOT LOGGED IN */}
            {!compact && !user && (
              <button className="bg-red-600 text-xl text-white px-6 py-3 rounded-lg font-lato hover:bg-red-700 transition">
                <a href="/signup">Sign Up</a>
              </button>
            )}

            {/* Chatbot Icon */}
            <img
              src={botImage}
              onClick={openChat}
              className={`w-[70px] h-[70px] rounded-2xl cursor-pointer ${
                compact ? "scale-90" : "scale-100"
              } transition-transform duration-300`}
            />

            {/* Mobile Menu */}
            {compact && (
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 hover:opacity-70 transition"
              >
                <Menu size={34} />
              </button>
            )}
          </div>
<<<<<<< HEAD
        </nav>
      </header>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex">
          <div className="w-72 bg-white h-full shadow-xl p-6 animate-slideIn flex flex-col gap-6">

            {user && (
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={user.photoURL || defaultAvatar}
                  className="w-10 h-10 rounded-full border"
                  alt=""
                />
                <span className="font-bold text-lg text-gray-700">
                  {anonName}
                </span>
              </div>
            )}

            <h2 className="text-2xl font-bold text-beacon-blue">Menu</h2>

            <a className="text-xl font-semibold hover:text-beacon-yellow" href="/">
              Check It
            </a>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">
              About Us
            </a>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">
              Article
            </a>
            <a className="text-xl font-semibold hover:text-beacon-yellow" href="#">
              Help
            </a>

            {/* SIGN UP IF NOT LOGGED IN */}
            {!user && (
              <button className="mt-4 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
                <a href="/signup">Sign Up</a>
              </button>
            )}

            {/* LOGOUT IN MOBILE MENU */}
            {user && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="mt-4 bg-red-800 text-gray-800 py-2 rounded-lg hover:bg-red-900 transition"
              >
                Logout
              </button>
            )}
=======
          
          <div className="hidden md:flex items-center gap-10">
            <a href="#" className="text-4xl font-lato font-semibold  text-black hover:text-beacon-yellow transition-colors">Check It</a>
            <a href="#" className="text-4xl font-lato font-semibold  text-black hover:text-beacon-yellow transition-colors">About Us</a>
            <a href="#" className="text-4xl font-lato font-semibold text-black hover:text-beacon-yellow transition-colors">Article</a>
            <a href="#" className="text-4xl font-lato font-semibold  text-black hover:text-beacon-yellow transition-colors">Help</a>
            
          </div>
          <div>
            <button className="bg-red-600 text-2xl  text-white px-7 py-4 rounded-lg font-lato hover:bg-red-700 transition-colors" onClick={()=>window.location.href = "/signup"}>
              Sign Up
            </button>
>>>>>>> 39feef7 (temp commit)
          </div>

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

      {/* Animation */}
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
