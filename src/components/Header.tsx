'use client'

import React from "react";
import Nav from "./Nav";
import CountryCarosel from "./CountryCarosel";
import Mask from "../images/Mask.png";
import Phone from "../images/leftPhone.png";
import Image from "next/image";
import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { FadeInUp, FadeInLeft, FadeInRight, FloatingAnimation, Parallax, HoverScale } from "./animations/ScrollAnimations";
import Link from "next/link";

type Props = {};

const Header = (props: Props) => {
    return (
        <header className="py-6 md:py-8 font-semibold">
            <FadeInUp>
                <Nav />
            </FadeInUp>

            <FadeInUp delay={200} className="my-8 md:my-10">
                <div className="bg-gradient-to-tr from-[#2A2D9D] to-[#21237B] rounded-xl md:rounded-2xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12 md:p-12 lg:p-16 p-6 sm:p-8 relative overflow-hidden max-h-[600px] lg:max-h-[500px]">
                    {/* Background with parallax effect */}
                    <Parallax speed={0.3}>
                        <Image
                            src={Mask}
                            alt="mask"
                            className="absolute inset-0 w-full h-full object-cover opacity-20"
                        />
                    </Parallax>

                    {/* Content Section */}
                    <motion.div
                        className="flex-1 z-10 text-center lg:text-left max-w-xl"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl text-[#FBB03B] font-bold leading-tight mb-4 lg:mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Send. Receive. Pay
                        </motion.h1>

                        <motion.p
                            className="text-white/90 text-base lg:text-lg leading-relaxed mb-8 max-w-md mx-auto lg:mx-0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            Fast, secure, and affordable transfers to your loved ones across the globe with just a few clicks.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <Link href="https://app-test.ubuntu-x.com" target="_blank" rel="noopener noreferrer">
                            <HoverScale scale={1.05}>
                                <motion.button
                                    className="flex items-center gap-3 bg-gradient-to-b from-[#FCC062] to-[#FBB03B] rounded-lg px-6 py-3 text-base font-semibold text-black shadow-lg hover:shadow-xl transition-shadow"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Send size={18} />
                                    <span>Start sending</span>
                                </motion.button>
                            </HoverScale>
                            </Link>

                            <HoverScale scale={1.02}>
                                <motion.button
                                    className="flex items-center text-white gap-3 px-6 py-3 text-base font-medium border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <ArrowRight size={18} />
                                    <span>Learn More</span>
                                </motion.button>
                            </HoverScale>
                        </motion.div>
                    </motion.div>

                    {/* Phone Image Section */}
                    <div className="flex-shrink-0 relative z-10 lg:flex-1 flex justify-center lg:justify-end">
                        <FloatingAnimation duration={4} yOffset={12}>
                            <FadeInRight delay={600}>
                                <div className="relative">
                                    <Image
                                        src={Phone}
                                        alt="phone"
                                        className="w-48 sm:w-56 md:w-64 lg:w-72 xl:w-80 h-auto object-contain drop-shadow-2xl"
                                        priority
                                    />
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#FCC062]/15 to-transparent rounded-full blur-2xl -z-10 scale-105"></div>
                                </div>
                            </FadeInRight>
                        </FloatingAnimation>
                    </div>
                </div>
            </FadeInUp>

            <FadeInUp delay={400}>
                <CountryCarosel />
            </FadeInUp>
        </header>
    );
};

export default Header;