'use client'

import Image from "next/image";
import React from "react";
import Mask from "../images/maskTwo.png";
import Phone from "../images/topLeftPhone.png";
import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { FadeInUp, FadeInLeft, FadeInRight, FloatingAnimation, HoverScale } from "./animations/ScrollAnimations";
import Link from "next/link";

// orange  FCC062, FBB03B
// blue 2A2D9D, 21237B
type Props = {};

const Banner = (props: Props) => {
  return (
    <section className="py-8 md:py-12">
      <FadeInUp>
        <div className="bg-gradient-to-tr from-[#FCC062] to-[#FBB03B] rounded-xl md:rounded-2xl flex flex-col lg:flex-row gap-6 lg:gap-0 p-6 sm:p-8 md:p-12 lg:p-16 relative overflow-hidden">
          {/* Background Pattern */}
          <Image
            src={Mask}
            alt="background pattern"
            className="absolute inset-0 w-full h-full object-cover rounded-xl md:rounded-2xl opacity-30"
          />
          
          {/* Content Section */}
          <div className="flex-1 z-10 text-[#21237B] lg:pr-8">
            <motion.h2 
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 md:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              UBUNTU-X is also on mobile
            </motion.h2>
            
            <motion.p 
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium py-4 md:py-6 max-w-[90%] md:max-w-[500px] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Download the mobile version <br /> for both android and IOS
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <HoverScale scale={1.05}>
                  <Link href="https://app-test.ubuntu-x.com" target="_blank" rel="noopener noreferrer">
                <motion.button 
                  className="flex items-center gap-2 bg-gradient-to-b from-[#2A2D9D] to-[#21237B] text-white rounded-lg px-4 py-3 text-sm font-medium shadow-lg"
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={16} />
                  <span>Start Sending Money</span>
                </motion.button>
                  </Link>
              </HoverScale>

              <HoverScale scale={1.02}>
                <motion.button 
                  className="flex items-center gap-2 px-4 py-3 text-sm font-medium border border-[#21237B]/20 rounded-lg hover:bg-[#21237B]/10 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight size={16} />
                  <span>Learn More</span>
                </motion.button>
              </HoverScale>
            </motion.div>
          </div>
          
          {/* Phone Image Section - Properly contained */}
          <div className="flex-1 flex justify-center lg:justify-end items-center relative z-10 min-h-[200px] lg:min-h-[300px]">
            <FloatingAnimation duration={4} yOffset={20}>
              <FadeInRight delay={800}>
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[350px] lg:max-w-[400px] h-auto">
                  <Image
                    src={Phone}
                    alt="mobile phone mockup"
                    className="w-full h-auto object-contain drop-shadow-2xl"
                    priority
                  />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#2A2D9D]/20 to-transparent rounded-full blur-xl -z-10 scale-110"></div>
                </div>
              </FadeInRight>
            </FloatingAnimation>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
};

export default Banner;
