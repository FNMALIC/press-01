'use client'

import React from "react";
import logo from "../images/logoTwo.png";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { FadeInUp } from "./animations/ScrollAnimations";

// orange  FCC062, FBB03B
// blue 2A2D9D, 21237B
type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="mt-20 md:mt-32">
      <FadeInUp>
        <div className="bg-gradient-to-tr from-[#2A2D9D] to-[#21237B] rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12 lg:p-16 text-white mx-auto">
          {/* Top section */}
          <motion.div 
            className="flex flex-col md:flex-row gap-6 md:gap-4 md:items-center justify-between w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image
              src={logo}
              alt="Ubuntu-X Logo"
              priority
              width={100}
              height={100}
              className="h-5 w-fit"
            />

            <div className="flex items-center gap-3 text-sm">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Facebook size={18} />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Twitter size={18} />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <Instagram size={18} />
              </motion.div>
              <span className="ml-2 font-medium">@ubuntu-x</span>
            </div>
          </motion.div>

          {/* Bottom section */}
          <motion.div 
            className="flex flex-col md:flex-row items-start md:items-center mt-12 md:mt-16 gap-4 md:gap-6 text-sm opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-white/80">© 2023 Ubuntu-X. All rights reserved.</p>
            
            <div className="flex flex-wrap gap-4 md:gap-6 md:ml-auto">
              <motion.p 
                className="hover:text-[#FCC062] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Terms of Service
              </motion.p>
              <motion.p 
                className="hover:text-[#FCC062] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Privacy Policy
              </motion.p>
              <motion.p 
                className="hover:text-[#FCC062] transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                Cookie Policy
              </motion.p>
            </div>
          </motion.div>
        </div>
      </FadeInUp>
    </footer>
  );
};

export default Footer;
