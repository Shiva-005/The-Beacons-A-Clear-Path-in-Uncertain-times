import React, { useState } from "react";
import Header from "@/components/Header";
import { motion, Variants } from "framer-motion";
import { auth, db, googleProvider } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type Img = { src: string; ratio: string };

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

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        age,
        year,
        branch,
        role,
        createdAt: new Date(),
      });

      alert("Signup successful!");
      setEmail(""); setPassword(""); setName(""); setAge(""); setYear(""); setBranch("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        role: "student",
      });

      alert("Google Signup successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

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
    <section className="relative min-h-[900px] bg-white">
      
      <div className="absolute inset-0 overflow-hidden -z-0">
        <ImageRow imgs={row1} rowIdx={0} />
        <ImageRow imgs={row2} rowIdx={10} />
        <ImageRow imgs={row3} rowIdx={20} />
      </div>
      <div className="absolute inset-0 bg-black/55 z-10"></div>

      <Header />

      <motion.div
        className="relative z-20 container mx-auto px-4 py-12 lg:py-20"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeSlide}
      >
        <div className="flex justify-center">
          <motion.div
            variants={fadeSlide}
            className="w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-[50px] p-8 md:p-12 m-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-6 text-beacon-blue font-lato">
              Create Your Account
            </h1>

            <form onSubmit={handleSignup} className="space-y-6">
              
              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required />
              </div>
              
              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Age</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required />
              </div>

              {/* ✅ Role Dropdown */}
              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required>
                  <option value="student">Student</option>
                  <option value="counselor">Counselor</option>
                </select>
              </div>

              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Year of Study</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required>
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Branch</label>
                <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required />
              </div>

              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required />
              </div>

              <div>
                <label className="text-xl md:text-2xl font-lato text-gray-900">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-2 h-12 px-4 rounded-lg border-2 border-gray-300 bg-gray-200/20" required />
              </div>

              <button type="submit" className="w-full bg-beacon-red border-2 border-red-600 text-white text-xl md:text-2xl py-4 rounded-lg font-lato hover:bg-red-700">
                Create Account
              </button>

              <button type="button" onClick={handleGoogleSignup} className="w-full border-2 border-blue-600 text-blue-700 text-xl py-4 rounded-lg font-lato hover:bg-blue-100">
                Sign up with Google
              </button>

              <div className="text-center space-y-2 mt-4">
                <a href="/" className="text-blue-600 text-2xl block">Back to Login</a>
              </div>
            </form>

          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Signup;
