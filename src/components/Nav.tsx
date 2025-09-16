'use client'

import Image from "next/image";
import React, { useState } from "react";
import logo from "../images/logo.png";
import { ArrowDownRight, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// orange  FCC062, FBB03B
// blue 2A2D9D, 21237B

type Props = {};

const Nav = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 40
      }
    }
  };

  const menuItems = ["Home", "Features", "How it works", "FAQs", "Reviews"];

  return (
    <>
      <nav className="flex items-center justify-between relative z-50 py-2">
        <Image
          src={logo}
          alt="Logo"
          priority
          width={120}
          height={32}
          className="h-6 w-auto"
        />

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center flex-1 justify-center gap-10">
          {menuItems.map((item, index) => (
            <motion.p
              key={item}
              className="text-sm md:text-base font-medium tracking-wide cursor-pointer text-gray-800 hover:text-[#FCC062] transition-colors duration-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {item}
            </motion.p>
          ))}
        </div>

        {/* Desktop CTA Button */}
          <Link href="https://app-test.ubuntu-x.com" target="_blank" rel="noopener noreferrer">
              <motion.button
                  className="hidden lg:flex items-center gap-2 bg-gradient-to-b from-[#FCC062] to-[#FBB03B] rounded-md px-4 py-2 text-sm md:text-base text-black font-semibold shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                  <ArrowDownRight size={18} />
                  <span>Get Started</span>
              </motion.button>
          </Link>

          {/* Mobile Menu Button */}
        <motion.button
          className="lg:hidden p-2 z-50 relative"
          onClick={toggleMenu}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { rotate: 180 },
              closed: { rotate: 0 }
            }}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.div>
        </motion.button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={toggleMenu}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-[82%] max-w-sm bg-white shadow-2xl z-40 lg:hidden"
          >
            <div className="flex flex-col h-full pt-20 px-8">
              <div className="flex flex-col gap-6 mb-8">
                {menuItems.map((item, index) => (
                  <motion.p
                    key={item}
                    className="text-lg font-semibold cursor-pointer text-gray-800 hover:text-[#FCC062] transition-colors duration-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    onClick={toggleMenu}
                  >
                    {item}
                  </motion.p>
                ))}
              </div>

                <Link href="https://app-test.ubuntu-x.com" target="_blank" rel="noopener noreferrer">
                    <motion.button
                        className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#FCC062] to-[#FBB03B] rounded-md py-3 text-base text-black font-semibold mt-auto mb-8 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleMenu}
                    >
                        <ArrowDownRight size={18} />
                        <span>Get Started</span>
                    </motion.button>
                </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Nav;
