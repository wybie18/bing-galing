import { router } from "@inertiajs/react";
import React from "react";

const GlobalStyles = () => (
    <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap");
        body {
            font-family: "Press Start 2P", cursive;
        }
    `}</style>
);

const TeacherIcon = () => (
    <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bg-[#E0E0E0] p-1 border-4 border-[#FBBF24] w-full h-full"
    >
        {/* Skin */}
        <rect x="40" y="60" width="80" height="70" fill="#FDE4C3" />
        <rect x="50" y="130" width="60" height="10" fill="#FDE4C3" />

        {/* Hair */}
        <rect x="30" y="30" width="100" height="10" fill="#5D4037" />
        <rect x="20" y="40" width="120" height="20" fill="#5D4037" />
        <rect x="20" y="60" width="20" height="50" fill="#5D4037" />
        <rect x="120" y="60" width="20" height="50" fill="#5D4037" />
        <rect x="30" y="110" width="10" height="10" fill="#5D4037" />
        <rect x="120" y="110" width="10" height="10" fill="#5D4037" />

        {/* Eyes */}
        <rect x="50" y="70" width="10" height="10" fill="#212121" />
        <rect x="100" y="70" width="10" height="10" fill="#212121" />

        {/* Glasses */}
        <rect
            x="40"
            y="65"
            width="30"
            height="20"
            stroke="#212121"
            strokeWidth="5"
        />
        <rect
            x="90"
            y="65"
            width="30"
            height="20"
            stroke="#212121"
            strokeWidth="5"
        />
        <rect x="70" y="72" width="20" height="5" fill="#212121" />

        {/* Mouth */}
        <rect x="70" y="105" width="20" height="5" fill="#C27A7A" />

        {/* Shirt */}
        <rect x="40" y="130" width="80" height="20" fill="#4A90E2" />
        <path d="M70 130 L80 140 L90 130 Z" fill="#FDE4C3" />
    </svg>
);

const StudentIcon = () => (
    <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bg-[#E0E0E0] p-1 border-4 border-[#FBBF24] w-full h-full"
    >
        {/* Skin */}
        <rect x="30" y="50" width="100" height="80" fill="#FFDAB9" />

        {/* Hair */}
        <rect x="30" y="30" width="100" height="20" fill="#A0522D" />
        <rect x="20" y="50" width="10" height="10" fill="#A0522D" />
        <rect x="130" y="50" width="10" height="10" fill="#A0522D" />
        <rect x="40" y="20" width="10" height="10" fill="#A0522D" />
        <rect x="70" y="20" width="20" height="10" fill="#A0522D" />
        <rect x="110" y="20" width="10" height="10" fill="#A0522D" />

        {/* Eyes */}
        <rect x="50" y="70" width="20" height="20" fill="white" />
        <rect x="90" y="70" width="20" height="20" fill="white" />
        <rect x="55" y="75" width="10" height="10" fill="black" />
        <rect x="95" y="75" width="10" height="10" fill="black" />

        {/* Mouth */}
        <rect x="60" y="105" width="40" height="10" fill="#9B2C2C" />
        <rect x="60" y="105" width="10" height="5" fill="white" />
        <rect x="90" y="105" width="10" height="5" fill="white" />

        {/* Shirt and Backpack */}
        <rect x="30" y="130" width="100" height="20" fill="#E53E3E" />
        <rect x="30" y="120" width="20" height="30" fill="#38A169" />
        <rect x="110" y="120" width="20" height="30" fill="#38A169" />
    </svg>
);

const PixelatedButton = ({ children, className, ...props }) => {
    return (
        <button
            className={`relative text-white uppercase text-center cursor-pointer transition-all duration-150 ease-out active:translate-y-1 active:shadow-none text-sm sm:text-base ${className}`}
            style={{
                textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
                boxShadow: "0 6px 0 0 rgba(0,0,0,0.3)",
            }}
            {...props}
        >
            <span className="block px-4 py-3 sm:px-8 sm:py-4">{children}</span>
        </button>
    );
};

export default function Welcome() {

    return (
        <>
            <GlobalStyles />
            <div
                className="w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-4"
                style={{
                    backgroundImage: `url(/classroom-bg.png)`,
                    imageRendering: "pixelated",
                }}
            >
                <div className="bg-black bg-opacity-30 p-4 sm:p-8 rounded-lg shadow-2xl text-center w-full max-w-5xl">
                    {/* Header Text */}
                    <h1
                        className="text-4xl sm:text-6xl lg:text-7xl text-white uppercase"
                        style={{ textShadow: "4px 4px 0px #000" }}
                    >
                        Welcome!
                    </h1>
                    <h2
                        className="text-lg sm:text-2xl lg:text-3xl text-yellow-300 mt-4 mb-8 sm:mb-10"
                        style={{ textShadow: "3px 3px 0px #000" }}
                    >
                        PUMILI NG IYONG PAPEL
                    </h2>

                    {/* Main content area for choices */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40">
                                <TeacherIcon />
                            </div>
                            <PixelatedButton onClick={() => router.visit(route("login"))} className="bg-blue-600 border-b-8 border-blue-800 hover:bg-blue-500 w-full">
                                Guro
                            </PixelatedButton>
                        </div>

                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40">
                                <StudentIcon />
                            </div>
                            <PixelatedButton onClick={() => router.visit(route("play"))} className="bg-green-600 border-b-8 border-green-800 hover:bg-green-500 w-full">
                                Estudyante
                            </PixelatedButton>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
