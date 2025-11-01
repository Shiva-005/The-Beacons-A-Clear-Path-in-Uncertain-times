import { useState } from "react";
import Header from "@/components/Header";
import { motion, Variants } from "framer-motion";
import Data from "../components/cardDetails/storage.json";
type Img = { src: string; ratio: string };
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("User:", result.user);
  } catch (error) {
    console.error("Google login error:", error);
  }
};
const fadeSlide: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const imageRowFade: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.6 },
  }),
};
type CardProps = {
  title: string;
  description: string;
  image: string;
  bgColor: string;
};
function Card({ title, description, image, bgColor }: CardProps) {
  return (
    <motion.div
      className=" rounded-3xl shadow-lg border border-gray-300 p-6 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center"
      whileHover={{ scale: 1.05 }}
      style={{ backgroundColor: bgColor }}
      variants={fadeSlide}
    >
      <img
        src={image}
        alt={title}
        className="w-40 h-40 object-cover rounded-2xl mb-4"
      />
      <h3 className="text-2xl font-bold font-lato text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-lg font-lato text-gray-600">{description}</p>
    </motion.div>
  );
}

function ImageRow({ imgs, rowIdx }: { imgs: Img[]; rowIdx?: number }) {
  return (
    <div className="flex gap-3 px-4 mt-5">
      {imgs.map((img, i) => (
        <motion.img
          key={i}
          src={img.src}
          alt=""
          custom={i + (rowIdx ?? 0)}
          variants={imageRowFade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="object-cover rounded-[50px] flex-shrink-0 h-48 md:h-72 lg:h-96"
          style={{ aspectRatio: img.ratio }}
        />
      ))}
    </div>
  );
}

export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCards, setShowCards] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  // image rows (compact sizes)
  const row1: Img[] = [
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/d1687c77cac552eab64c4fb076822eb6731b2890?width=450",
      ratio: "4/3",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/bfca34f3a322e60a0a5c87cca1e9b214806e9562?width=338",
      ratio: "16/9",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/a2c37a723acd151ae574e5ec76ffdcbfc329a1bf?width=412",
      ratio: "3/2",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/1cc908bb6104215c9ab3b8c07769d1120a491f45?width=438",
      ratio: "3/2",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/e6b1aef4ed6cfe8f54e6cbd1fd31c845d1c5a499?width=400",
      ratio: "3/2",
    },
  ];

  const row2: Img[] = [
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/8b73a26947eddaa97611edc55c3d09a78c3c35f2?width=354",
      ratio: "4/3",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/f234a7561db77825c7ef17996fcea49eadf52fa9?width=432",
      ratio: "3/2",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/a389986f25bf96997e7377bb8b1c90c9f9d771af?width=338",
      ratio: "16/9",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/4295fc244013da75f23987cd555dc62ff24bb742?width=400",
      ratio: "3/2",
    },
  ];

  const row3: Img[] = [
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/a4a4ae603794a848f6cdcfa9481452d95234fdea?width=400",
      ratio: "3/2",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/4717ac53571d3925daec07823c7b336e0c523ad0?width=432",
      ratio: "4/3",
    },
    {
      src: "https://api.builder.io/api/v1/image/assets/TEMP/b08fd0c396ed2556ed78c4017344871fa14926b8?width=400",
      ratio: "3/2",
    },
  ];

  return (
    <div className="w-full overflow-x-hidden">
      {/* HERO with background image rows */}
      <section className="relative min-h-[900px] bg-white">
        <div className="absolute inset-0 overflow-hidden -z-0">
          <ImageRow imgs={row1} rowIdx={0} />
          <ImageRow imgs={row2} rowIdx={10} />
          <ImageRow imgs={row3} rowIdx={20} />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/55 z-10"></div>

        {/* Header */}
        <Header />

        {/* Hero content */}
        <motion.div
          className="relative z-20 container mx-auto px-4 py-12 lg:py-20"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeSlide}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div variants={fadeSlide} className="text-white">
              <h1 className="font-lato font-bold leading-tight">
                <span className="text-5xl md:text-8xl block">Log In.</span>
                <span className="text-5xl md:text-8xl block mt-2">
                  And Join
                </span>
                <span className="text-6xl md:text-8xl text-beacon-yellow underline block mt-2">
                  Free
                </span>
              </h1>
              <p className="text-2xl md:text-3xl mt-6 font-lato">
                Caring for your mental health and helping you thrive with us.
              </p>
            </motion.div>

            <motion.div
              variants={fadeSlide}
              className="flex justify-center lg:justify-end"
            >
              <div className="w-full max-w-md bg-white/40 backdrop-blur-sm rounded-[50px] p-8 m-4 md:p-12">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="text-xl md:text-2xl font-lato text-gray-900">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20"
                    />
                  </div>

                  <div>
                    <label className="text-xl md:text-2xl font-lato text-gray-900">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20"
                    />
                  </div>

                  <a href="#" className="text-red-600 text-lg md:text-xl block">
                    Forget Password
                  </a>

                  <button
                    type="submit"
                    className="w-full bg-beacon-red border-2 border-red-600 text-white text-xl md:text-2xl py-4 rounded-lg font-lato hover:bg-red-700 transition-colors"
                  >
                    Log In
                  </button>

                  <div className="text-center space-y-2">
                    <button
                      onClick={handleGoogleLogin}
                      className="w-full bg-white text-black border-2 border-gray-400 py-3 rounded-lg font-lato hover:bg-gray-100 transition-colors"
                    >
                      WITH GMAIL📩
                    </button>
                    <a href="/signup" className="text-blue-600 text-2xl block">
                      Sign Up
                    </a>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Three Pillars */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="text-2xl md:text-3xl font-lato">
              Building Trust with <span className="font-semibold">Experts</span>
            </div>
            <div className="text-2xl md:text-3xl font-lato">
              Improve mental health{" "}
              <span className="text-blue-600 font-semibold">Together</span>
            </div>
            <div className="text-2xl md:text-3xl font-lato">
              Interaction With other{" "}
              <span className="text-beacon-yellow font-semibold">peoples</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inner Beacon Section (image left, text right) */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/01076e436641f5b8efc63ed0a24537c67d0f1c5c?width=754"
            alt="Meditation"
            className="w-56 md:w-96 rounded-2xl"
          />
          <h2 className="text-3xl md:text-6xl font-lato font-bold">
            Your inner{" "}
            <span className="text-beacon-blue font-bowlby">Beacon</span> leads
            to peace
          </h2>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f83b250d5f7765f8fb3d4cd3e6b995b19bf47465?width=588"
            alt="Meditation"
            className="mx-auto mt-8 w-56 md:w-64"
          />
        </div>
      </section>

      {/* Modern Solutions / Phone mockup area (as requested) */}
      <section className="py-16 bg-beacon-beige rounded-[50px] mx-4 my-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-lato font-bold text-center text-gray-700 mb-12">
            Relieve mental stress with modern solutions.
          </h2>

          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* left - video image */}
            <div className="relative flex justify-center">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/1a10fc8516bd01697a4e42f2736ea683394320cc?width=788"
                alt="Video"
                className="w-full max-w-md rounded-[40px] shadow-md object-cover"
              />
              <svg
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14"
                viewBox="0 0 70 75"
                fill="none"
              >
                <path
                  d="M14.583 9.375L55.4163 37.5L14.583 65.625V9.375Z"
                  stroke="#1E1E1E"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* middle phone mockup */}
            <div className="relative bg-gray-300 rounded-[50px] border-8 border-black p-8 text-center w-64 h-[420px] md:w-72 md:h-[520px] mx-auto flex flex-col justify-between shadow-xl">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full"></div>

              <div className="bg-white/50 rounded-[40px] p-4 mt-10 mx-4">
                <h3 className="text-2xl md:text-2xl font-bowlby text-beacon-blue mb-4">
                  Mentally Anxious
                </h3>
                <p className="text-xl md:text-2xl font-lato mb-8">
                  Use Beacon for Better experience
                </p>
              </div>
            </div>

            {/* right - avatar + speech bubble */}
            <div className="text-center lg:text-left">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/81c0273149afd0e9dd3de35548dfb1cc9afcbb06?width=560"
                alt="Avatar"
                className="w-full max-w-sm mx-auto rounded-full"
              />
              <div className="bg-beacon-pink/70 rounded-[40px] rounded-br-none p-6 mt-4 inline-block">
                <p className="text-2xl md:text-3xl font-lato font-bold text-gray-800 leading-snug">
                  Everything's in the right place — no worries!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mental Stress Tagline */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-6xl font-lato font-bold">
            <span className="text-beacon-blue">
              Mental stress can be eased with
            </span>
            <span className="font-bowlby text-beacon-blue"> Beacon.</span>
          </h2>
        </div>
      </section>

      {/* Online Counseling */}
      <section className="py-16 bg-beacon-pink rounded-[80px] mx-4 my-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-lato text-center lg:text-left mb-6">
                Online And Offline Counselling available with{" "}
                <span className="text-beacon-blue font-semibold">
                  Our Experts
                </span>{" "}
                therapists.
              </h2>
              <p className="text-2xl md:text-3xl font-lato font-bold text-center lg:text-left">
                Talk to them about your concerns — they'll guide you with the
                best solutions.
              </p>
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/4db278c142672d2d40f577b394ab3fd6d19e1e19?width=560"
                alt="Selfie"
                className="mx-auto mt-8 w-56 md:w-64"
              />
            </div>

            <div className="bg-gray-300 rounded-[50px] border-8 border-black p-6 max-w-md mx-auto">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/fa851b56b3726627f385834b1d837446cfba4e4a?width=790"
                alt="Therapist"
                className="w-full rounded-t-[40px]"
              />
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-balthazar">Mr John</h3>
                <p className="text-xl font-balthazar">5:35</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beacon Helps Section */}
      <section className="py-16 bg-beacon-beige text-center rounded-[80px] m-4">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-4xl md:text-6xl font-lato font-bold text-center mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeSlide}
          >
            Explore Our <span className="text-[#0653A1]">Mindful Cards</span>
          </motion.h2>

          {/* 🟦 Stylish Button */}
          <motion.button
            onClick={() => setShowCards(!showCards)}
            className="mb-10 bg-[#0653A1] text-white px-10 py-3 rounded-full text-lg font-semibold shadow-md hover:shadow-lg hover:bg-[#0b62c0] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showCards ? "Hide Cards" : "Show Cards"}
          </motion.button>

          {/* 💳 Cards Section */}
          {showCards && (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center "
              initial="hidden"
              animate="show"
              variants={fadeSlide}
            >
              {Data.map((card: any, i: number) => (
                <Card
                  key={card.id}
                  title={card.Name}
                  description={card.Details}
                  image={
                    card.img?.trim() !== ""
                      ? card.img
                      : "https://via.placeholder.com/300x200.png?text=Mindful+Card"
                  }
                  bgColor={
                    [
                      "#FCF6fE",
                      "#FCF6FE",
                      "#FCF6FE",
                      "#FCF6FE",
                      "#FCF6FE",
                      "#FCF6FE",
                    ][i % 6]
                  }
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* For People Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl mb-12">
            <span className="font-bowlby text-beacon-blue">Beacon</span>
            <span className="font-bowlby">
              {" "}
              — for the people, by the people who care.
            </span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              "Online Therapy",
              "AI ChatBot",
              "Detox Diary",
              "Stress HeatMap",
              "Avatar",
            ].map((feature) => (
              <button
                key={feature}
                className="bg-beacon-beige text-xl md:text-3xl font-baloo px-8 py-4 rounded-[50px] hover:bg-gray-200 transition-colors"
              >
                {feature}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Connect with Experts */}
      <section className="py-16 bg-beacon-teal rounded-[60px] mx-4 my-16 px-4">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h3 className="text-3xl md:text-4xl font-lato font-semibold mb-6">
                Connect and talk with experts.
              </h3>
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/83130707be45809816bbc1c02bc9789f130ee317?width=932"
                alt="Video call"
                className="w-full rounded-[100px]"
              />
            </div>
            <div className="text-white">
              <h3 className="text-4xl md:text-5xl font-lato font-bold mb-6">
                Here for you, always!
              </h3>
              <p className="text-2xl md:text-3xl font-lato font-semibold mb-8">
                Find the experts who can provide the answers you need.
              </p>
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/dda4639af4c615fed14e8c8dba859b23921926b4?width=742"
                alt="Reading"
                className="w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-beacon-beige rounded-[50px] mx-4 my-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-lato font-bold text-center mb-6">
            Types and Categories of Mental Stress.
          </h2>
          <p className="text-2xl md:text-3xl font-lato text-center mb-12">
            Based on your responses to a few simple questions.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-black bg-white rounded-3xl p-6 text-center">
              <h3 className="text-3xl md:text-4xl font-lato font-bold text-beacon-blue">
                Mild Mental Stress
              </h3>
            </div>
            <div className="border-2 border-black bg-white rounded-3xl p-6 text-center">
              <h3 className="text-3xl md:text-4xl font-lato font-bold text-beacon-blue">
                Moderate Mental Stress
              </h3>
            </div>
            <div className="border-2 border-black bg-white rounded-3xl p-6 text-center">
              <h3 className="text-3xl md:text-4xl font-lato font-bold text-beacon-blue">
                Severe Mental Stress
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* The Beacon CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl mb-8">
            <span className="font-bowlby text-beacon-blue">The Beacon</span>
            <span className="font-lato font-bold text-beacon-blue"> — </span>
            <span className="font-lato font-bold text-gray-700">
              Designed for people, delivered with care.
            </span>
          </h2>
          <p className="text-2xl md:text-3xl font-lato max-w-4xl mx-auto mb-12 leading-relaxed">
            From expert-guided therapy to AI-powered sessions, from soothing
            meditations to personalized song recommendations — connect
            peer-to-peer with experts and much more.
          </p>
          <button className="bg-black text-white text-3xl md:text-4xl font-bowlby px-12 py-6 rounded-3xl border-4 border-black hover:bg-gray-800 transition-colors">
            Beacon
          </button>
          <p className="mt-6 text-xl underline">Click For learn More</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-lato font-bold text-center mb-12">
            People are embracing life with peace, joy, and a radiant smile.
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-beacon-pink rounded-3xl p-8">
              <p className="text-2xl md:text-3xl font-lato font-bold text-center mb-4">
                "Beacon is a light for the mind — guiding people from darkness
                to direction."
              </p>
              <p className="text-2xl md:text-3xl font-lato text-center">
                Your platform stands as a beacon (just like the name) of hope
                and healing, helping people navigate through emotional storms
                toward self-awareness and peace.
              </p>
            </div>

            <div className="bg-yellow-200 rounded-3xl p-8">
              <p className="text-2xl md:text-3xl font-lato font-bold text-beacon-blue text-center mb-4">
                "Every visit to Beacon is a step toward self-care and inner
                strength."
              </p>
              <p className="text-2xl md:text-3xl font-lato text-center">
                It reminds users that mental health matters every day, and even
                small actions — reading, reflecting, or reaching out — can bring
                big positive change.
              </p>
            </div>

            <div className="bg-gray-700 rounded-3xl p-8">
              <p className="text-2xl md:text-3xl font-lato font-bold text-white text-center mb-4">
                "Beacon believes that no mind should ever feel alone — because
                healing begins with connection."
              </p>
              <p className="text-2xl md:text-3xl font-lato text-white text-center">
                Your website creates a safe digital space where empathy,
                understanding, and professional guidance come together to help
                people rediscover balance and belonging.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16 bg-beacon-beige rounded-[50px] mx-4 my-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex gap-4">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/170837a357b9ace5093327e7655fbd4d8815b6af?width=608"
                alt="Community"
                className="w-1/2 rounded-[50px]"
              />
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/73c6bf9104c0b4fdff597f9f439e0c8cbfeb88d7?width=432"
                alt="Community"
                className="w-1/3 rounded-[50px]"
              />
            </div>
            <div className="text-center lg:text-left">
              <h3 className="text-4xl md:text-5xl font-bowlby mb-8">
                People keep coming back to boost their mental wellness —
                together, we heal and grow.
              </h3>
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/3e73f7a88e3f13ed3453e77f810ecc983de3c61e?width=590"
                alt="Dancing"
                className="w-64 mx-auto lg:mx-0"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Banner */}
      <section className="py-8 bg-white/70 border-8 border-white mx-4 my-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-5xl font-lato font-semibold text-center">
            <span className="font-bowlby text-beacon-blue">Beacon </span>
            comes with powerful new features for better mental wellness.
          </h3>
        </div>
      </section>

      {/* Explore Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-lato font-bold text-center mb-8">
            Explore Our{" "}
            <span className="font-bowlby text-beacon-blue">Beacon</span>
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {["Article", "Music", "Diary", "SafeSpace", "Meditation Video"].map(
              (tab) => (
                <button
                  key={tab}
                  className="bg-green-600 text-white text-2xl md:text-3xl font-lato font-bold px-8 py-4 rounded-3xl border-2 border-black hover:bg-green-700 transition-colors"
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "\"It's okay to not be okay — what matters is taking the next small step toward healing.\" Reminds people that healing isn't instant — it's progress, not perfection.",
              '"Your mind deserves the same care, rest, and love you give to others." Encourages self-compassion and prioritizing one\'s own mental well-being.',
              '"Talking about your feelings is a sign of strength, not weakness." Breaks stigma and normalizes open conversations about mental health.',
              '"Every day is a new chance to breathe, reset, and begin again." Inspires hope and resilience — reminding people that recovery is always possible.',
            ].map((quote, i) => (
              <div key={i} className="bg-beacon-light-blue rounded-[30px] p-8">
                <p className="text-2xl md:text-3xl font-lato font-semibold text-center">
                  {quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Message */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-lato font-bold max-w-4xl mx-auto">
            A message for those facing the same pain you endure today: You are
            not alone.
          </h2>
        </div>
      </section>

      {/* Journey CTA */}
      <section className="py-16 bg-orange-100 rounded-[50px] mx-4 my-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl md:text-5xl font-bookman mb-8">
            Join us and connect with others who share your journey.
          </h3>
          <h2 className="text-4xl md:text-6xl font-lato font-bold text-beacon-blue mb-8">
            Your journey to happiness begins with{" "}
            <span className="font-bold">The Beacon.</span>
          </h2>
          <button className="bg-black text-white text-2xl md:text-3xl font-lato px-12 py-5 rounded-3xl border-2 border-black hover:bg-gray-800 transition-colors">
            Start Now
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-lato font-semibold text-center mb-12">
            Frequently Asked Question About{" "}
            <span className="font-bowlby text-beacon-blue">Beacon</span> ?
          </h2>

          <div className="bg-white rounded-[50px] p-8 md:p-12 max-w-5xl mx-auto">
            <div className="space-y-6 text-3xl md:text-4xl font-lato font-bold italic text-red-900">
              <p>What Is Beacon For ?</p>
              <p>What is the Objective Of Beacon?</p>
              <p>What Major step Beacon is Taking ?</p>
              <p>What Is the cost for Beacon features?</p>
              <p>Does Beacon will Really Helps me to improve stress?</p>
              <p>Does Beacon is Really That effect ?</p>
              <p>Can I get Beacon Features for free?</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 text-center mt-8">
          <button className="bg-black text-white text-4xl md:text-5xl font-bowlby px-16 py-6 rounded-[30px] border-4 border-blue-600 hover:bg-gray-800 transition-colors">
            Join Us
          </button>
        </div>
      </section>

      {/* Final CTA as full-width image (keeps your image file) */}
      <section className="py-0">
        <img
          src="./img.png"
          alt="Final banner"
          className="w-screen h-auto object-cover mx-auto block"
        />
      </section>

      {/* Footer */}
      <footer className="bg-gray-500 py-12">
        <div className="container mx-auto px-4 text-center text-white">
          <p className="text-xl">© 2024 Beacon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
