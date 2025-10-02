import { useState, useEffect, useRef } from "react";
import { LuSmartphone } from "react-icons/lu";

export default function Play() {
    const [isMobile, setIsMobile] = useState(false);
    const [isPortrait, setIsPortrait] = useState(false);
    const iframeRef = useRef(null);

    useEffect(() => {
        const checkDevice = () => {
            const mobile =
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                );
            setIsMobile(mobile);
        };

        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        checkDevice();
        checkOrientation();

        window.addEventListener("resize", checkOrientation);
        window.addEventListener("orientationchange", checkOrientation);

        return () => {
            window.removeEventListener("resize", checkOrientation);
            window.removeEventListener("orientationchange", checkOrientation);
        };
    }, []);

    // This will try fullscreen after first click/touch anywhere
    useEffect(() => {
        const enableFullscreen = () => {
            const iframe = iframeRef.current;
            if (iframe?.requestFullscreen) iframe.requestFullscreen();
            else if (iframe?.webkitRequestFullscreen) iframe.webkitRequestFullscreen();

            document.removeEventListener("click", enableFullscreen);
            document.removeEventListener("touchstart", enableFullscreen);
        };

        document.addEventListener("click", enableFullscreen);
        document.addEventListener("touchstart", enableFullscreen);

        return () => {
            document.removeEventListener("click", enableFullscreen);
            document.removeEventListener("touchstart", enableFullscreen);
        };
    }, []);

    if (isMobile && isPortrait) {
        return (
            <div className="flex items-center justify-center h-screen bg-black p-6">
                <div className="text-center text-white">
                    <div className="mb-6 flex justify-center">
                        <LuSmartphone className="w-20 h-20 stroke-white animate-tilt" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                        I rotate ang iyong device
                    </h1>
                    <p className="text-lg mb-2">
                        Pinakamainam laruin ang larong ito sa pahalang
                        (landscape) na mode
                    </p>
                    <p className="text-sm opacity-80">
                        I-ikot ang iyong telepono nang pahalang para magpatuloy
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: "100vh", background: "black" }}>
            {/* Button stays as fallback */}
            <button
                onClick={() => {
                    const iframe = iframeRef.current;
                    if (iframe?.requestFullscreen) iframe.requestFullscreen();
                }}
                className="absolute top-2 right-2 z-10 bg-white text-black px-3 py-1 rounded"
            >
                Fullscreen
            </button>
            <iframe
                ref={iframeRef}
                src="/godot/index.html"
                allow="fullscreen"
                allowFullScreen
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Godot Game"
            />
        </div>
    );
}
