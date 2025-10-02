import React from "react";
import {
    FaChalkboardTeacher,
    FaUserGraduate,
    FaArrowLeft,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "@inertiajs/react";
import FloatingBgIIcons from "@/Components/FloatingBgIcons";

export default function PlayGame() {
    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { delay: i * 0.3, duration: 0.7, ease: "easeOut" },
        }),
        hover: { scale: 1.05, rotate: [0, -2, 2, 0], transition: { duration: 0.4 } },
    };

    return (
        <div className="min-h-screen bg-sky-100 flex flex-col items-center justify-center md:p-4 font-sans relative overflow-hidden">
            <FloatingBgIIcons />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full max-w-5xl mx-auto bg-white/70 backdrop-blur-sm md:rounded-3xl shadow-2xl p-8 text-center relative z-10 border-4 border-white"
            >
                <Link
                    href={route("welcome")}
                    className="absolute top-6 left-6 flex items-center justify-center w-12 h-12 bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                >
                    <FaArrowLeft className="w-5 h-5" />
                </Link>

                <header className="mb-8 mt-4">
                    <motion.h1
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-600 drop-shadow-sm pb-4"
                        style={{ fontFamily: "'Fredoka One', cursive" }}
                    >
                        Maglaro Tayo!
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="mt-2 text-lg text-slate-600 font-medium"
                    >
                        Matutunan natin ang mga salitang Filipino!
                    </motion.p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={cardVariants}
                        className="bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-2xl p-6 shadow-xl border-4 border-emerald-300"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <FaChalkboardTeacher className="w-16 h-16 text-white drop-shadow-lg" />
                        </div>
                        <h2
                            className="text-2xl font-bold text-white mb-3"
                            style={{ fontFamily: "'Fredoka One', cursive" }}
                        >
                            Para sa Guro
                        </h2>
                        <p className="text-emerald-100 mb-4 text-sm">
                            Simulan ang isang bagong laro at kontrolin ang klase
                        </p>
                        <Link
                            href={route("login")}
                            as={"button"}
                            className="w-full bg-white text-emerald-600 font-bold text-xl py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-gray-300 active:border-b-0 active:translate-y-1"
                        >
                            Simulan ang Laro
                        </Link>
                    </motion.div>

                    <motion.div
                        custom={1}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        variants={cardVariants}
                        className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl p-6 shadow-xl border-4 border-blue-300"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <FaUserGraduate className="w-16 h-16 text-white drop-shadow-lg" />
                        </div>
                        <h2
                            className="text-2xl font-bold text-white mb-3"
                            style={{ fontFamily: "'Fredoka One', cursive" }}
                        >
                            Para sa Estudyante
                        </h2>
                        <p className="text-blue-100 mb-4 text-sm">
                            Sumali sa isang kasalukuyang laro gamit ang game code
                        </p>
                        <button className="w-full bg-white text-blue-600 font-bold text-xl py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 border-b-4 border-gray-300 active:border-b-0 active:translate-y-1">
                            Sumali sa Laro
                        </button>
                    </motion.div>
                </main>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-8 p-4 bg-yellow-100 rounded-xl border-2 border-yellow-300"
                >
                    <p className="text-yellow-800 text-sm font-medium">
                        💡 <strong>Tip:</strong> Ang mga guro ay dapat magsimula
                        ng laro una bago sumali ang mga estudyante!
                    </p>
                </motion.div>

                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-center text-slate-500 text-sm px-4 mt-8 md:hidden"
                >
                    <p>&copy; 2025 BingGaling. All Rights Reserved.</p>
                    <p>Ginawa para sa mga Grade 3 learners</p>
                </motion.footer>
            </motion.div>

            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-center text-slate-500 text-sm px-4 hidden md:block mt-6"
            >
                <p>&copy; 2025 BingGaling. All Rights Reserved.</p>
                <p>Ginawa para sa mga Grade 3 learners</p>
            </motion.footer>

            <style jsx global>{`
                @import url("https://fonts.googleapis.com/css2?family=Fredoka+One&family=Inter:wght@400;500;700;800&display=swap");
            `}</style>
        </div>
    );
}