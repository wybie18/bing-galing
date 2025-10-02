import { motion, AnimatePresence } from "framer-motion";
import { router } from "@inertiajs/react";
import { useState } from "react";

export default function AnimatedLink({ 
    href, 
    routeName, 
    routeParams = {}, 
    children, 
    className = "", 
    bgColor = "bg-green-500", 
    ...props 
}) {
    const [animating, setAnimating] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        
        if (href && (href.startsWith('http') || href.startsWith('#'))) {
            if (href.startsWith('#')) return;
            window.open(href, '_blank');
            return;
        }

        setAnimating(true);
    };

    const handleNavigation = () => {
        if (routeName) {
            router.visit(route(routeName, routeParams));
        } else if (href && !href.startsWith('http') && !href.startsWith('#')) {
            router.visit(href);
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ scale: 1.1, rotate: Math.random() > 0.5 ? 1 : -1 }}
                whileTap={{ scale: 0.95 }}
                {...props}
            >
                <button
                    onClick={handleClick}
                    className={`w-full text-white font-bold text-2xl py-4 px-6 rounded-xl shadow-lg border-b-4 inline-flex items-center gap-2 justify-center ${className}`}
                >
                    {children}
                </button>
            </motion.div>

            <AnimatePresence>
                {animating && (
                    <motion.div
                        key="transition-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 grid place-items-center"
                    >
                        <motion.div
                            key="transition-circle"
                            initial={{ scale: 0, borderRadius: "50%" }}
                            animate={{ scale: 50, borderRadius: "0%" }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className={`w-40 h-40 ${bgColor}`}
                            onAnimationStart={handleNavigation}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}