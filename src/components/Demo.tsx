import Image from "next/image";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Smartphone } from "lucide-react";
import DemoImage from "../images/phone.png";
import Mask from "../images/Mask.png";

type Props = {};

const Demo = (props: Props) => {
    const [isTransferring, setIsTransferring] = useState(false);
    const [showReceived, setShowReceived] = useState(false);
    const [animationCount, setAnimationCount] = useState(0);

    useEffect(() => {
        const startAnimation = () => {
            setIsTransferring(true);
            setShowReceived(false);

            setTimeout(() => {
                setIsTransferring(false);
                setShowReceived(true);
                setTimeout(() => {
                    setShowReceived(false);
                    setAnimationCount(prev => prev + 1);
                }, 2000);
            }, 2000);
        };

        const initialTimeout = setTimeout(startAnimation, 1000);
        const interval = setInterval(startAnimation, 6000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimeout);
        };
    }, []);

    return (
        <div className="py-16 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    How it all <span className="text-[#FCC062]">works</span>
                </h2>
                <p className="text-lg text-gray-600 font-medium">
                    As simple as 3 clicks
                </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
                <div className="flex md:flex-row flex-col items-center justify-center gap-16 md:gap-24 mb-16">
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="relative">
                            <Image src={DemoImage} alt="Sender Phone" width={280} height={280} className="drop-shadow-2xl" />

                            <motion.div
                                className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-[#FCC062] text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center gap-2"
                                animate={isTransferring ? {
                                    scale: [1, 1.1, 1],
                                    boxShadow: ["0 10px 20px rgba(252, 192, 98, 0.3)", "0 15px 30px rgba(252, 192, 98, 0.5)", "0 10px 20px rgba(252, 192, 98, 0.3)"]
                                } : {
                                    scale: 1,
                                    boxShadow: "0 10px 20px rgba(252, 192, 98, 0.3)"
                                }}
                                transition={{ duration: 0.5, repeat: isTransferring ? Infinity : 0 }}
                            >
                                <motion.div
                                    animate={isTransferring ? { rotate: 360 } : { rotate: 0 }}
                                    transition={{ duration: 1, repeat: isTransferring ? Infinity : 0, ease: "linear" }}
                                >
                                    <Send size={18} />
                                </motion.div>
                                {isTransferring ? "Sending..." : "Send $100"}
                            </motion.div>

                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
                                <p className="text-sm font-semibold text-gray-700">Sender</p>
                            </div>

                            <AnimatePresence>
                                {isTransferring && (
                                    <motion.div
                                        initial={{ scale: 1, opacity: 0.5 }}
                                        animate={{ scale: 1.2, opacity: 0 }}
                                        exit={{ scale: 1, opacity: 0 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="absolute inset-0 bg-[#FCC062] rounded-[2.5rem] pointer-events-none"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    <div className="relative flex-1 max-w-xs">
                        <AnimatePresence mode="wait">
                            {isTransferring && (
                                <>
                                    <motion.div
                                        key={`money-${animationCount}`}
                                        initial={{ x: -120, opacity: 0, scale: 0.3, rotate: -45 }}
                                        animate={{ x: 120, opacity: [0, 1, 1, 0], scale: [0.3, 1.2, 1, 0.8], rotate: 45 }}
                                        exit={{ x: 200, opacity: 0, scale: 0.3 }}
                                        transition={{ duration: 2, ease: "easeInOut" }}
                                        className="absolute top-1/2 left-0 transform -translate-y-1/2 z-20"
                                    >
                                        <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 border-2 border-white">
                                            <motion.span
                                                className="text-xl"
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 0.5, repeat: Infinity }}
                                            >
                                                💵
                                            </motion.span>
                                            <span className="font-bold text-lg">$100</span>
                                        </div>
                                    </motion.div>

                                    {[0, 0.2, 0.4, 0.6].map((delay, i) => (
                                        <motion.div
                                            key={`wave-${animationCount}-${i}`}
                                            initial={{ scale: 0, opacity: 0.8 }}
                                            animate={{ scale: [0, 2, 4], opacity: [0.8, 0.3, 0] }}
                                            transition={{ duration: 1.5, delay, repeat: 1 }}
                                            className="absolute top-1/2 left-8 transform -translate-y-1/2 w-6 h-6 bg-[#FCC062] rounded-full"
                                        />
                                    ))}

                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={`particle-${animationCount}-${i}`}
                                            initial={{
                                                x: -50,
                                                y: 0,
                                                opacity: 0,
                                                scale: 0
                                            }}
                                            animate={{
                                                x: Math.random() * 200 - 100,
                                                y: Math.random() * 100 - 50,
                                                opacity: [0, 1, 0],
                                                scale: [0, 1, 0]
                                            }}
                                            transition={{
                                                duration: 2,
                                                delay: Math.random() * 0.5,
                                                ease: "easeOut"
                                            }}
                                            className="absolute top-1/2 left-1/4 w-2 h-2 bg-yellow-400 rounded-full"
                                        />
                                    ))}
                                </>
                            )}
                        </AnimatePresence>

                        <motion.div
                            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#FCC062] to-[#2A2D9D] transform -translate-y-1/2 rounded-full"
                            animate={isTransferring ? {
                                opacity: [0.3, 1, 0.3],
                                scaleY: [1, 1.5, 1]
                            } : { opacity: 0.3, scaleY: 1 }}
                            transition={{ duration: 2, repeat: isTransferring ? Infinity : 0 }}
                        />
                    </div>

                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="relative">
                            <Image src={DemoImage} alt="Receiver Phone" width={280} height={280} className="drop-shadow-2xl" />

                            <AnimatePresence>
                                {showReceived && (
                                    <motion.div
                                        key={`notification-${animationCount}`}
                                        initial={{ scale: 0, opacity: 0, y: -30, rotateX: 90 }}
                                        animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                                        exit={{ scale: 0, opacity: 0, y: -30, rotateX: -90 }}
                                        transition={{ duration: 0.6, ease: "easeOut" }}
                                        className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-20 border-2 border-white"
                                    >
                                        <motion.div
                                            animate={{ scale: 1.2 }}
                                            transition={{ duration: 0.5, repeat: 2, repeatType: "reverse" }}
                                        >
                                            <CheckCircle size={24} />
                                        </motion.div>
                                        <div>
                                            <p className="font-bold text-base">Money Received!</p>
                                            <p className="text-sm opacity-90">+$100.00</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div
                                animate={showReceived ? {
                                    x: [0, -3, 3, -2, 2, 0],
                                    transition: { duration: 0.6, ease: "easeInOut" }
                                } : { x: 0 }}
                                className="absolute inset-0"
                            >
                                {showReceived && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 1 }}
                                        animate={{
                                            opacity: [0, 0.4, 0],
                                            scale: [1, 1.05, 1]
                                        }}
                                        transition={{ duration: 1.5, repeat: 1 }}
                                        className="absolute inset-0 bg-green-400 rounded-[2.5rem] blur-sm"
                                    />
                                )}
                            </motion.div>

                            <AnimatePresence>
                                {showReceived && (
                                    <>
                                        {[...Array(12)].map((_, i) => (
                                            <motion.div
                                                key={`success-particle-${animationCount}-${i}`}
                                                initial={{
                                                    scale: 0,
                                                    opacity: 0,
                                                    x: 140,
                                                    y: 140
                                                }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    opacity: [0, 1, 0],
                                                    x: 140 + Math.cos((i * 360) / 12 * Math.PI / 180) * 80,
                                                    y: 140 + Math.sin((i * 360) / 12 * Math.PI / 180) * 80,
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    delay: i * 0.1,
                                                    ease: "easeOut"
                                                }}
                                                className="absolute w-3 h-3 bg-green-400 rounded-full pointer-events-none"
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>

                            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md">
                                <p className="text-sm font-semibold text-gray-700">Receiver</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    className="flex flex-col md:flex-row justify-center items-center gap-8 mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    {[
                        { step: "01", title: "Select Contact", desc: "Choose who to send money to" },
                        { step: "02", title: "Enter Amount", desc: "Type the amount you want to send" },
                        { step: "03", title: "Send & Done", desc: "Tap send and it's instantly transferred" }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className="text-center max-w-xs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                        >
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FCC062] to-[#e6ad55] rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto shadow-lg">
                                {item.step}
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                            <p className="text-gray-600 text-sm">{item.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>


            </div>
        </div>
    );
};

export default Demo;