'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Page transition variants
const pageVariants: Variants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 1.02,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

const slideVariants: Variants = {
    initial: {
        opacity: 0,
        x: 100
    },
    enter: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    exit: {
        opacity: 0,
        x: -100,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

const scaleVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.9
    },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    exit: {
        opacity: 0,
        scale: 1.1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

const curtainVariants: Variants = {
    initial: {
        scaleY: 0,
        transformOrigin: 'top'
    },
    enter: {
        scaleY: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    },
    exit: {
        scaleY: 0,
        transformOrigin: 'bottom',
        transition: {
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
}

interface PageTransitionProps {
    children: ReactNode
    className?: string
    variant?: 'fade' | 'slide' | 'scale' | 'curtain'
}

export default function PageTransition({
    children,
    className = '',
    variant = 'fade'
}: PageTransitionProps) {
    const pathname = usePathname()

    const getVariant = () => {
        switch (variant) {
            case 'slide':
                return slideVariants
            case 'scale':
                return scaleVariants
            case 'curtain':
                return curtainVariants
            default:
                return pageVariants
        }
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={getVariant()}
                className={className}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    )
}

// Loading Screen Transition
export function LoadingTransition({
    isLoading,
    children,
    loadingComponent
}: {
    isLoading: boolean
    children: ReactNode
    loadingComponent?: ReactNode
}) {
    const defaultLoader = (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-coral-50">
            <div className="text-center">
                <motion.div
                    animate={{
                        rotate: 360
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 font-medium"
                >
                    Loading Afroskultura...
                </motion.p>
            </div>
        </div>
    )

    return (
        <AnimatePresence mode="wait">
            {isLoading ? (
                <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {loadingComponent || defaultLoader}
                </motion.div>
            ) : (
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Staggered Content Animation
export function StaggeredContent({
    children,
    className = '',
    staggerDelay = 0.1
}: {
    children: ReactNode[]
    className?: string
    staggerDelay?: number
}) {
    return (
        <div className={className}>
            {children.map((child, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: index * staggerDelay,
                        ease: [0.25, 0.46, 0.45, 0.94]
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </div>
    )
}

// Route Change Loader
export function RouteChangeLoader() {
    return (
        <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-600 to-coral-500 z-50"
            style={{ transformOrigin: '0% 50%' }}
            transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
            }}
        />
    )
}

// Modal Transition
export function ModalTransition({
    isOpen,
    children,
    onClose,
    className = ''
}: {
    isOpen: boolean
    children: ReactNode
    onClose: () => void
    className?: string
}) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    
                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300
                        }}
                        className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
