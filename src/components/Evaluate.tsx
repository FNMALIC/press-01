'use client'

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeInUp, ScaleIn, HoverScale } from "./animations/ScrollAnimations";
import { ChevronDown, ArrowRightLeft, Calculator } from "lucide-react";
import Image from "next/image";

// Import country flags
import CameroonFlag from "../images/Cameroon.png";
import BeninFlag from "../images/Benin.png";
import BurkinaFasoFlag from "../images/BurkinaFaso.png";
import ChinaFlag from "../images/China.png";
import EnglandFlag from "../images/England.png";
import FranceFlag from "../images/France.png";
import GhanaFlag from "../images/Ghana.png";
import IvoryCoastFlag from "../images/IvoryCoast.png";
import NigeriaFlag from "../images/Nigeria.png";
import UsaFlag from "../images/Usa.png";

// Import country backgrounds
import CameroonBg from "../images/countries background/cameroon.jpeg";
import BeninBg from "../images/countries background/benin.jpeg";
import CanadaBg from "../images/countries background/canada.jpeg";
import ChinaBg from "../images/countries background/china.jpeg";
import DubaiBg from "../images/countries background/dubai.jpeg";
import FranceBg from "../images/countries background/france.jpeg";
import GermanyBg from "../images/countries background/germany.jpeg";
import GhanaBg from "../images/countries background/ghana.jpeg";
import ItalyBg from "../images/countries background/italy.jpeg";
import KenyaBg from "../images/countries background/kenya.jpeg";
import NigeriaBg from "../images/countries background/nigeria.jpeg";
import SouthAfricaBg from "../images/countries background/south_africa.jpeg";
import SpainBg from "../images/countries background/spain.jpeg";
import UkBg from "../images/countries background/uk.jpeg";
import UsaBg from "../images/countries background/usa.jpeg";

type Country = {
    id: string;
    name: string;
    code: string;
    currency: string;
    flag: any;
    background: any;
    exchangeRate: number;
    canSendFrom: boolean;
    canSendTo: boolean;
};

type Props = {
    show?: boolean;
    title?: string;
    isFromCountry?: boolean;
    onCountrySelect?: (country: Country) => void;
    selectedCountry?: Country;
    amount?: string;
    onAmountChange?: (amount: string) => void;
};

const Evaluate = () => {
    const [fromCountry, setFromCountry] = useState<Country | null>(null);
    const [toCountry, setToCountry] = useState<Country | null>(null);
    const [fromAmount, setFromAmount] = useState<string>("");
    const [toAmount, setToAmount] = useState<string>("");
    const [exchangeRate, setExchangeRate] = useState<number>(0);
    const [fees, setFees] = useState<number>(0);
    const [totalCost, setTotalCost] = useState<number>(0);

    const countries: Country[] = [
        {
            id: "cameroon",
            name: "Cameroon",
            code: "CM",
            currency: "FCFA",
            flag: CameroonFlag,
            background: CameroonBg,
            exchangeRate: 1,
            canSendFrom: true,
            canSendTo: true,
        },
        {
            id: "benin",
            name: "Benin",
            code: "BJ",
            currency: "FCFA",
            flag: BeninFlag,
            background: BeninBg,
            exchangeRate: 1,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "burkina-faso",
            name: "Burkina Faso",
            code: "BF",
            currency: "FCFA",
            flag: BurkinaFasoFlag,
            background: CameroonBg,
            exchangeRate: 1,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "china",
            name: "China",
            code: "CN",
            currency: "CNY",
            flag: ChinaFlag,
            background: ChinaBg,
            exchangeRate: 0.0012,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "england",
            name: "United Kingdom",
            code: "GB",
            currency: "GBP",
            flag: EnglandFlag,
            background: UkBg,
            exchangeRate: 0.0013,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "france",
            name: "France",
            code: "FR",
            currency: "EUR",
            flag: FranceFlag,
            background: FranceBg,
            exchangeRate: 0.0015,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "ghana",
            name: "Ghana",
            code: "GH",
            currency: "GHS",
            flag: GhanaFlag,
            background: GhanaBg,
            exchangeRate: 0.024,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "ivory-coast",
            name: "Ivory Coast",
            code: "CI",
            currency: "FCFA",
            flag: IvoryCoastFlag,
            background: CameroonBg,
            exchangeRate: 1,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "nigeria",
            name: "Nigeria",
            code: "NG",
            currency: "NGN",
            flag: NigeriaFlag,
            background: NigeriaBg,
            exchangeRate: 0.67,
            canSendFrom: false,
            canSendTo: true,
        },
        {
            id: "usa",
            name: "United States",
            code: "US",
            currency: "USD",
            flag: UsaFlag,
            background: UsaBg,
            exchangeRate: 0.0016,
            canSendFrom: false,
            canSendTo: true,
        },
    ];

    // Set default countries
    useEffect(() => {
        const defaultFromCountry = countries.find(c => c.id === "cameroon");
        const defaultToCountry = countries.find(c => c.id === "nigeria");
        if (defaultFromCountry) setFromCountry(defaultFromCountry);
        if (defaultToCountry) setToCountry(defaultToCountry);
    }, []);

    // Calculate exchange rate and fees
    useEffect(() => {
        if (fromCountry && toCountry && fromAmount) {
            const amount = parseFloat(fromAmount);
            if (!isNaN(amount) && amount > 0) {
                const rate = fromCountry.id === "cameroon"
                    ? toCountry.exchangeRate
                    : (1 / fromCountry.exchangeRate) * toCountry.exchangeRate;

                setExchangeRate(rate);

                const convertedAmount = amount * rate;
                setToAmount(convertedAmount.toFixed(2));

                const feeRate = amount < 50000 ? 0.01 : 0.005;
                const calculatedFees = amount * feeRate;
                setFees(calculatedFees);

                setTotalCost(amount + calculatedFees);
            }
        }
    }, [fromCountry, toCountry, fromAmount]);

    const CountrySelector = ({
                                 title,
                                 selectedCountry,
                                 onSelect,
                                 isFromSelector = false
                             }: {
        title: string;
        selectedCountry: Country | null;
        onSelect: (country: Country) => void;
        isFromSelector?: boolean;
    }) => {
        const [isOpen, setIsOpen] = useState(false);

        const availableCountries = isFromSelector
            ? countries.filter(c => c.canSendFrom)
            : countries.filter(c => c.canSendTo);

        return (
            <div className="relative">
                <motion.p
                    className="font-semibold text-gray-800 mb-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {title}
                </motion.p>

                <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full flex items-center gap-3 p-3 border border-gray-300 rounded-lg bg-white hover:border-[#FCC062] focus:border-[#FCC062] focus:ring-2 focus:ring-[#FCC062]/20 transition-all duration-200"
                    >
                        {selectedCountry ? (
                            <>
                                <Image
                                    src={selectedCountry.flag}
                                    alt={selectedCountry.name}
                                    width={24}
                                    height={16}
                                    className="rounded object-cover"
                                />
                                <span className="flex-1 text-left font-medium text-gray-700">
                  {selectedCountry.name}
                </span>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {selectedCountry.currency}
                </span>
                            </>
                        ) : (
                            <span className="flex-1 text-left text-gray-400">Select country</span>
                        )}
                        <ChevronDown
                            size={20}
                            className={`text-gray-400 transition-transform duration-200 ${
                                isOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scaleY: 0.8 }}
                                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                                exit={{ opacity: 0, y: -10, scaleY: 0.8 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                            >
                                {availableCountries.map((country) => (
                                    <motion.button
                                        key={country.id}
                                        onClick={() => {
                                            onSelect(country);
                                            setIsOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg"
                                        whileHover={{ backgroundColor: "rgba(252, 192, 98, 0.1)" }}
                                    >
                                        <Image
                                            src={country.flag}
                                            alt={country.name}
                                            width={24}
                                            height={16}
                                            className="rounded object-cover"
                                        />
                                        <span className="flex-1 text-left font-medium text-gray-700">
                      {country.name}
                    </span>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {country.currency}
                    </span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        );
    };

    return (
        <section
            className="py-12 md:py-20 px-4 relative bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{
                backgroundImage: toCountry ? `linear-gradient(rgba(255,255,255,0.85), rgba(255,255,255,0.95)), url(${toCountry.background.src})` : 'linear-gradient(to br, #f9fafb, #ffffff, #eff6ff)',
            }}
        >

            <div className="max-w-5xl mx-auto relative z-10">
                <FadeInUp>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">
                            Check It. Send It. Love It.
                        </h2>
                        <p className="text-lg md:text-xl text-gray-600 font-medium">
                            Our live calculator shows exactly what they'll get
                        </p>
                    </div>
                </FadeInUp>

                <ScaleIn delay={300}>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 max-w-4xl mx-auto">

                        {/* Country Selection */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 relative">
                            {/* From Country */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                            >
                                <CountrySelector
                                    title="Send From"
                                    selectedCountry={fromCountry}
                                    onSelect={setFromCountry}
                                    isFromSelector={true}
                                />

                                {/* Amount Input */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amount to Send
                                    </label>
                                    <motion.input
                                        type="number"
                                        value={fromAmount}
                                        onChange={(e) => setFromAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        className="w-full p-4 border border-gray-300 rounded-xl focus:border-[#FCC062] focus:ring-2 focus:ring-[#FCC062]/20 transition-all duration-200 text-lg"
                                        whileFocus={{ scale: 1.01 }}
                                    />
                                    {fromCountry && fromAmount && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            {parseFloat(fromAmount).toLocaleString()} {fromCountry.currency}
                                        </p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Exchange Arrow */}
                            <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                <motion.div
                                    className="bg-gradient-to-r from-[#FCC062] to-[#FBB03B] p-4 rounded-full shadow-lg border-4 border-white"
                                    whileHover={{ scale: 1.1, rotate: 180 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRightLeft className="text-white" size={24} />
                                </motion.div>
                            </div>

                            {/* Mobile Exchange Arrow */}
                            <div className="lg:hidden flex justify-center -my-4">
                                <motion.div
                                    className="bg-gradient-to-r from-[#FCC062] to-[#FBB03B] p-3 rounded-full shadow-lg border-4 border-white"
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <ArrowRightLeft className="text-white rotate-90" size={20} />
                                </motion.div>
                            </div>

                            {/* To Country */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, duration: 0.6 }}
                            >
                                <CountrySelector
                                    title="Send To"
                                    selectedCountry={toCountry}
                                    onSelect={setToCountry}
                                    isFromSelector={false}
                                />

                                {/* Converted Amount Display */}
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Recipient Receives
                                    </label>
                                    <div className="w-full p-4 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl">
                    <span className="text-2xl font-bold text-green-700">
                      {toAmount || '0.00'}
                    </span>
                                        {toCountry && (
                                            <span className="text-lg text-green-600 ml-2 font-medium">
                        {toCountry.currency}
                      </span>
                                        )}
                                    </div>
                                    {exchangeRate > 0 && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Rate: 1 {fromCountry?.currency} = {exchangeRate.toFixed(4)} {toCountry?.currency}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        </div>

                        {/* Calculation Summary */}
                        {fromAmount && parseFloat(fromAmount) > 0 && (
                            <motion.div
                                className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-xl border-2 border-blue-100 mb-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <Calculator className="text-[#21237B]" size={24} />
                                    <h3 className="text-lg font-bold text-gray-800">Transaction Summary</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-sm text-gray-600 mb-1">Amount to Send</p>
                                        <p className="font-bold text-xl text-gray-800">
                                            {parseFloat(fromAmount).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{fromCountry?.currency}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-sm text-gray-600 mb-1">Transaction Fee</p>
                                        <p className="font-bold text-xl text-orange-600">
                                            {fees.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{fromCountry?.currency}</p>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                                        <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                                        <p className="font-bold text-xl text-[#21237B]">
                                            {totalCost.toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-500">{fromCountry?.currency}</p>
                                    </div>
                                </div>

                                <div className="mt-4 p-3 bg-white/80 rounded-lg border border-gray-200">
                                    <p className="text-sm text-gray-600 font-medium mb-1">Fee Information:</p>
                                    <p className="text-sm text-gray-500">
                                        Ubuntu-X charges {parseFloat(fromAmount) < 50000 ? '1%' : '0.5%'} fee for this transaction.
                                        {parseFloat(fromAmount) < 50000 && ' Transactions over 50,000 FCFA get lower rates.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                        >
                            <HoverScale scale={1.05}>
                                <motion.button
                                    className="bg-gradient-to-r from-[#2A2D9D] to-[#21237B] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 min-w-[200px]"
                                    whileTap={{ scale: 0.95 }}
                                    disabled={!fromAmount || !fromCountry || !toCountry}
                                >
                                    <Calculator size={20} />
                                    Start Transfer
                                </motion.button>
                            </HoverScale>

                            <HoverScale scale={1.02}>
                                <motion.button
                                    className="border-2 border-[#FCC062] text-[#21237B] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#FCC062]/10 transition-colors duration-200 min-w-[200px]"
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setFromAmount('');
                                        setToAmount('');
                                        setFees(0);
                                        setTotalCost(0);
                                    }}
                                >
                                    Reset Calculator
                                </motion.button>
                            </HoverScale>
                        </motion.div>
                    </div>
                </ScaleIn>
            </div>
        </section>
    );
};

export default Evaluate;