import { TiPencil, TiWeatherSunny } from "react-icons/ti";
import { FaHeart, FaStar, FaCircle } from "react-icons/fa";
import { BsTriangleFill, BsSquareFill } from "react-icons/bs";
import { IoMdHappy } from "react-icons/io";
import { RiFlowerFill } from "react-icons/ri";
import { GiButterfly, GiClover } from "react-icons/gi";
import { MdGrid4X4 } from "react-icons/md";
import { motion } from "framer-motion";

export default function FloatingBgIIcons() {
    const floatAnim = {
        y: [0, -10, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
        },
    };

    const spinAnim = {
        rotate: [0, 360],
        transition: {
            duration: 10,
            repeat: Infinity,
            ease: "linear",
        },
    };

    return (
        <>
            {/* Floating Background Icons */}
            <motion.div
                className="absolute -top-6 -left-6 text-yellow-400 opacity-20 w-24 h-24"
                animate={spinAnim}
            >
                <TiWeatherSunny className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-16 right-24 text-violet-600 opacity-20 w-24 h-24"
                animate={floatAnim}
            >
                <TiPencil className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-32 right-44 text-orange-400 opacity-20 w-20 h-20"
                animate={spinAnim}
            >
                <MdGrid4X4 className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-10 left-20 text-pink-400 opacity-25 w-16 h-16"
                animate={floatAnim}
            >
                <FaHeart className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-32 left-10 text-yellow-500 opacity-25 w-12 h-12"
                animate={spinAnim}
            >
                <FaStar className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute bottom-20 left-16 text-blue-400 opacity-20 w-20 h-20"
                animate={floatAnim}
            >
                <FaCircle className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-40 right-20 text-purple-400 opacity-25 w-14 h-14"
                animate={spinAnim}
            >
                <BsTriangleFill className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute bottom-32 right-12 text-green-400 opacity-20 w-16 h-16"
                animate={spinAnim}
            >
                <BsSquareFill className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-60 left-8 text-orange-400 opacity-20 w-20 h-20"
                animate={spinAnim}
            >
                <MdGrid4X4 className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute bottom-40 left-32 text-yellow-600 opacity-25 w-20 h-20"
                animate={floatAnim}
            >
                <IoMdHappy className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-80 right-32 text-pink-500 opacity-20 w-16 h-16"
                animate={floatAnim}
            >
                <RiFlowerFill className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute top-24 right-8 text-purple-500 opacity-20 w-16 h-16"
                animate={floatAnim}
            >
                <GiButterfly className="w-full h-full" />
            </motion.div>

            <motion.div
                className="absolute bottom-16 right-24 text-green-500 opacity-20 w-14 h-14"
                animate={spinAnim}
            >
                <GiClover className="w-full h-full" />
            </motion.div>
        </>
    );
}
