'use client'

import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInUp, StaggeredFadeInUp } from "./animations/ScrollAnimations";

type Props = {
    id: number;
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
};

const Faq = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (id: number) => {
        setOpenFaq(openFaq === id ? null : id);
    };

    const FaqComp = (props: Props) => {
        return (
            <motion.div
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <motion.div
                    className={`
            relative bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100
            cursor-pointer transition-all duration-300 hover:shadow-lg
            ${props.isOpen ? 'bg-gradient-to-br from-[#FCC062]/5 to-[#FBB03B]/5 border-[#FCC062]/20 shadow-md' : 'hover:bg-gray-50/50'}
          `}
                    onClick={props.onToggle}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                ${props.isOpen ? 'bg-[#FCC062] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#FCC062]/10 group-hover:text-[#FCC062]'}
              `}>
                                <HelpCircle size={18} />
                            </div>
                            <div className="flex-1">
                                <h3 className={`
                  font-semibold text-lg md:text-xl mb-2 transition-colors duration-300
                  ${props.isOpen ? 'text-[#21237B]' : 'text-gray-800 group-hover:text-[#21237B]'}
                `}>
                                    {props.question}
                                </h3>

                                <AnimatePresence>
                                    {props.isOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <motion.p
                                                className="text-gray-600 leading-relaxed text-base md:text-lg mt-2"
                                                initial={{ y: -10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                {props.answer}
                                            </motion.p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <motion.div
                            animate={{ rotate: props.isOpen ? 180 : 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className={`
                flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${props.isOpen ? 'bg-[#FCC062] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#FCC062]/10 group-hover:text-[#FCC062]'}
              `}
                        >
                            <ChevronDown size={20} />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    const FaqData: Omit<Props, 'isOpen' | 'onToggle'>[] = [
        {
            id: 1,
            question: "How do I create an account?",
            answer: "Creating an account with Ubuntu-X is simple and secure. Visit our website or download our mobile app, click 'Sign Up', provide your email address and create a strong password. You'll need to verify your email and complete our KYC process by uploading a valid ID document. Once approved, you can start sending money worldwide.",
        },
        {
            id: 2,
            question: "What fees do you charge for transfers?",
            answer: "Ubuntu-X offers competitive and transparent pricing. We charge only 1% for transactions under 50,000 FCFA, with even lower rates for higher amounts. There are no hidden fees - you'll see exactly what you pay upfront before confirming any transaction. Our fees are significantly lower than traditional banks and money transfer services.",
        },
        {
            id: 3,
            question: "How long do transfers take?",
            answer: "Most transfers with Ubuntu-X are completed within minutes. Domestic transfers typically take 1-5 minutes, while international transfers can take anywhere from 5 minutes to 1 hour depending on the destination country and payment method. You'll receive real-time updates on your transfer status through our app and SMS notifications.",
        },
        {
            id: 4,
            question: "Is Ubuntu-X secure?",
            answer: "Absolutely. Ubuntu-X uses bank-level security measures including 256-bit SSL encryption, two-factor authentication, and advanced fraud detection systems. We're fully regulated and compliant with international financial regulations. Your personal information and funds are protected by multiple layers of security, and we never store your sensitive payment information.",
        },
        {
            id: 5,
            question: "Which cryptocurrencies can I exchange?",
            answer: "Ubuntu-X supports major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), Litecoin (LTC), and several stablecoins like USDT and USDC. You can easily convert between cryptocurrencies and traditional fiat currencies. Our exchange rates are competitive and updated in real-time to ensure you get the best value for your transactions.",
        },
        {
            id: 6,
            question: "How do virtual cards work?",
            answer: "Ubuntu-X virtual cards work like regular debit cards but exist digitally in your app. Once you create a virtual card, you can use it for online purchases, subscriptions, and any transaction that accepts card payments. You can set spending limits, freeze/unfreeze the card instantly, and track all transactions in real-time through our app. It's perfect for secure online shopping and managing your digital expenses.",
        },
    ];

    return (
        <section className="py-16 md:py-24 px-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-[#FCC062]/5"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FCC062]/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#21237B]/10 rounded-full blur-3xl"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <FadeInUp>
                    <div className="text-center mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 bg-[#FCC062]/10 text-[#21237B] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <MessageCircle size={16} />
                            Support Center
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                            Frequently <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FCC062] to-[#FBB03B]">Asked</span> Questions
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                            Find quick answers to the most common questions about our platform
                        </p>
                    </div>
                </FadeInUp>

                <FadeInUp delay={200}>
                    <div className="max-w-5xl mx-auto">
                        <div className="grid gap-6 md:gap-8">
                            {FaqData.map((faq, index) => (
                                <motion.div
                                    key={faq.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5 }}
                                >
                                    <FaqComp
                                        {...faq}
                                        isOpen={openFaq === faq.id}
                                        onToggle={() => toggleFaq(faq.id)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </FadeInUp>



</div>
        </section>


);
};

export default Faq;